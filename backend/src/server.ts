import app from './app';
import pool from './database/db';
import dotenv from 'dotenv';


dotenv.config();

const PORT = process.env.PORT || 5000;

const stsrtServer = async () => {
    try {const client = await pool.connect(); // Check DB connection
    client.release();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    })}
    catch(err){
        console.log(`database connection error: ${err}`);
    }
}

stsrtServer();
