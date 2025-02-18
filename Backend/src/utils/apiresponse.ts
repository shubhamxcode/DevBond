

class Apiresponse{
    data:any;
    message:string

    constructor(data:any,message:string="success",){
        this.data=data
        this.message=message
        
    }
}
export default Apiresponse