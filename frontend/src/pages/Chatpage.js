import React from 'react'
import ChatState from "../Context/ChatProvider"
import {Box} from "@chakra-ui/react";
import SideBar from "../components/ChatComponent/SideBar";
import MyChats from "../components/ChatComponent/MyChats";
import ChatBox from "../components/ChatComponent/ChatBox";

function Chatpage() {
  const {user}=ChatState()
  return (
    <div style={{width:"100%"}}>
      {/* search section */}
      {user && <SideBar/>}

    <Box>
      {/* all chats */}
      {user && <MyChats/>}

      {/* each chat */}
      {user && <ChatBox/>}
     </Box>
    </div>
  )
}

export default Chatpage
