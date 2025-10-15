import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrls: {
      type: [String],
      default:
        [],
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    likes: {
        type: [String],
        default: [],
    },
    numberOfViews: {
        type: Number,
        default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
