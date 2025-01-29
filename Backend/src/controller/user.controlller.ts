import asynchandler from "../utils/asynchandler.ts";
import Apierror from "../utils/apierror.ts";
import {User} from '../models/userschema.ts'
import Apiresponse   from "../utils/apiresponse.ts";
import bcrypt from 'bcrypt';

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

const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Apierror(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Apierror(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Apierror(401, "Invalid credentials");
    }

    return res.status(200).json(new Apiresponse({ userId: user._id, message: "Login successful" }));
});



const updateUserField = asynchandler(async (req, res) => {
    const { userId, selectedField } = req.body;

    if (!userId || !selectedField) {
        throw new Apierror(400, "User ID and selected field are required");
    }

    const user = await User.findByIdAndUpdate(userId, { selectedField }, { new: true });

    if (!user) {
        throw new Apierror(404, "User not found");
    }

    return res.status(200).json(new Apiresponse(user));
});

const getLoggedInUser = asynchandler(async (req, res) => {
    // Assuming you have a middleware that verifies the token and adds `req.user`
    const userId = req.user?._id; // Extract user ID from the verified token
    console.log(userId)
    if (!userId) {
        throw new Apierror(401, "Not authenticated");
    }

    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new Apierror(404, "User not found");
    }

    res.status(200).json({ userId: user._id, username: user.username, email: user.email });
});



export { regiesteruser, loginUser, updateUserField,getLoggedInUser}; 