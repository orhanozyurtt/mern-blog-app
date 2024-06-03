import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  tags: [{ type: String }],
  slug: { type: String, unique: true }, // Slug alanı eklendi
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

blogSchema.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }
  this.slug = slugify(this.title, { lower: true });
  next();
});
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
