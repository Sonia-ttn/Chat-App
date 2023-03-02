const express=require("express");
const {protect}=require("../middleware/authMiddleware")
const {accessChat
     ,fetchChat
     ,createGroup
     ,renameGroup
     ,removeGroup
     ,addtoGroup
}
=require("../controllers/chatControllers")

const router=express.Router();

router.post("/",(protect),(accessChat));
router.get("/",(protect),(fetchChat));
router.post("/group",(protect),(createGroup));
router.put("/rename",(protect),(renameGroup));
router.put("/removeg",(protect),(removeGroup));
router.put("/addg",(protect),(addtoGroup));

module.exports=router;