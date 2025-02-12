import dotenv from 'dotenv';
import connectDB from './Database/data.ts';
import app from './app/app.ts';
dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000, () => {
        console.log(`server is running at port ${process.env.PORT}`);
    })
}) 
.catch((err)=>{
    console.log("mongoDB connection pls check",err);
    
})