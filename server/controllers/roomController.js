import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId }); //find the hotel by owner ID

        if (!hotel) return res.json({ success: false, message: "No Hotel found" });

        // Upload images to Cloudinary
        const uploadImages = req.files.map(async (file) =>{
             const response = await cloudinary.uploader.upload(file.path);
             return response.secure_url; // Return the secure URL of the uploaded image
        }
        );
        //Wait for all images to be uploaded
        const images = await Promise.all(uploadImages);

        //Store the data in the database
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight, // Convert pricePerNight {string} to a number
            amenities: JSON.parse(amenities),
            images,
        });

        res.json({ success: true, message: "Room created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get all rooms to display on the frontend
export const getRooms = async (req, res) => {
    try {
        //It will find the room where isAvailable is true and in that room data it will add hotel also
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });

        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId });

        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate('hotel');

        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();

        res.json({ success: true, message: "Room availability toggled successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
