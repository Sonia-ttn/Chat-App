import React, { useState,useEffect } from 'react'
import axios from 'axios';

function Chatpage() {
  const [chats,setChats]=useState([]);

  const fetchChats=async()=>{
    const {data}=await axios.get('http://localhost:5000/api/chat')
    console.log(data); 
    
    setChats(data)
  };
  useEffect(()=>{
    fetchChats();
  },[])
  return (
    <div>
      Chats
      {chats.map((chat)=>
<div key={chat?._id}>{chat?.chatName}</div>
      )}
    </div>
  )
}

export default Chatpage
