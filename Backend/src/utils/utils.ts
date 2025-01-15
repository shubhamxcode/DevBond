type requesttypehandler=(req:any,res:any,next:any,)=>Promise<any>;


const asynchandler=(requesthandler:requesttypehandler)=>{
    return(req:any,res:any,next:any)=>{
        Promise.resolve(requesthandler(req,res,next))
        .catch((err)=>next(err))
    }
}
export default asynchandler