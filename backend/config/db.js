const mongoose=require("mongoose");
const dotenv=require('dotenv');
dotenv.config();

let URI=process.env.MONGO_URI;
// console.log("URI",URI)
const connectDB=async()=>{
    try{
        const con=await mongoose.connect(URI);
        console.log("connected DB",con.connection.host)
    }
    catch(err){
        console.log("error",err.message)
    }
}
module.exports=connectDB;
