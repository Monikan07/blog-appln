import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost, likePost, viewPost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts)
router.put('/likepost/:postId', verifyToken, likePost); 
router.put('/viewpost/:postId', viewPost); 
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)


export default router;