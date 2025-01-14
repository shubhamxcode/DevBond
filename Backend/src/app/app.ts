import express from 'express'
import Cors from 'cors';
import cookieparser from 'cookie-parser'


const app =express()
app.use(Cors({
    origin:process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))


export default app 