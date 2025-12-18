import axios from 'axios';
import KundliModel from '../models/kundli.model.js';

export const generateKundli = async (req, res) => {
    try {
        const { day, month, year, hour, min, lat, lon, tzone, place } = req.body;
        const userId = req.user._id || req.user.id; // Ensure this matches your authMiddleware

        // 1. Force convert strings to numbers
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const timezone = parseFloat(tzone);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ success: false, message: "Invalid Coordinates. Please select a city." });
        }

        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDob = `${pad(day)}/${pad(month)}/${year}`;
        const formattedTob = `${pad(hour)}:${pad(min)}`;

        // 2. Call External API
        const response = await axios.get('https://api.vedicastroapi.com/v3-json/horoscope/planet-details', {
            params: {
                dob: formattedDob,
                tob: formattedTob,
                lat: latitude,
                lon: longitude,
                tz: timezone,
                api_key: process.env.ASTRO_API_KEY,
                lang: 'en'
            }
        });

        if (response.data.status === 200) {
            // 3. CRITICAL: Save/Update to your Database
            const savedKundli = await KundliModel.findOneAndUpdate(
                { userId },
                { 
                    userId,
                    dob: formattedDob,
                    tob: formattedTob,
                    place,
                    lat: latitude,
                    lon: longitude, 
                    chartData: response.data.response 
                },
                { upsert: true, new: true }
            );

            // 4. SEND RESPONSE BACK (This stops the "Aligning Stars" spinner)
            return res.status(200).json({ 
                success: true, 
                data: savedKundli.chartData 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: response.data.msg || "External API Error" 
            });
        }

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).json({ success: false, message: "Server calculation error" });
    }
};

// 3. Fetch data from your DB (This prevents losing data on refresh)
export const getSavedKundli = async (req, res) => {
    try {
        const kundli = await KundliModel.findOne({ userId: req.user.id });
        if (!kundli) return res.json({ success: true, data: null });
        
        res.status(200).json({ success: true, data: kundli.chartData });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// 4. Delete saved Kundli
export const deleteKundli = async (req, res) => {
    try {
        await KundliModel.findOneAndDelete({ userId: req.user.id });
        res.json({ success: true, message: "Kundli deleted" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};