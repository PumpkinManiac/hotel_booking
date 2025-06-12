import User from "../models/user.js"; // ✅ You need to import the User model to call `user.save()`

// GET /api/user
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchCities = req.user.recentSearchCities;
        res.json({ success: true, role, recentSearchCities });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// POST /api/user/store-recent-search
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchCity } = req.body;
        const user = await User.findById(req.user._id); // ✅ FIXED: get fresh user document for `.save()`

        if (!user.recentSearchCities) {
            user.recentSearchCities = [];
        }

        // Optional: prevent duplicates
        // user.recentSearchCities = user.recentSearchCities.filter(city => city !== recentSearchCity);

        if (user.recentSearchCities.length < 3) {
            user.recentSearchCities.push(recentSearchCity);
        } else {
            user.recentSearchCities.shift();
            user.recentSearchCities.push(recentSearchCity);
        }

        await user.save();

        res.json({ success: true, message: "City added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
