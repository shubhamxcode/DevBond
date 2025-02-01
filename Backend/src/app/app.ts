import express from 'express';
import Cors from 'cors';
import cookieparser from 'cookie-parser';

const app = express();

app.use(Cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieparser());

// Import your routes here
import userrouter from '../routes/route.ts';

app.use("/api/users", userrouter);

// Export your app as the handler for Vercel
export default app;
