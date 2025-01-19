import express from 'express'
import Cors from 'cors';
import cookieparser from 'cookie-parser'

const app =express()
app.use(Cors({
    origin:process.env.CORS_ORIGIN,
    methods: ['GET','POST', 'PUT', 'DELETE'],
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieparser())

//import routes 

import userrouter from '../routes/route.ts'

// routes declaration

app.use("/api/users",userrouter)
//http://localhost2000/api/v1/users/
export default app