import {createContext, useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
const ChatContext=createContext();

const ChatProvider=({children})=>{
    const nav=useNavigate();
    const [user,setUser]=useState();
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo);
        //user not logged in
        if(!userInfo){
            nav("/")
        }
    },[nav])

    return <ChatContext.Provider>{children}</ChatContext.Provider>
}
export const ChatState=()=>{
    return useContext(ChatContext)
}
export default ChatProvider;