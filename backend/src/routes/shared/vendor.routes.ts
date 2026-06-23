import { Router } from 'express';
import { getVendorPolicyFromDb } from '../../repositories/shared/vendor.repository';
import { getPolicies, createPolicy, updatePolicy, deletePolicy } from '../../controllers/shared/policy.controller';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

const router = Router();

// Public: Get vendor policy text (legacy endpoint)
router.get('/policy', async (req: any, res: any) => {
  try {
    const policy = await getVendorPolicyFromDb();
    ApiResponse.success(res, RESPONSE_MESSAGES.VENDOR.POLICY_FETCHED, policy);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
});

// Admin: Full CRUD for system policies
router.get('/policies', verifyToken, authorizeRoles('ADMIN'), getPolicies);
router.post('/policies', verifyToken, authorizeRoles('ADMIN'), createPolicy);
router.put('/policies/:id', verifyToken, authorizeRoles('ADMIN'), updatePolicy);
router.delete('/policies/:id', verifyToken, authorizeRoles('ADMIN'), deletePolicy);

export default router;
