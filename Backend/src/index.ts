import dotenv from 'dotenv';
import connectDB from './Database/data.ts';
dotenv.config({
    path:'./.env'
})
connectDB();