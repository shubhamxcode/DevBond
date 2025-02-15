import asynchandler from "../utils/asynchandler.ts";
import Apierror from "../utils/apierror.ts";
import {User} from '../models/userschema.ts'
import Apiresponse   from "../utils/apiresponse.ts";
import bcrypt from 'bcrypt';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    getAccessToken: () => string;
    getRefreshToken: () => string;
    refreshToken?: string 
    // save: (options?: SaveOptions) => Promise<IUser>;
}
const generateTokens = async (user: any) => {
    const id=await User.findById(user)
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    // Save the refresh token in the database
    user.refreshToken=refreshToken
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
}



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
        new Apiresponse(createdUser,"user register succesfully")
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
     const {accessToken,refreshToken}=await generateTokens(user._id);

     const loggedinuser=await User.findById(user._id).select("-password -refreshToken")

     const options={
        httponly:true,
        secure:true,
     }
    // return res.status(200).json({
    //     UserId: user._id,
    //     username: user.username,
    //     email: user.email,
    //     message: "Login successful"
    // });
    res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(
        new Apiresponse(
            {
                user:loggedinuser,accessToken,refreshToken
            },
            "user login succefully"
        )
    )
});

const updateUserField = asynchandler(async (req, res) => {
    const { userId, selectedField } = req.body;

    if (!userId || !selectedField) {
        throw new Apierror(400, "User ID and selected field are required");
    }

    // Update the user's selected field
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { selectedField },
        { new: true } // Return the updated user
    );

    if (!updatedUser) {
        throw new Apierror(404, "User not found");
    }

    return res.status(200).json(new Apiresponse(updatedUser, "User field updated successfully"));
});

const getUsersByField = asynchandler(async (req, res) => {
    const { selectedField } = req.query;
    const userId = req.user?._id; // Get logged-in user ID from authentication middleware
    console.log("userlogin id:",userId);
    
    if (!selectedField) {
        throw new Apierror(400, "Selected field is required");
    }

    // Find users in the same field but exclude the logged-in user
    const users = await User.find({ selectedField, _id: { $ne: userId } });

    return res.status(200).json(users);
});

export { regiesteruser, loginUser, updateUserField, getUsersByField }; 