import {createContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext=createContext();

//children -whole App
const ChatProvider=({children})=>{
    const [user,setUser]=useState();
    let nav=useNavigate();

    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        console.log("userInfo",userInfo)
        console.log("user",user)
        //user not logged in
        if(!userInfo){
            nav("/")
        }
    },[nav])

    return <ChatContext.Provider
    value={{user}}
    >{children}</ChatContext.Provider>
}

export default ChatProvider;