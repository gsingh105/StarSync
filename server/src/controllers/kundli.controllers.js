import axios from 'axios';
import KundliModel from '../models/kundli.model.js';

export const generateKundli = async (req, res) => {
    try {
        const { day, month, year, hour, min, lat, lon, tzone, place } = req.body;
        const userId = req.user._id || req.user.id; 

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const timezone = parseFloat(tzone);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ success: false, message: "Invalid Coordinates. Please select a city." });
        }

        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDob = `${pad(day)}/${pad(month)}/${year}`;
        const formattedTob = `${pad(hour)}:${pad(min)}`;

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

export const getSavedKundli = async (req, res) => {
    try {
        const kundli = await KundliModel.findOne({ userId: req.user.id });
        if (!kundli) return res.json({ success: true, data: null });

        res.status(200).json({ success: true, data: kundli.chartData });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const deleteKundli = async (req, res) => {
    try {
        await KundliModel.findOneAndDelete({ userId: req.user.id });
        res.json({ success: true, message: "Kundli deleted" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const getDailyHoroscope = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        const kundli = await KundliModel.findOne({ userId });
        if (!kundli) {
            return res.status(404).json({ success: false, message: "Please generate your Kundli first." });
        }

        const rasi = kundli.chartData.rasi; 
        const rasiMap = {
            "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4,
            "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8,
            "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
        };

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDate = `${pad(tomorrow.getDate())}/${pad(tomorrow.getMonth() + 1)}/${tomorrow.getFullYear()}`;

        const response = await axios.get('https://api.vedicastroapi.com/v3-json/prediction/daily-sun', {
            params: {
                zodiac: rasiMap[rasi],
                date: formattedDate,
                api_key: process.env.ASTRO_API_KEY,
                lang: 'en',
                split: true,
                type: 'big'
            }
        });

        res.status(200).json({
            success: true,
            zodiac: rasi,
            date: formattedDate,
            prediction: response.data.response
        });

    } catch (error) {
        console.error("Horoscope Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch horoscope" });
    }
};

export const getMatchingResult = async (req, res) => {
    try {
        const { p1, p2 } = req.body;
        const api_key = process.env.ASTRO_API_KEY;
        const gunaRes = await axios.get('https://api.vedicastroapi.com/v3-json/matching/ashtakoot', {
            params: {
                boy_dob: p1.dob, boy_tob: p1.tob, boy_lat: p1.lat, boy_lon: p1.lon, boy_tz: p1.tz,
                girl_dob: p2.dob, girl_tob: p2.tob, girl_lat: p2.lat, girl_lon: p2.lon, girl_tz: p2.tz,
                api_key, lang: 'en'
            }
        });

        let manglikData = { p1: { is_manglik: false }, p2: { is_manglik: false } };
        try {
            const [boyManglik, girlManglik] = await Promise.all([
                axios.get('https://api.vedicastroapi.com/v3-json/horoscope/manglik', {
                    params: { dob: p1.dob, tob: p1.tob, lat: p1.lat, lon: p1.lon, tz: p1.tz, api_key, lang: 'en' }
                }),
                axios.get('https://api.vedicastroapi.com/v3-json/horoscope/manglik', {
                    params: { dob: p2.dob, tob: p2.tob, lat: p2.lat, lon: p2.lon, tz: p2.tz, api_key, lang: 'en' }
                })
            ]);
            manglikData.p1 = boyManglik.data.response;
            manglikData.p2 = girlManglik.data.response;
        } catch (mErr) {
            console.warn("Manglik API failed, but continuing with Guna results.");
        }

        res.status(200).json({
            success: true,
            response: {
                guna: gunaRes.data.response,
                manglik: manglikData
            }
        });
    } catch (error) {
        console.error("MATCHING CRITICAL ERROR:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Astrology API Error",
            error: error.response?.data?.msg || error.message
        });
    }
};