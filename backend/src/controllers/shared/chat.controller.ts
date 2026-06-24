import { Request, Response } from 'express';
import { findPropertyById } from '../../repositories/shared/property.repository';
import { streamChatResponse } from '../../services/shared/chat.service';

interface ChatRequestBody {
  propertyId: string;
  message: string;
  chatHistory: { role: 'user' | 'model'; content: string }[];
}

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId, message, chatHistory } = req.body as ChatRequestBody;

    // Validate required fields
    if (!propertyId || !message) {
      res.status(400).json({
        success: false,
        error: 'propertyId and message are required',
      });
      return;
    }

    // Fetch property data for context
    const property = await findPropertyById(propertyId);
    if (!property) {
      res.status(404).json({
        success: false,
        error: 'Property not found',
      });
      return;
    }

    // Set SSE headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Stream Gemini response chunks via SSE
    await streamChatResponse(
      property,
      message,
      chatHistory || [],
      // onChunk — send each text chunk as SSE data
      (chunk: string) => {
        const data = JSON.stringify({ type: 'chunk', content: chunk });
        res.write(`data: ${data}\n\n`);
      },
      // onEnd — signal stream completion
      () => {
        const data = JSON.stringify({ type: 'done' });
        res.write(`data: ${data}\n\n`);
        res.end();
      },
      // onError — send error and close
      (error: Error) => {
        console.error('Gemini API Error:', error.message);
        const data = JSON.stringify({ type: 'error', content: 'Failed to generate response. Please try again.' });
        res.write(`data: ${data}\n\n`);
        res.end();
      }
    );
  } catch (error) {
    console.error('Chat Controller Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    } else {
      res.end();
    }
  }
};
