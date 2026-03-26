// // routes/search.js
// import express from 'express';

// const router = express.Router();
// // import {searchController} from '../controllers/searchController.js';
// import { requireSignIn } from '../middleware/authMiddleware.js';
// import { advancedSmartSearch } from '../controllers/searchController.js';

// // Public search routes
// router.get('/basic', searchController.basicSearch);
// router.get('/autocomplete', searchController.autocomplete);

// // Protected advanced search route (requires authentication)
// router.get('/advanced', requireSignIn, searchController.advancedSearch);


// router.post('/ai-search', advancedSmartSearch);

// export default router;



import express from 'express';
import { requireSignIn } from '../middleware/authMiddleware.js';

import {
  basicSearch,
  autocomplete,
  advancedSearch,
  advancedSmartSearch
} from '../controllers/searchController.js';

const router = express.Router();

// ✅ Public
router.get('/basic', basicSearch);
router.get('/autocomplete', autocomplete);

// ✅ Protected
router.get('/advanced', requireSignIn, advancedSearch);

// 🚀 AI SMART SEARCH
router.post('/ai-search', advancedSmartSearch);

export default router;