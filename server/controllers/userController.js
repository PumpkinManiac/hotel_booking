//api to get the userdata from the database 

// GET /api/user
// function to get user data like role and recent searched cities from the database
export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({ success: true, role, recentSearchedCities });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Store recent searched cities in the database
// POST /api/user/store-recent-search
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = await req.user;

        // Optional: prevent duplicates
        // user.recentSearchCities = user.recentSearchCities.filter(city => city !== recentSearchCity);

        if (user.recentSearchedCities.length < 3) {
            user.recentSearchedCities.push(recentSearchedCity);
        } else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity);
        }

        await user.save(); //update the user document in the database

        res.json({ success: true, message: "City added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


