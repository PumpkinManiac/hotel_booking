import { Message } from "svix/dist/api/message.js";
import User from "../models/user.js"
import { Webhook } from "svix"

const clerkWebhooks = async (req, res) => {
    try{    
        // create a svix instance with clerk webhook secret 
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Getting Header
        const header ={
            "svix-id":red.header["svix-id"],
            "svix-timestamp":red.header["svix-timestamp"],
            "svix-signature":red.header["svix-signature"]
        }

        //Verifying Headers
        await whook.verify(JSON.stringify(req,res),header)

        //Geeting data from request body
        const {data,type}  = req.body

        const userData ={
            _id : data.id,
            email : data.email_addresses[0].email_address,
            username : data.first_name + " " + data.last_name,
            image : data.image_url,
        }

        switch (type) {
            case "user.created":{
                await User.create(userData)
                break;
            }
            case "user.updated":{
                await User.findByIdAndUpdate(data.id ,userData)
                break;
            } 
            case "user.deleted":{
                await User.findByIdAndDelete(data.id)
                break;
            } 
                   
            default:
                break;
        }
        res.json({success : true , message: "Webhook received"})
    }catch (error) {
        console.log(error.message);;
        res.json({success : false, message: error.message});
    }
}
  
export default clerkWebhooks;
