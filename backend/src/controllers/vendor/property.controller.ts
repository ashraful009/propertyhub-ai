import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { insertProperty, updatePropertyById, deletePropertyById } from '../../repositories/vendor/property.repository';

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

// ৩. Update Property
export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const updatedProperty = await updatePropertyById(id as string, userId, userRole, req.body);

    if (!updatedProperty) {
      res.status(404).json({ error: 'Property not found or you do not have permission to update it.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ৪. Delete Property
export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const isDeleted = await deletePropertyById(id as string, userId, userRole);

    if (!isDeleted) {
      res.status(404).json({ error: 'Property not found or you do not have permission to delete it.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
