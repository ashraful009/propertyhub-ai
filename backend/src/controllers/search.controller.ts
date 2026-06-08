import { Request, Response } from 'express';
// এখন প্রপার্টি রিপোজিটরির বদলে নতুন সার্চ রিপোজিটরি থেকে ইমপোর্ট করবো
import { findPropertiesByFilter } from '../repositories/search.repository'; 

export const searchProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = req.query;
    const properties = await findPropertiesByFilter(filters);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};