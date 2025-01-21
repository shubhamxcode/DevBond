import asynchandler from "../utils/asynchandler.ts";
import Apierror from "../utils/apierror.ts";
import {User} from '../models/userschema.ts'
import Apiresponse   from "../utils/apiresponse.ts";
const regiesteruser=asynchandler(async(req,res)=>{
    //get user detail from frontend 
    //validation-not empty 
    //check user if user is already register -email
    // create user object-create entry in db ((object creationn because mongoose is no-sequestial databas))
    //remove password and refresh token from response 
    //check respone
    //return response 

    const {username,email,password}=req.body
    console.log("email:",email,"username:",username,"password:",password);
     
    if (
        [username,email,password].some((fields)=>fields?.trim()=="")
    ) {
        throw new Apierror(400,"all field are required",)
    }
    const existeduser= await User.findOne({email })

    if (existeduser) {
        throw new Apierror(409,"You are already register ")
    }
   const user=await User.create({
        username:username.toLowerCase(), 
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new Apierror(500,"something went wrong sorry ")
    }
    return res.status(201).json(
        new Apiresponse("user register succesfully")
    )
})

export default regiesteruser 