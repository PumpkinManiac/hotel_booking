import User from "../models/user.js"
import { Webhook } from "svix"

const clerkWebhooks = async (req, res) => {
    try{    
        // create a svix instance with clerk webhook secret 
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Getting Header
        const header ={
            "svix-id":red.header["svix-id"],
            "svix-timestamp":req.header["svix-timestamp"],
            "svix-signature":req.header["svix-signature"]
        }

        //Verifying Headers
        await whook.verify(JSON.stringify(req.body),header)

        //Geeting data from request body
        const {data,type}  = req.body

        
    switch (type) {

        case "user.created":{

            const userData ={
            _id : data.id,
            email : data.email_addresses[0].email_address,
            username : data.first_name + " " + data.last_name,
            image : data.image_url,
        }
                await User.create(userData)
                break;
            }

        case "user.updated":{

            const userData ={
            _id : data.id,
            email : data.email_addresses[0].email_address,
            username : data.first_name + " " + data.last_name,
            image : data.image_url,
        }
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
