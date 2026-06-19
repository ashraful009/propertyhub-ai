import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { RESPONSE_MESSAGES } from './responses/responseMessages';

import authRoutes from './routes/shared/auth.routes';
import userRouter from './routes/shared/user.routes';
import propertyRoutes from './routes/shared/property.routes';
import searchRoutes from './routes/shared/search.routes';
import compareRoutes from './routes/shared/compare.routes';
import sharedVendorRoutes from './routes/shared/vendor.routes';

import adminRoutes from './routes/admin/admin.routes';
import vendorRoutes from './routes/vendor/vendor.routes';
import customerRoutes from './routes/customer/customer.routes';

import bookingRoutes from './routes/customer/booking.routes';
import installmentRoutes from './routes/customer/installment.routes';
import paymentRoutes from './routes/customer/payment.routes';
import refundRoutes from './routes/customer/refund.routes';

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/compare', compareRoutes);
app.use('/api/v1/vendor-policy', sharedVendorRoutes);

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/vendor', vendorRoutes);
app.use('/api/v1/customer', customerRoutes);

app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/installments', installmentRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/refunds', refundRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: RESPONSE_MESSAGES.GENERAL.API_WORKING });
});

export default app;