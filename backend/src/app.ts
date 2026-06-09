import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';




import authRoutes from './routes/auth.routes'
import userRouter from './routes/user.routes'
import propertyRoutes from './routes/property.routes'
import searchRoutes from './routes/search.routes'
import compareRoutes from './routes/compare.routes'
import bookingRoutes from './routes/booking.routes';
import vendorRoute from './routes/vendor.routes'
import installmentRoutes from './routes/installment.routes'
const app = express(); 





// middlewares
app.use(express.json());
app.use(cors({origin: true, credentials:true}));
app.use(helmet());
app.use(cookieParser());



// Router API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/compare', compareRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/vendor', vendorRoute);
app.use('./api/v1/installments', installmentRoutes)






app.get('/', (req, res) => {
    res.status(200).json({message: "API working"})
})

export default app;