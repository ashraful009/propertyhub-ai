const Groq = require('groq-sdk');
const Property = require('../properties/property.model');
const BookingPolicy = require('../policies/bookingPolicy.model');
const Policy = require('../policies/policy.model');
const PlatformSettings = require('../../admin/settings/platformSettings.model');
const { getApprovedPropertiesService } = require('../properties/property.service');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const executeSearchProperties = async (args) => {
  try {
    const query = { limit: 5 };
    if (args.category) query.category = args.category;
    if (args.city) query.city = args.city;
    if (args.minPrice) query.minPrice = args.minPrice;
    if (args.maxPrice) query.maxPrice = args.maxPrice;
    if (args.companyId) query.companyId = args.companyId;

    const result = await getApprovedPropertiesService(query);
    return result.properties.map(p => ({
      _id: p._id,
      title: p.title,
      price: p.price,
      city: p.city,
      category: p.category,
      mainImage: p.mainImage,
      bookingMoneyPercentage: p.bookingMoneyPercentage,
      bookingMoneyAmount: p.bookingMoneyAmount
    }));
  } catch {
    return [];
  }
};

const executeGetPolicyInfo = async (args, property) => {
  try {
    if (args.topic === 'booking') {
      const companyId = property.companyId?._id || property.companyId;
      const policy = await BookingPolicy.findOne({ companyId, category: property.category }).lean();
      const pct = policy ? policy.bookingMoneyPercentage : 20;
      return `Booking Money Percentage: ${pct}%. Flow: Pending -> Booking Paid (partially) -> Fully Paid -> Confirmed. KYC and docs may be required.`;
    }
    if (args.topic === 'installment') {
      return "Max 24 installments supported. Extra charge may apply. Plans are configured after booking is confirmed.";
    }
    if (args.topic === 'refund') {
      const settings = await PlatformSettings.getSettings();
      const pct = settings?.refundRetentionPercentage ?? 20;
      const days = settings?.refundWindowDays ?? 30;
      return `Refund Window: ${days} days. Retention Percentage: ${pct}%.`;
    }
    if (args.topic === 'general') {
      const policy = await Policy.findOne({ roleTarget: 'customer' }).lean();
      if (!policy) return "No general policy found.";
      const text = policy.content.replace(/<[^>]*>?/gm, '');
      return text.substring(0, 800) + (text.length > 800 ? '...' : '');
    }
    return "Unknown topic.";
  } catch {
    return "Error fetching policy.";
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
    const property = await Property.findById(id).populate('companyId', 'name email phone').lean();
    if (!property) {
      res.write('data: {"error": "Property not found"}\n\n');
      return res.end();
    }

    const systemPrompt = `You are an Expert Property Consultant for FlatSell.
You are helping a user viewing a specific property. Answer property questions using the provided context.
If asked about budget, categories (apartment/villa/land), or locations, proactively ask clarifying questions (e.g. budget limit) or use the search_properties tool to find matching properties. NEVER mix categories (if user asks for a villa, do not show apartments unless requested).
Suggest 2-3 properties when appropriate, summarizing price, location, and booking money.
For policies (booking/installment/refund), use the get_policy_info tool. NEVER guess percentages or rules.
For any booking/payment actions, advise guest users to log in.
Always respond in Bangla (বাংলা) regardless of what language the user's question is in. Never respond in English or mixed Banglish, even if the user writes in English. Refuse off-topic questions politely.

CURRENT PROPERTY CONTEXT:
Title: ${property.title}
Category: ${property.category}
Price: BDT ${property.price}
Address: ${property.address}, ${property.city}
Description: ${property.description}
Company: ${property.companyId?.name} (Phone: ${property.companyId?.phone})
${property.category === 'apartment' ? JSON.stringify({ totalFloors: property.totalFloors, unitsPerFloor: property.unitsPerFloor, flatTypes: property.flatTypes }) : ''}
${property.category === 'villa' ? JSON.stringify(property.villaDetails) : ''}
${property.category === 'land' ? JSON.stringify(property.landDetails) : ''}`;

    const tools = [
      {
        type: 'function',
        function: {
          name: 'search_properties',
          description: 'Search for approved properties based on budget, category, city, or company.',
          parameters: {
            type: 'object',
            properties: {
              minPrice: { type: 'number' },
              maxPrice: { type: 'number' },
              category: { type: 'string', enum: ['apartment', 'villa', 'land'] },
              city: { type: 'string' },
              companyId: { type: 'string' }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'get_policy_info',
          description: 'Fetch official rules and data regarding bookings, installments, refunds, or general policies.',
          parameters: {
            type: 'object',
            properties: {
              topic: { type: 'string', enum: ['booking', 'installment', 'refund', 'general'] }
            },
            required: ['topic']
          }
        }
      }
    ];

    let messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    for (let turn = 0; turn < 5; turn++) {
      const stream = await groq.chat.completions.create({
        messages,
        model: 'openai/gpt-oss-20b',
        tools,
        tool_choice: 'auto',
        stream: true,
      });

      let hasToolCalls = false;
      let toolCalls = {};

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta || {};
        
        if (delta.tool_calls) {
          hasToolCalls = true;
          for (const tc of delta.tool_calls) {
            if (!toolCalls[tc.index]) {
              toolCalls[tc.index] = {
                id: tc.id,
                type: 'function',
                function: { name: tc.function?.name || '', arguments: tc.function?.arguments || '' }
              };
            } else {
              if (tc.function?.name) toolCalls[tc.index].function.name += tc.function.name;
              if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments;
            }
          }
        } else if (delta.content && !hasToolCalls) {
          res.write(`data: ${JSON.stringify({ content: delta.content })}\n\n`);
        }
      }

      if (!hasToolCalls) break;

      const toolCallsArray = Object.values(toolCalls);
      messages.push({ role: 'assistant', tool_calls: toolCallsArray });

      for (const tc of toolCallsArray) {
        let result;
        try {
          const args = JSON.parse(tc.function.arguments || '{}');
          if (tc.function.name === 'search_properties') {
            result = await executeSearchProperties(args);
          } else if (tc.function.name === 'get_policy_info') {
            result = await executeGetPolicyInfo(args, property);
          } else {
            result = { error: 'Unknown tool' };
          }
        } catch {
          result = { error: 'Failed to execute tool' };
        }
        messages.push({
          role: 'tool',
          tool_call_id: tc.id,
          name: tc.function.name,
          content: JSON.stringify(result)
        });
      }
    }

    res.write('data: {"done": true}\n\n');
    res.end();

  } catch {
    res.write('data: {"error": "Failed to generate response."}\n\n');
    res.end();
  }
};

module.exports = { streamPropertyChat };
