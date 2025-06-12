import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Helper function to check room availability
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try { //to find the room
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch (error) {
    console.error("Availability check error:", error.message);
  }
};
//Api to check room availability
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Api to create a booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    //Before Booking check Availability
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not Available" });
    }
    //Get TotalPice for Room
    const roomData = await Room.findById(room).populate("hotel");

    let totalPrice = roomData.pricePerNight;
    //Calculate price based on nights

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    totalPrice *= nights;
    //these data will be stored in database when we create new booking
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Booking Confirmation",
      html: `
        <h1>Your Booking Details</h1>
        <p>Dear ${req.user.userName},</p>
        <p>Thank you for booking with us! Here are your details:</p>
        <ul>
            <li><strong>Booking ID</strong>: ${booking._id}</li>
            <li>Hotel: ${roomData.hotel.name}</li>
            <li>Room Type: ${roomData.roomType}</li>
            <li>Location: ${roomData.hotel.address}</li>
            <li>Check-In Date: ${new Date(booking.checkInDate).toDateString()}</li>
            <li>Check-Out Date: ${new Date(booking.checkOutDate).toDateString()}</li>
            <li>Total Price: ${process.env.CURRENCY || '$'} ${totalPrice}</li>
        </ul>
        <p>Looking forward to welcoming you!</p>
        <p>If you need to make any changes, feel free to contact us.</p>
        <br/>
        <p>Best Regards,<br/>Hotel Booking Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};
//API to get all bookings of a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    //to find the bookings of the user
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

// GET /api/bookings/hotel-owner
export const getHotelBookings = async (req, res) => {
  try {
    // find the hotel for particular owner
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found for this owner" });
    }
    // find the bookings for that hotel of that owner
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: {
        bookings,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch booking" });
  }
};
