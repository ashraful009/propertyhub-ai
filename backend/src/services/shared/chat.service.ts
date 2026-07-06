// import { GoogleGenerativeAI } from '@google/generative-ai';
import { IProperty } from '../../models/shared/property.model';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const buildSystemPrompt = (property: IProperty): string => {
  return `You are PropertyHub AI Assistant — a helpful, friendly, and knowledgeable real estate assistant for the PropertyHub website.

Your ONLY job is to help users with questions about the specific property listed below and general information about the PropertyHub platform.

=== PROPERTY DETAILS ===
- Title: ${property.title}
- Description: ${property.description}
- Price: ৳${Number(property.price).toLocaleString('en-IN')}
- Location: ${property.location}
- Address: ${property.address}
- Property Type: ${property.property_type}
- Bedrooms: ${property.bedrooms}
- Bathrooms: ${property.bathrooms}
- Area: ${property.area} sqft
- Status: ${property.status || 'AVAILABLE'}
- Booking Money: ৳${Number(property.booking_money || 0).toLocaleString('en-IN')}
- Installment Plan: Up to ${property.total_installments || 'N/A'} months
========================

=== STRICT RULES ===
1. ONLY answer questions about THIS property or the PropertyHub website/platform.
2. If the user asks anything unrelated (coding, math, general knowledge, politics, other websites, etc.), politely refuse and say: "I can only help with questions about this property and PropertyHub. Please ask me something related!"
3. Respond in the SAME LANGUAGE the user writes in (Bengali or English).
4. Keep responses concise, helpful, and friendly.
5. Use bullet points or structured formatting when listing features or details.
6. If you don't know something specific that isn't in the property data, say so honestly rather than making things up.
7. You can discuss: property features, pricing, installment options, booking process, location benefits, comparison with general market, and PropertyHub platform features.
========================`;
};

export const streamChatResponse = async (
  property: IProperty,
  userMessage: string,
  chatHistory: ChatMessage[],
  onChunk: (chunk: string) => void,
  onEnd: () => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    const systemPrompt = buildSystemPrompt(property);

    // Build conversation history for Groq
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    if (!response.body) throw new Error('ReadableStream not supported');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const text = parsed.choices?.[0]?.delta?.content;
            if (text) {
              onChunk(text);
            }
          } catch (e) {
            // Ignore parse errors on incomplete chunks
          }
        }
      }
    }

    onEnd();
  } catch (error: any) {
    onError(error);
  }
};
