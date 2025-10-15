import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  const { title, content, imageUrls, category } = req.body;

  const slug = title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  const newPost = new Post({
    title,
    content,
    category,
    imageUrls,
    slug,
    userId: req.user.id,
    image: imageUrls && imageUrls.length > 0 ? imageUrls[0] : undefined,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const searchTerm = req.query.searchTerm || '';
    const category = req.query.category || '';

    const filters = {};

    if (searchTerm) {
      filters.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (category && category !== 'uncategorized') {
      filters.category = category;
    }

    if (req.query.userId) {
      filters.userId = req.query.userId;
    }

    if (req.query.postId) {
      filters._id = req.query.postId;
    }
    if (req.query.slug) {
      filters.slug = req.query.slug;
    }

    const posts = await Post.find(filters)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filters);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, 'Post not found'));

    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const viewPost = async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $inc: { numberOfViews: 1 } },
      { new: true }
    );

    if (!updatedPost) return next(errorHandler(404, 'Post not found'));

    res.status(200).json({ message: 'View count increased' });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          imageUrls: req.body.imageUrls,
          image:
            req.body.imageUrls && req.body.imageUrls.length > 0
              ? req.body.imageUrls[0]
              : undefined,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
