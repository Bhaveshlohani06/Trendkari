import express from 'express';
import {
  createCategoryController,
  getAllCategoriesController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoryController.js';

import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔐 Create Category – Only Admin
router.post('/create-category', requireSignIn,isAdmin, createCategoryController);

// 📥 Get All Categories – Public
router.get('/categories', getAllCategoriesController);

// 📄 Get Single Category by Slug – Public
router.get('/get-category/:slug', getSingleCategoryController);

// ✏️ Update Category – Only Admin
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// ❌ Delete Category – Only Admin
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;
