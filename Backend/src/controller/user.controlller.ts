import asynchandler from "../utils/asynchandler.ts";

const regiesteruser=asynchandler(async(req,res)=>{
    return res.status(200).json({
        message:"Bhai finnaly ho gaya reeee baabbbababababab"
    })
})

export default regiesteruser 