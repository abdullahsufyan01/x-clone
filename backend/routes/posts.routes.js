import e from "express";
import { protectRoute } from "../middleware/protectedRoute.js";
import { postComments, createPost, deletePost,togglePostReaction, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts } from "../controllers/posts.controller.js";

const router = e.Router();

router.post('/create-post',protectRoute,createPost)
router.delete('/:id',protectRoute,deletePost)
router.post('/comments/:id',protectRoute,postComments)
router.post("/post-reaction/:id", protectRoute, togglePostReaction);
router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);

export default router