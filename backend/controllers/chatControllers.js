const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//create or fetch one to one chat
const accessChat = asyncHandler(async(req, res) => {
  //logged in user sends userId
  //userId is the id with which we are trying to create the chat
  const { userId } = req.body;
  console.log(userId)

  //if chat with userId  doesn't exists
  if (!userId) {
    console.log("UserId param not send with req");
    return res.sendStatus(400);
  }

  //if chat with userId exists
  var isChat = await Chat.find({
    //one-on-on chat groupchat is false
    isGroupChat: false,
    //both request must be true- $and
    $and: [
      {
        users: {
          $elemMatch:
            //$eq-equal to current user logged in
            { $eq: req.user._id.valueOf() },
        },
      },
      //$eq-equal to userId that we sent
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })

    //populate user info except password return anything
    .populate("users", "-password")
    .populate("latestMessage");

  //final data for our chat
  isChat = await User.populate(isChat, {
    path: "latestmessage.sender",
    select: "name pic email",
  });
  //if chat exists send the chat
  if (isChat.length > 0) {
    //send the 0th btw 2 users
    res.send(isChat[0]);
  } else {
    //create new chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id.valueOf(), userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
          //fetch this chat from db and sent to user
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//Fetch all chats for a User
 const fetchChat=asyncHandler(async(req,res)=>{
  // console.log("entered,",req.user._id.valueOf());

  try{
    Chat.find({users: {
      $elemMatch:
        //$eq-equal to current user logged in
        { $eq: req.user._id.valueOf() }
    }})
    .populate("users", "-password")    
    .populate("groupAdmin", "-password")    
    .populate("latestMessage")
    //new to old msgs wrt updatedAt
    .sort({updatedAt:-1})
    .then(async(resul)=>{
      resul=await User.populate(resul,
        {
          path: "latestmessage.sender",
          select: "name pic email"
        }
      );
      res.status(200).send(resul)
    })

  }
  catch(err){
    res.status(401);
    throw new Error(error.message);
  }
 }
  )

//create group chat
const createGroup=asyncHandler(async(req,res)=>{

  if(!req.body.users||!req.body.name){
    return res.status(400).send({message:"enter all fields"})
  }

  //parse stringify  from frontend into object
  var users=JSON.parse(req.body.users);
  if(users.length <2){
    return res.status(400)
    .send("More than 2 users are required to form a group chat")
  }

  //add current user to the group as well
  users.push(req.user)

  try{
    //create new group chat
    const groupChat=await Chat.create({
      chatName:req.body.name,
      users:users,
      isGroupChat:true,
      groupAdmin:req.user
    });

    //fetch this group chat from db and sent to user
    const FullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users","-password")
    .populate("groupAdmin","-password")

    res.status(200).json(FullGroupChat);
  } 

  catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}
)

//rename group chat
const renameGroup=asyncHandler(async(req,res)=>{
  const {chatId,chatName}=req.body;
  const updatedChat=await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName:chatName
    },//return updated value since new is true
    {new:true}
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!updatedChat){
    res.status(400);
    throw new Error("Chat Not Found");
  }
  else{
    res.json(updatedChat)
  }
}
)

//add to Group
const addtoGroup=asyncHandler(async(req,res)=>{
  const {chatId,userId}=req.body
  const added= await Chat.findByIdAndUpdate(
    chatId,{
      $push:{users:userId}
    },{new:true}
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!added){
    res.status(400)
    throw new Error("Chat Not found")
  }
  else{
    res.json(added);
  }
}

)

//remove from group
const removeGroup=asyncHandler(async(req,res)=>{
  const {chatId,userId}=req.body
  const removed=await Chat.findByIdAndUpdate(
    chatId,{
      $pull:{users:userId}
    },{new:true}
  )
  .populate("users","-password")
  .populate("groupAdmin","-password");

  if(!removed){
    res.status(400)
    throw new Error("Chat Not found")
  }
  else{
    res.json(removed);
  }
}

)


module.exports = {
  accessChat
  ,fetchChat
  ,createGroup
  ,renameGroup
  ,addtoGroup
  ,removeGroup
};
