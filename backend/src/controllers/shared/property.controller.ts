import { Request, Response } from 'express';
import { findAllProperties } from '../../repositories/shared/property.repository';

// ২. Get All Properties (Public)
export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await findAllProperties();
    
    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
