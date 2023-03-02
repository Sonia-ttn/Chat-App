const express=require("express");
const {registerUser,authUser,allUsers}=require("../controllers/userControllers")
const router=express.Router();
const {protect}=require("../middleware/authMiddleware")
//signup user
router.post("/reg",(registerUser))
//login user
router.post("/login",(authUser))
//get all users
//protect-auth middleware
router.get("/",(protect),(allUsers))
module.exports=router;