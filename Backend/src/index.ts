import dotenv from "dotenv";
import connectDB from "./Database/data.ts";
import app from "./app/app.ts";
import socketservice from "./services/socket.ts";
import http from "http"

dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection pls check", err);
  });

  /////////////////////////////////websocket///////////////////////////////////

  async function init() {
    const socket=new socketservice()
    const httpserver=http.createServer()
    const PORT=process.env.PORT2||3000
    socket.io.attach(httpserver)
    httpserver.listen(PORT,()=>{
      console.log(`http server started at the port:${PORT}`);
      
    })
    socket.initlistners()
  }
  init()