import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_APIKEY,
    api_secret:process.env.CLOUDINARY_CLOUD_APIKEY_SECREATE

})

const uploadoncloudinary=async(localfilepath:string)=>{
    try {
        if (!localfilepath) return null;
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });
        console.log("file is uploaded successfully on cloudinary",response.url);
        return response;
    } catch (error) {
       fs.unlinkSync(localfilepath)
    }
}
export default cloudinary