import express from 'express'
import {getUsersToFollow} from '../controllers/userController.js'
import { requireSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users-to-follow',requireSignIn, getUsersToFollow);


export default router;