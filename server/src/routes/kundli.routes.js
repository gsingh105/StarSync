import express from 'express';
import { generateKundli, getSavedKundli, deleteKundli } from '../controllers/kundli.controllers.js';
import { authMiddleware } from '../middlewares/autMiddleware.js';

const router = express.Router();

router.post('/generate', authMiddleware, generateKundli);
router.get('/saved', authMiddleware, getSavedKundli); // Called on page refresh
router.delete('/delete', authMiddleware, deleteKundli);

export default router;