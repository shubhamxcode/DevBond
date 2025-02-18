import Apierror from "../utils/apierror";
import asynchandler from "../utils/asynchandler";
import Jwt,{JwtPayload} from "jsonwebtoken";
import { User } from "../models/userschema";
 const verfiyjwt=asynchandler(async(req,res,next)=>{
  try {
     const token= req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
     if (!token) {
      throw new Apierror(401,"unauthorized request")
     }
     const decodedToken=Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET as string)
     const user = await User.findById((decodedToken as JwtPayload)._id);
     if (!user) {
      throw new Apierror(401,"invalid excess token")
     }
     req.user=user
     next()
  } catch (error) {
    throw new Apierror(401,"invalid token ")
  }
});

export default verfiyjwt