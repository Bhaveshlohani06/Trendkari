// routes/search.js
import express from 'express';

const router = express.Router();
import {searchController} from '../controllers/searchController.js';
import { requireSignIn } from '../middleware/authMiddleware.js';

// Public search routes
router.get('/basic', searchController.basicSearch);
router.get('/autocomplete', searchController.autocomplete);

// Protected advanced search route (requires authentication)
router.get('/advanced', requireSignIn, searchController.advancedSearch);

export default router;