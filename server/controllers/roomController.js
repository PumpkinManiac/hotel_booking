import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotel) return res.json({ success: false, message: "No Hotel found" });

        // Upload images to Cloudinary
        const uploadImage = req.files.map(file =>
            cloudinary.uploader.upload(file.path).then(response => response.secure_url)
        );

        const images = await Promise.all(uploadImage);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: typeof amenities === "string" ? JSON.parse(amenities) : amenities,
            images,
        });

        res.json({ success: true, message: "Room created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to get all rooms
export const getRooms = async (req, res) => {
    try {
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
        if (!hotelData) return res.json({ success: false, message: "Hotel not found" });

        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate('hotel');
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
        if (!roomData) return res.json({ success: false, message: "Room not found" });

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();

        res.json({ success: true, message: "Room availability toggled successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
