

class Apiresponse{
    data:any;
    message:string
    statusCode:number
    success:boolean
    constructor(data:any,message:string="success",statusCode:number,){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400
    }
}
export default Apiresponse