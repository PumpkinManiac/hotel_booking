import express from "express"
import 'dotenv/config';
import cors from 'cors';
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB()

const app = express();
const port = process.env.port || 3000

app.use(cors()) //Enable Cross-Origin Resource Sharing

//middleware    
app.use(express.json())
app.use(clerkMiddleware())

//api to listen to clerk webhooks 
app.use("/api/clerk", clerkWebhooks)

app.get('/',(req,res)=>res.send("API is working"))

app.listen(port ,()=>{
    console.log(`Server is running at port ${port}`)
})