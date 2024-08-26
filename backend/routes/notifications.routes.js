import express from 'express'
import { protectRoute } from '../middleware/protectedRoute.js'
import { deleteNotifications, getNotifications } from '../controllers/notification.controller.js';

const route = express.Router()

route.get("/all", protectRoute, getNotifications);
route.delete("/delet", protectRoute, deleteNotifications);

export default route;