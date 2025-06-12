import express from "express"
import 'dotenv/config';
import cors from 'cors';
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary(); //connect to cloudinary for image upload

const app = express();
const port = process.env.port || 3000

app.use(cors()) //Enable Cross-Origin Resource Sharing connect backend to frontend

//middleware    
app.use(express.json()) //all the request will pass through json method
app.use(clerkMiddleware())

//api to listen to clerk webhooks 
app.use('/api/clerk', clerkWebhooks)

app.get('/',(req,res)=>res.send("API is working"))
app.use('/api/user', userRouter) //when to hit this endpoint it will give usedata like role and recent searched cities
app.use('/api/hotels', hotelRouter) //when to hit this endpoint it will register a new hotel
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

app.listen(port ,()=>{
    console.log(`Server is running at port ${port}`)
})