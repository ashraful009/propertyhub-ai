import { Response, Request } from 'express';
import { getVendorPolicyFromDb } from '../../repositories/shared/vendor.repository';

// ১. Get Policy 
export const getVendorPolicy = async (req: Request, res: Response): Promise<void> => {
  try {
    const policy = await getVendorPolicyFromDb();
    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    console.error('Error fetching policy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
