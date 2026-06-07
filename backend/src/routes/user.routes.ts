import {Router, Response} from 'express';
import {verifyToken, authorizeRoles, AuthRequest} from '../middlewares/auth.middleware'



const router = Router();


// Get user profile
router.get('/profile', verifyToken, (req: AuthRequest, res: Response) => {
    res.status(200).json({message: 'Welcome to your profile', user: req.user});

})



// for admin and vendor only

router.get('/vendor-dashboard', verifyToken, authorizeRoles('VENDOR', 'ADMIN'), (req: AuthRequest, res: Response) => {
    res.status(200).json({message: 'Welcome to vendor Dashboard', user: req.user});
})


// For Admin only

router.get('/admin-only', verifyToken, authorizeRoles('ADMIN'), (req: AuthRequest, res: Response) => {
    res.status(200).json({message: 'Welcome to admin Dashboard', user: req.user});
})


export default router;