import User from "../models/user.js";

// Middleware to check if the user is authenticated

export const protect = async(req,res,next)=>{
    const {userId} = req.auth;

    if(!userId){ //if userid is not present in the request
        res.json({success: false , message: "not authenticated"});
    }else{ //if userid is present in the request
        const user = await User.findById(userId);
        req.user =user;
        next();
    }
}