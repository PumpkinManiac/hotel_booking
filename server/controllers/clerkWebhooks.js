import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

 const header = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"]
};

if (!header["svix-id"] || !header["svix-timestamp"] || !header["svix-signature"]) {
    return res.status(400).json({ success: false, message: "Missing required headers" });
}


        // ✅ Verify the webhook
        const event = whook.verify(JSON.stringify(req.body), header);
        const { data, type } = event;

        // ✅ Process events
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                };
                await User.create(userData);
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    username: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }

            default:
                console.log("Unhandled webhook event:", type);
        }

        res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;
