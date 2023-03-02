const asyncHandler=require("express-async-handler")
const User=require("../models/userModel")
const generateToken=require("../config/generateToken")
const bcrypt=require("bcryptjs")

//REGISTRATION API-(/api/user/reg)
const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body;
    const salt=await bcrypt.genSalt(10);
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All the fields")
    }
    const userExists=await User.findOne({email})
    if (userExists){
        res.status(400);
        throw new Error("User Already Exists")
    }
    const newPassword=await bcrypt.hash(password,salt);
    const user=await User.create({
        name,
        email,
        password:newPassword,
        pic
    })
    if(user){
        res.status(200).json(
            {
                _id:user._id,
                email:user.email,
        name:user.name,
        pic:user.pic,
        token:generateToken(user._id)
            }
        )
    }
    else{
        res.status(400);
        throw new Error("Failed to Create user")
    }
});

//LOGIN API -(/api/user/login)
const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    const com=await bcrypt.compare(password,user.password)

    if(user && com ){

        res.status(201).json(
            {
                _id:user._id,
                email:user.email,
                name:user.name,
                pic:user.pic,
                token:generateToken(user._id)
            }
        )
    }
    else{
        res.status(401);
        throw new Error("Invalid Email and Password")
    }
}    
)
//GET ALL USERS - (/api/user/?search=alex)
const allUsers=asyncHandler(async(req,res)=>{
    const key=req.query.search ? {
        $or:[
            //options:i - for case insensitive(upper/lower case)
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{};
    // console.log(key);
    const users=await User.find(key)

    .find({_id: { $ne:req.user._id}})
    res.send(users)
}   
)

module.exports={registerUser,authUser,allUsers}