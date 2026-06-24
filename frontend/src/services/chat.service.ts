import { ENV } from '../config/env';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}


export async function* streamChatMessage(
  propertyId: string,
  message: string,
  chatHistory: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${ENV.API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ propertyId, message, chatHistory }),
  });

  if (!response.ok) {
    throw new Error('Failed to connect to AI chat service');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response stream available');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

  
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || ''; 

    for (const line of lines) {
      const dataLine = line.replace(/^data: /, '').trim();
      if (!dataLine) continue;

      try {
        const parsed = JSON.parse(dataLine);

        if (parsed.type === 'chunk') {
          yield parsed.content;
        } else if (parsed.type === 'error') {
          throw new Error(parsed.content);
        } else if (parsed.type === 'done') {
          return;
        }
      } catch (e) {
        
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
}
