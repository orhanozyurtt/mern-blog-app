import mongoose from 'mongoose';
import slugify from 'slugify';
import Category from './categoryModel.js'; // Category modelini import edin

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  tags: [{ type: String }],
  slug: { type: String, unique: true }, // Slug alanı eklendi
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }, // Kategori referansı
  publishDate: { type: Date }, // Yayınlama tarihi dışarıdan alınacak şekilde eklendi
  isPublished: { type: Boolean, default: false }, // Yayınlandı bilgisi boolean olarak eklendi
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

blogSchema.pre('save', function (next) {
  if (this.publishDate) {
    this.isPublished = true;
  } else {
    this.isPublished = false;
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
