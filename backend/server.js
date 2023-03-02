const express=require("express");
const app=express();
const chats=require("./data/data");
const dotenv=require('dotenv');
const connectDB=require("./config/db")
const cors=require("cors");
const PORT=process.env.PORT||5000;
const userRoutes=require("./routes/userRoutes")
dotenv.config();
connectDB();

// console.log("URI",process.env.MONGO_URI)
app.use(cors());
//accept JSon data
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("hello api")
})
app.use("/api/user",userRoutes);
// app.get("/api/chat",(req,res)=>{
//     res.send(chats)
//     console.log(chats);
// })
// app.get('/api/chat/:id',(req,res)=>{
//     //console.log(req.params.id);
//     const singleChat=chats.find((c)=>
//         c._id === req.params.id)
//     res.send(singleChat)
// })
app.listen(PORT,()=>{
    console.log(`port running on ${PORT}`)
})