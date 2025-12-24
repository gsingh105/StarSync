import express from 'express';
import { generateKundli, getSavedKundli, deleteKundli, getDailyHoroscope,getMatchingResult } from '../controllers/kundli.controllers.js';
import { authMiddleware } from '../middlewares/autMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateKundli);
router.get('/saved', authMiddleware, getSavedKundli); 
router.delete('/delete', authMiddleware, deleteKundli);
router.get('/horoscope', authMiddleware, getDailyHoroscope)
router.post('/matching', authMiddleware, getMatchingResult);

export default router;