import { Server } from "socket.io";

 class socketservice {
    private _io:Server;
    constructor(){
        console.log(`init socket server....`);
        this._io=new Server()
    }
    public initlistners(){
        console.log('init socketListners...');
        
        const io=this.io
        io.on("connect",(socket)=>{
            console.log(`new socket connected`,socket.id);
            socket.on("event:message",async({message}:{message:string})=>{ 
                console.log("new message received",message);
                
            })
        })
    }
    get io(){
        return this._io
    }
 }


 export default socketservice