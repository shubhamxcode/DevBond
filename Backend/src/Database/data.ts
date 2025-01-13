import mongoose from 'mongoose';


const connectDB=async function(){
    try {
        const connectionInstace=await mongoose.connect(`${process.env.MONGOOSE_URL}/${process.env.DB_NAME}`)
        console.log(`the data base is connected successfully on Port:${connectionInstace.connection.host}`)
    } catch (error) {
        console.log("connection failed check mongoose data base shubham sir",error );
        process.exit(1)
        
    }   
}
export default connectDB;