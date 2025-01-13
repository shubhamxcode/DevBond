import express from "express";
const app=express();

app.get('/',(req,res)=>{
    res.send("Hello from the server")
})
app.get('/shubham',(req,res)=>{
    res.send("this side shubham routes")
})
const Port=process.env.PORT||2000
app.listen(Port,()=>{
    console.log(`serve at localhost:${Port}`);
})