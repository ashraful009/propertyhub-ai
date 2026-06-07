import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { insertProperty, findAllProperties } from '../repositories/property.repository';

// ১. Create Property (Vendor/Admin)
export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor_id = req.user?.id; 

    if (!vendor_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const images = files ? files.map(file => file.path) : [];

    // Model/Interface অনুযায়ী ডাটা সাজানো
    const propertyData = {
      ...req.body,
      images,
      vendor_id
    };

    const newProperty = await insertProperty(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property added successfully',
      data: newProperty,
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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