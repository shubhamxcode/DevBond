
class Apierror extends Error{
    statusCode:number;
    message: string;
    data:any;
    success:boolean
    errors:any[]
    
    constructor(
        statusCode:number,
        message:string="something went wrong",
        errors:any[]=[],
        stack:string=new Error().stack||""
    ){
        super(message)
        this.message=message,
        this.statusCode=statusCode,
        this.data=null,
        this.success=false
        this.stack=stack
        this.errors=errors
    }
}
export default Apierror