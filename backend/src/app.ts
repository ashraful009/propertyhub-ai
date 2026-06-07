import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';


const app = express(); 

// middlewares

app.use(express.json());
app.use(cors({origin: true, credentials:true}));
app.use(helmet());
app.use(cookieParser());



app.get('/', (req, res) => {
    res.status(200).json({message: "API working"})
})

export default app;