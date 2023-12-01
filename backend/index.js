const express=require("express");
const app=express();
const mongoose=require("mongoose")
const userRoute=require("./routes/user")
const authRoute=require("./routes/auth")
const productRoute=require("./routes/product")
const cartRoute=require("./routes/cart")
const orderRoute=require("./routes/order")
const dotenv=require("dotenv");

dotenv.config();
//connect to mongoDB
dbUrl="mongodb://0.0.0.0/ekart";

mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.log("Error Connecting MongoDB", err.message))

//to check API
app.use(express.json())
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/carts",cartRoute);
app.use("/api/orders",orderRoute);

app.listen(3000,()=>{
    console.log("backend is sucess");
})