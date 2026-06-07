import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';




import authRoutes from './routes/auth.routes'
import userRouter from './routes/user.routes'
const app = express(); 





// middlewares
app.use(express.json());
app.use(cors({origin: true, credentials:true}));
app.use(helmet());
app.use(cookieParser());



// Router API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRouter);










app.get('/', (req, res) => {
    res.status(200).json({message: "API working"})
})

export default app;