import React, { createContext, useContext, ReactNode, useCallback,useEffect } from "react";
import {io,Socket} from 'socket.io-client'
import { useState } from "react";
// Context Type
interface Types {
    children: ReactNode;
}
interface IsocketContext{
    sendmessage:(msg:string)=>any
    messages:string[]
}

// Create socket context
const SocketContext = createContext<IsocketContext|null>(null);

export const usersocket=()=>{
    const state=useContext(SocketContext)
    if (!state) throw new Error("state is undefined")
    return state
}

export const SocketProvider: React.FC<Types> = ({ children }) => {
    const [socket, setsocket] = useState<Socket>()
    const [messages, setmessages] = useState<string[] >([])
    const sendmessage:IsocketContext['sendmessage']=useCallback((msg)=>{
        console.log('send message',msg);
        if (socket) {
            socket.emit('event:message',{message:msg })
        }
        
    },[socket])
    const onmessagereceive=useCallback((msg:string)=>{
        console.log(`from server msg received:`,msg);
        const {message}=JSON.parse(msg) as {message:string}
        setmessages((prev)=>([...prev,message ]))
        
    },[]) 

    useEffect(() => {

        const sockeio=io('http://localhost:5000')
        sockeio.on('message',onmessagereceive)
        setsocket(sockeio)
        return()=>{
            sockeio.disconnect()
            sockeio.off('message',onmessagereceive)
            setsocket(sockeio )
        }
    }, [])
    
    return (
        <SocketContext.Provider value={{sendmessage,messages}}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook for easier usage
export const useSocket = () => useContext(SocketContext);

const Chat: React.FC = () => {
    return (
        <div>
            <h1>Chat Component</h1>
        </div>   
    );
};

export default Chat;
