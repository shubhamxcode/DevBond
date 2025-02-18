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

    const accessToken = user.getAccessToken();
    const refreshToken = user.getreftoken();
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
     const {accessToken,refreshToken}=await generateTokens(user);

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
                user:loggedinuser,accessToken,refreshToken,
                userId:user._id
            },
            "user login succefully"
        )
    )
});

const updateUserField = asynchandler(async (req, res) => {
   
        const { userId, selectedField } = req.body;
        console.log("Received userId:", userId, "Selected field:", selectedField);
      
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
      
        try {
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
      
          user.selectedField = selectedField;
          await user.save();
          res.json({ message: "Field updated successfully", user });
        } catch (error) {
          console.error("Error updating field:", error);
          res.status(500).json({ message: "Server error" });
        }
      
});

const getUsersByField = asynchandler(async (req, res) => {
    const { selectedField } = req.query;
    const userId = req.user?._id; // Get logged-in user ID from authentication middleware
    console.log("userlogin id:",userId,typeof userId,"value",userId);

    if (!selectedField) {
        throw new Apierror(400, "Selected field is required");
    }

    // Find users in the same field but exclude the logged-in user
    const users = await User.find({ 
        selectedField: { $regex: new RegExp(selectedField, "i") }, 
        _id: { $ne: userId }  // Exclude logged-in user
    });
    


    return res.status(200).json(users);
});

export { regiesteruser, loginUser, updateUserField, getUsersByField }; 