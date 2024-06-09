import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getUserProfile,
  folloUnfollowUser,
  getSuggestedUsers,
  updateUser
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get('/suggeste',protectedRoute,getSuggestedUsers)
router.post("/follow/:id", protectedRoute, folloUnfollowUser);
router.post('/update',protectedRoute,updateUser) 
export default router;
