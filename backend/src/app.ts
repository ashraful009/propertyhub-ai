import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/auth.routes'

const app = express(); 

// middlewares

app.use(express.json());
app.use(cors({origin: true, credentials:true}));
app.use(helmet());
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.status(200).json({message: "API working"})
})

export default app;