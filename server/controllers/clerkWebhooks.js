// controllers/clerkWebhooks.js
import User from "../models/user.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // 1) Svix needs the RAW body string to verify
    const rawBody = req.body; // this is a Buffer when you use express.raw()

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2) Collect the Svix headers
    const headers = {
      "svix-id":        req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // 3) Verify signature against the raw body
    whook.verify(rawBody, headers);

    // 4) Now parse out the event payload
    const { type, data } = JSON.parse(rawBody.toString());

    switch (type) {
      case "user.created": {
        await User.create({
          _id:                  data.id,
          email:                data.email_addresses?.[0]?.email_address || "",
          name:                 `${data.first_name} ${data.last_name}`.trim(),
          image:                data.image_url,
          role:                 "user",
          recentSearchedCities: [],
        });
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses?.[0]?.email_address,
          name:  `${data.first_name} ${data.last_name}`.trim(),
          image: data.image_url,
        });
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        // ignore other events
        break;
    }

    return res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export default clerkWebhooks;
