import { HTTP_CODES } from '../config/Enum.js';
import CustomError from '../lib/Error.js';
import Response from '../lib/Response.js';
import Blog from '../db/models/blogModel.js';
import User from '../db/models/userModel.js'; // User modelini ekledim
import Category from '../db/models/categoryModel.js';

// Yardımcı programı tanımlayın
const parseDate = (isoDateString) => {
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Ay 0 indeksli, bu yüzden 1 ekliyoruz
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};
class BlogController {
  async globalListByCategory(req, res) {
    try {
      const { categoryId, categoryName, page = 1, limit = 10 } = req.query;

      if (!categoryId && !categoryName) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Please provide category id or category name',
          'Either category id or name is required, but not both'
        );
      }

      if (categoryId && categoryName) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Please provide category id or category name',
          'Either category id or name is required, but not both'
        );
      }

      let category;
      if (categoryId) {
        category = await Category.findById(categoryId);
      } else {
        category = await Category.findOne({ name: categoryName });
      }

      if (!category) {
        throw new CustomError('Category not found', HTTP_CODES.NOT_FOUND);
      }

      const totalCount = await Blog.countDocuments({
        category: category._id,
        isPublished: true,
      });

      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;

      const blogs = await Blog.find({
        category: category._id,
        isPublished: true,
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      const formattedBlogs = blogs.map((blog) => ({
        ...blog._doc,
        publishDate: blog.publishDate
          ? new Date(blog.publishDate).toLocaleDateString('tr-TR')
          : null,
        creationDate: blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString('tr-TR')
          : null,
        updatedAt: blog.updatedAt
          ? new Date(blog.updatedAt).toLocaleDateString('tr-TR')
          : null,
      }));

      res.status(HTTP_CODES.OK).json(
        Response.successResponse(
          formattedBlogs,
          'List of blogs fetched successfully',
          {
            totalPages,
            currentPage: page,
            totalCount,
          }
        )
      );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async globalList(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const totalCount = await Blog.countDocuments({ isPublished: true });

      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;

      const blogs = await Blog.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      const formattedBlogs = blogs.map((blog) => ({
        ...blog._doc,
        publishDate: blog.publishDate
          ? new Date(blog.publishDate).toLocaleDateString('tr-TR')
          : null,
        creationDate: blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString('tr-TR')
          : null,
        updatedAt: blog.updatedAt
          ? new Date(blog.updatedAt).toLocaleDateString('tr-TR')
          : null,
      }));

      res.status(HTTP_CODES.OK).json(
        Response.successResponse(
          formattedBlogs,
          'List of blogs fetched successfully',
          {
            totalPages,
            currentPage: page,
            totalCount,
          }
        )
      );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async categoryList(req, res) {
    try {
      const categories = await Category.find();
      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            categories,
            'List of categories fetched successfully',
            HTTP_CODES.OK
          )
        );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async list(req, res) {
    try {
      const userId = req.user.id; // Kullanıcının ID'sini al
      // Find all blogs that belong to the current user
      const blogs = await Blog.find({ author: userId });

      // Tarih formatını güncelle
      const formattedBlogs = blogs.map((blog) => ({
        ...blog._doc,
        publishDate: blog.publishDate
          ? new Date(blog.publishDate).toLocaleDateString('tr-TR')
          : null,
        creationDate: blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString('tr-TR')
          : null,
        updatedAt: blog.updatedAt
          ? new Date(blog.updatedAt).toLocaleDateString('tr-TR')
          : null,
      }));

      // Send success response with the list of blogs
      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            formattedBlogs,
            'List of blogs fetched successfully',
            HTTP_CODES.OK
          )
        );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async add(req, res) {
    if (req.user) {
      console.log(req.user);
    }
    try {
      const { title, content, tags, category, isPublished } = req.body;
      const { _id, name } = req.user;
      let publishDate;

      // Check if the title is unique
      const existingBlog = await Blog.findOne({ title });
      if (existingBlog) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Title already exists',
          'A blog post with this title already exists.'
        );
      }

      // Extract author information from request (assuming it's provided in the request)
      const userId = _id;
      const userName = name;

      // Validate user ID and user name
      if (!userId || !userName) {
        throw new CustomError(
          HTTP_CODES.UNAUTHORIZED,
          'Not authorized',
          'User ID or username not found'
        );
      }

      // Check if the category exists
      let categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        // If the category does not exist, create a new one
        categoryDoc = new Category({ name: category });
        await categoryDoc.save();
      }

      if (typeof isPublished === 'boolean') {
        if (isPublished) {
          publishDate = new Date(); // Set publish date to current date if isPublished is true
        } else {
          publishDate = undefined;
        }
      }

      // Create a new blog post
      const newBlog = new Blog({
        title,
        content,
        tags: tags || [], // If tags is not provided, set it to an empty array
        author: userId,
        authorName: userName, // Add authorName
        category: categoryDoc._id, // Add category ID
        publishDate: publishDate, // Add parsed publish date
        isPublished: isPublished, // Set isPublished based on the presence of publishDate
      });

      // Save the blog post to the database
      const savedBlog = await newBlog.save();

      // Send success response
      res
        .status(HTTP_CODES.CREATED)
        .json(
          Response.successResponse(
            savedBlog,
            'Blog post created successfully',
            HTTP_CODES.CREATED
          )
        );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async update(req, res) {
    try {
      const { title, content, tags, newTags, category, isPublished } = req.body;
      const slug = req.params.slug; // slug parametresini al

      // Find the blog post by slug
      const blog = await Blog.findOne({ slug });
      console.log('Blog içinde  ? ', blog);

      if (!blog) {
        throw new CustomError(
          HTTP_CODES.NOT_FOUND,
          'Blog not found',
          'The blog post with the provided slug does not exist.'
        );
      }

      // Check if both tags and newTags are provided
      if (tags && newTags) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Invalid request',
          'Both tags and newTags cannot be provided simultaneously. Use only one of them.'
        );
      }

      // Update the blog post fields if they are provided
      if (title) blog.title = title;
      if (content) blog.content = content;

      // Update isPublished field and manage publishDate
      if (typeof isPublished === 'boolean') {
        if (isPublished && !blog.isPublished) {
          blog.isPublished = true;
          blog.publishDate = new Date(); // Set publish date if the blog is being published
        } else if (!isPublished && blog.isPublished) {
          blog.isPublished = false;
          blog.publishDate = null; // Clear publish date if the blog is being unpublished
        }
      }

      // Update tags based on newTags if provided
      if (Array.isArray(newTags) && newTags.length > 0) {
        blog.tags = newTags; // Replace existing tags with new tags
      } else if (tags) {
        // Merge new tags with existing tags, ensuring no duplicates
        const newTagSet = new Set([...blog.tags, ...tags]);
        blog.tags = [...newTagSet];
      }

      // Check if the category exists and update it
      if (category) {
        let categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
          // If the category does not exist, create a new one
          categoryDoc = new Category({ name: category });
          await categoryDoc.save();
        }
        blog.category = categoryDoc._id; // Update the category ID
      }

      // Save the updated blog post
      const updatedBlog = await blog.save();

      // Send success response
      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            updatedBlog,
            'Blog post updated successfully',
            HTTP_CODES.OK
          )
        );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async delete(req, res) {
    try {
      const slug = req.params.slug; // slug parametresini al

      // Find the blog post by slug and delete it
      const deletedBlog = await Blog.findOneAndDelete({ slug });

      if (!deletedBlog) {
        throw new CustomError(
          HTTP_CODES.NOT_FOUND,
          'Blog not found',
          'This blog post with the provided slug does not exist.'
        );
      }

      // Send success response
      res
        .status(HTTP_CODES.OK)
        .json(Response.successResponse('Blog post deleted successfully'));
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async detail(req, res) {
    try {
      const slug = req.params.slug;
      const blog = await Blog.findOne({ slug });

      if (!blog) {
        return res
          .status(HTTP_CODES.BAD_REQUEST)
          .json(
            Response.errorResponse(
              new CustomError(
                HTTP_CODES.BAD_REQUEST,
                'Blog not found',
                'Blog does not exist'
              )
            )
          );
      }

      const category = await Category.findById(blog.category);

      if (!category) {
        return res
          .status(HTTP_CODES.BAD_REQUEST)
          .json(
            Response.errorResponse(
              new CustomError(
                HTTP_CODES.BAD_REQUEST,
                'Category not found',
                'Category does not exist'
              )
            )
          );
      }

      const categoryName = category.name;
      let publishDate = null;
      let createdAt = null;
      let updatedAt = null;

      if (blog.publishDate) {
        publishDate = parseDate(blog.publishDate);
        console.log('Publish Date:', publishDate);
      }

      if (blog.createdAt) {
        createdAt = parseDate(blog.createdAt);
        console.log('Created Date:', createdAt);
      }

      if (blog.updatedAt) {
        updatedAt = parseDate(blog.updatedAt);
        console.log('Updated Date:', updatedAt);
      }

      const blogRes = {
        title: blog.title,
        content: blog.content,
        tags: blog.tags,
        author: blog.author,
        authorName: blog.authorName,
        categoryName: categoryName,
        createdAt: createdAt,
        updatedAt: updatedAt,
        slug: blog.slug,
        publishDate: publishDate,
      };

      return res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            blogRes,
            'Blog post details retrieved successfully',
            HTTP_CODES.OK
          )
        );
    } catch (error) {
      console.error('Error:', error.message);
      return res
        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(
          Response.errorResponse(
            new CustomError(
              HTTP_CODES.INTERNAL_SERVER_ERROR,
              error.message,
              'An error occurred while retrieving the blog details'
            )
          )
        );
    }
  }
}

export default new BlogController();
