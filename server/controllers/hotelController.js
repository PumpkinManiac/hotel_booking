import Hotel from "../models/Hotel.js";
import User from "../models/user.js";

//api controller to register a hotel
export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id; 

        // check if the user is already registered
        const hotel = await Hotel.findOne({ owner });
        if (hotel) { //if hotel is already registered
            return res.json({ success: false, message: "Hotel already registered" });
        }
        //otherwise create a new hotel
        await Hotel.create({ name, address, contact, city, owner });
        //update the user role to hotelOwner
        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.json({ success: true, message: "Hotel registered successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
