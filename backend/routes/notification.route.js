import express from "express";
import { protectedRoute } from "../middleware/protectedRoute";

const router = express.Router()

router.get("/",protectedRoute,getNotifications)
router.delete("/",protectedRoute,deleteNotifications)
router.delete("/:id",protectedRoute,deleteNotificationById)

export default express;
