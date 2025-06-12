//Function to check Availability of room

import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";

const checkAvailability = async ({checkInDate,checkOutDate,room}) => {
    try {
        const bookings  = await Booking.find({
            room,
            checkInDate :{$lte : checkOutDate},
            checkOutDate : {$gte : checkInDate},
            }); 
            const isAvailable = bookings.length == 0;
            return isAvailable
    } catch (error) {
        console.log(error.message)
    }
}

//API to check Availability of room
//POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req,res)=> {
    try {
        const {room ,checkInDate , checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate,checkOutDate,room})
        res.json({success : true ,isAvailable})
    } catch (error) {
        res.json({success : false ,message : error.message})
    }
}

//API to create new Booking
//POST /api/bookings/book

export const createBooking = async (req,res)=>{
    try {
        const {room,checkInDate,checkOutDate} = req.body;
        const user = req.user._id;
        //Before Booking check availability 
        const isAvailable = await checkAvailability({checkInDate,checkOutDate,room})

        if(!isAvailable){
            return res.json({success :true ,message : "Room is not Available"})
        }
        //Total Price for Room 
        const roomData = await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;
        //calculate totalPrice based on nights

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)

        const timeDiff = checkOut.getTime() - checkIn.getTime();

        const night = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= night;

        const booking = await Booking.create({
            user,room,hotel: roomData.hotel._id,
            guests : +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: "Booking Confirmation",
            html:`
            <h1>Your Booking Details</h1>
            <p>Dear ${req.user.UsertName},</p>
            <p>Thank you for booking with us! Here are your details:</p>
            <ul>
                <li>Hotel: ${roomData.hotel.name}</li>
                <li><strong>Booking ID</strong> :${booking._id}</li>
                <li>Room Type: ${roomData.roomType}</li>
                <li>Location : ${roomData.hotel.address}</li>
                <li>Check-In Date: ${booking.checkInDate.toDateString()}</li>
                <li>Check-Out Date: ${booking.checkOutDate.toDateString()}</li>
                <li>Total Price:  ${process.env.currency || '$'} ${booking.totalPrice} / night</li>
            </ul>
            <p>Looking Forward to welcome you !</p>
            <p>Best Regards,If you need to make any changes feel free to contact us</p>
            `
        }

        await transporter.sendMail(mailOptions)

        res.json({success : true , message : "Booking created successfully"})
    } catch (error) {
        console.log(error)
        res.json({success : false , message : error.message})
    }
}

//API to get all bookings for a user
//GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({createdAt: -1})           
        res.json({ success: true, bookings });
    }catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//API to get all bookings for a hotel owner
//GET /api/bookings/hotel-owner

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.json({ success: false, message: "No hotel found for this owner" });
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({createdAt: -1});  
        //Total Bookings
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((acc,booking)=> acc + booking.totalPrice,0)

        res.json({ success: true, dashboardData: { bookings, totalBookings, totalRevenue}});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch booking" });
    }
}
