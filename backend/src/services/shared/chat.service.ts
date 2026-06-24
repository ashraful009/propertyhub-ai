import { GoogleGenerativeAI } from '@google/generative-ai';
import { IProperty } from '../../models/shared/property.model';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
    });

    // Build conversation history for Gemini
    const history = chatHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessageStream(userMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onChunk(text);
      }
    }

    onEnd();
  } catch (error: any) {
    onError(error);
  }
};
