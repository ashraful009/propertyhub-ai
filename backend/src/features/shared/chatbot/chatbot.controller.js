const Groq = require('groq-sdk');
const Property = require('../properties/property.model');
const mongoose = require('mongoose');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getSimilarProperties = async (companyId, category, currentPropertyId) => {
  try {
    const filter = {
      status: 'approved',
      isActive: true,
      category,
      _id: { $ne: currentPropertyId }
    };
    if (companyId) {
      filter.companyId = companyId;
    }
    const properties = await Property.find(filter)
      .select('title price address city category landSize totalFloors flatTypes villaDetails landDetails')
      .limit(3)
      .lean();
    return properties;
  } catch (error) {
    console.error('Error fetching similar properties:', error);
    return [];
  }
};

const streamPropertyChat = async (req, res) => {
  const { id } = req.params;
  const { message, history = [] } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!message) {
    res.write('data: {"error": "Message is required"}\n\n');
    return res.end();
  }

  try {
    // 1. Fetch Property Data
    const property = await Property.findById(id).populate('companyId', 'name email phone').lean();
    if (!property) {
      res.write('data: {"error": "Property not found"}\n\n');
      return res.end();
    }

    // 2. Build System Prompt
    const systemPrompt = `
You are an expert Real Estate AI Assistant for the platform FlatSell.
You are currently helping a user who is viewing a specific property.
ONLY answer questions related to this specific property. 
If the user asks about politics, sports, or other unrelated topics, politely refuse and guide them back to real estate.
If you do not know the answer based on the property details provided below, DO NOT invent information. Say "এই তথ্যটা আমার কাছে নেই, এজেন্টের সাথে যোগাযোগ করুন".
For any booking or payment related queries, advise guest users to log in.
Always respond in the language the user is speaking (Bengali/Banglish/English).

PROPERTY DETAILS:
Title: ${property.title}
Category: ${property.category}
Price: BDT ${property.price}
Address: ${property.address}, ${property.city}
Description: ${property.description}
Company/Seller: ${property.companyId?.name} (Phone: ${property.companyId?.phone})

Category Specific Details:
${property.category === 'apartment' ? JSON.stringify({ totalFloors: property.totalFloors, unitsPerFloor: property.unitsPerFloor, flatTypes: property.flatTypes }) : ''}
${property.category === 'villa' ? JSON.stringify(property.villaDetails) : ''}
${property.category === 'land' ? JSON.stringify(property.landDetails) : ''}
`;

    // 3. Define Tool
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_similar_properties',
          description: 'Suggest similar properties in the same category (and optionally same company).',
          parameters: {
            type: 'object',
            properties: {
              companyId: { type: 'string', description: 'The ID of the company' },
              category: { type: 'string', description: 'The property category (apartment, villa, land)' }
            },
            required: ['category']
          }
        }
      }
    ];

    let messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // 4. Initial Groq API Call
    let stream = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      tools,
      tool_choice: 'auto',
      stream: true,
    });

    let toolCallName = '';
    let toolCallArgs = '';
    let toolCallId = '';
    let isToolCall = false;

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta || {};

      if (delta.tool_calls && delta.tool_calls.length > 0) {
        isToolCall = true;
        const tc = delta.tool_calls[0];
        if (tc.id) toolCallId = tc.id;
        if (tc.function?.name) toolCallName = tc.function.name;
        if (tc.function?.arguments) toolCallArgs += tc.function.arguments;
      } else if (delta.content && !isToolCall) {
        // Stream text immediately
        const safeContent = JSON.stringify({ content: delta.content });
        res.write(`data: ${safeContent}\n\n`);
      }
    }

    // 5. Handle Tool Execution
    if (isToolCall && toolCallName === 'get_similar_properties') {
      try {
        const args = JSON.parse(toolCallArgs || '{}');
        // We use the current property's companyId if they just say "similar properties"
        const compId = args.companyId || property.companyId?._id?.toString();
        const cat = args.category || property.category;
        
        const similarProps = await getSimilarProperties(compId, cat, property._id);
        
        // Append assistant's tool call request
        messages.push({
          role: 'assistant',
          tool_calls: [
            {
              id: toolCallId,
              type: 'function',
              function: { name: toolCallName, arguments: toolCallArgs }
            }
          ]
        });

        // Append tool result
        messages.push({
          role: 'tool',
          tool_call_id: toolCallId,
          name: toolCallName,
          content: JSON.stringify(similarProps)
        });

        // 6. Second Stream with tool results
        const secondStream = await groq.chat.completions.create({
          messages,
          model: 'llama-3.3-70b-versatile',
          stream: true,
        });

        for await (const chunk of secondStream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            const safeContent = JSON.stringify({ content });
            res.write(`data: ${safeContent}\n\n`);
          }
        }
      } catch (err) {
        console.error('Tool execution error:', err);
        const safeError = JSON.stringify({ content: '\n[Error fetching similar properties]' });
        res.write(`data: ${safeError}\n\n`);
      }
    }

    res.write('data: {"done": true}\n\n');
    res.end();

  } catch (error) {
    console.error('Chatbot Stream Error:', error);
    res.write(`data: {"error": "Failed to generate response."}\n\n`);
    res.end();
  }
};

module.exports = {
  streamPropertyChat
};
