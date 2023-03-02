import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom"
import {  useToast } from "@chakra-ui/react";
import axios from "axios";

function Login() {
  let nav=useNavigate();

    const [show,setShow]=useState(false);
    const [load,setLoad]=useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const handleClick=()=>setShow(!show);

    const submitHandler=async()=>{
      setLoad(true);
      if (!email || !password) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoad(false);
        return;
      }
  
      // console.log(email, password);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
  
        const { data } = await axios.post(
          "http://localhost:8000/api/user/login",
          { email, password },
          config
        );
  
        // console.log(JSON.stringify(data));
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoad(false);
        nav("/chats")
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoad(false);
      }
    };
  
    return (
      <VStack spacing="5px">
        <FormControl id="emails" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="passwords" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>          
        
        <Button colorScheme="blue"
        width="100%"
        style={{marginTop:15}}
         onClick={submitHandler}
         isLoading={load}>
                Log In
              </Button>

              <Button 
              variant="solid"
              colorScheme="red"
        width="100%"
         onClick={()=>{
            setEmail("guest@example.com")
            setPassword("123456")
         }}>
                Get Guest User Credentials
              </Button>
      </VStack>
    );
  }

export default Login
