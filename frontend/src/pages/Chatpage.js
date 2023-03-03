import React from 'react'
import ChatState from "../Context/UseContext"
import {Box} from "@chakra-ui/react";
import SideBar from "../components/ChatHeader/SideBar";
import MyChats from "../components/ChatComponent/MyChats";
import ChatBox from "../components/ChatComponent/ChatBox";

function Chatpage() {
  const {user}=ChatState()
  console.log("chatpgae",user);
  return (
    <div style={{width:"100%"}}>
      {/* search section */}
      {user && <SideBar/>}
{/* <SideBar/> */}

    <Box
    display="flex"
    justifyContent='space-between'
    w="100%"
    h="91.5vh"
    p='10px'
    >
      <MyChats/>
      {/* all chats */}
      {/* {user && <MyChats/>} */}
<ChatBox/>
      {/* each chat */}
      {/* {user && <ChatBox/>} */}
     </Box>
    </div>
  )
}

export default Chatpage
