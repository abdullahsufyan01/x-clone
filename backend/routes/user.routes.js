import express from "express"
import { protectRoute } from "../middleware/protectedRoute.js"
import { usersUonnection, getUserProfile, suggestedUsers, updateUser } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/profile/:username", protectRoute,getUserProfile)
router.get("/suggested", protectRoute,suggestedUsers)
router.post("/connection/:id", protectRoute,usersUonnection)
router.post("/update-profile", protectRoute,updateUser)


export default router