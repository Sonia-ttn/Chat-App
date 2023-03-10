import React,{useState} from 'react'
import {Box, Button, Tooltip,Text, Avatar} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import UserListItem from "../SearchUser/UserListItem"
import { Input } from "@chakra-ui/input";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatState from "../../Context/UseContext"
import ProfileModal from './ProfileModal';
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "./ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  let nav=useNavigate();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:8000/api/user/?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log("userId",userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:8000/api/chat/`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    nav("/");
  }
  return (
    <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px">
      
      <Tooltip
        label="Search Users to Chat"
        hasArrow
        placement='bottom-end'
        >

          <Button variant="Ghost"onClick={onOpen}>
          <i className="fas fa-search"></i>
          {/* in smaller screen not visible but in medium screen flex px=padding left & right */}
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work sans">
          CHAT-APP
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon></BellIcon>
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>

          <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
            <Avatar size='sm' cursor='pointer' 
            src={user.pic} 
            name={user.name}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
            <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
          </MenuList>
          </Menu>
        </div>
    </Box>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar
