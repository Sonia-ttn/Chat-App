import {useContext} from "react";
import { ChatContext } from "./ChatProvider";
const ChatState=()=>{
    return useContext(ChatContext)
}
export default ChatState