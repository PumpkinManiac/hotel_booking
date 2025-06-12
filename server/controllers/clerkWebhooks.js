import User from "../models/user.js";
import { Webhook } from "svix";
//function to get user data

const clerkWebhooks = async (req, res) => {
    try {
        //Create a Svix instance with your Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

 const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
};

//Verify the webhook request
await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;

        //Switch case to handle different webhook events
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                };
                await User.create(userData); //to create a new user in database
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    username: data.first_name + " " + data.last_name,
                    image: data.image_url,
                };
                //get the user by id and update the user data
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                break;
        }

        res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
};

export default clerkWebhooks;
