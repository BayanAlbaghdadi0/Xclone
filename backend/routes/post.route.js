import express from 'express'
import { protectedRoute } from '../middleware/protectedRoute.js';

import {
    createPost,
    deletePost,
    commentOnPost,
    likeUnlikePost,
    getAllPosts,
    getLikesPost,
    getUserPosts
} from '../controllers/post.controller.js'

const router = express.Router();
router.get('/posts', getAllPosts);
router.get('/likes/:userId', getLikesPost);
router.get('/user/:username', getUserPosts);
router.post('/create',protectedRoute,createPost)
router.post('/like/:postId',protectedRoute,likeUnlikePost)
router.post('/comment/:postId',protectedRoute,commentOnPost)
router.delete('/delete/:postId',protectedRoute,deletePost)

export default router