import { HTTP_CODES } from '../config/Enum.js';
import CustomError from '../lib/Error.js';
import Response from '../lib/Response.js';
import Blog from '../db/models/blogModel.js';
import User from '../db/models/userModel.js'; // User modelini ekledim

class BlogController {
  async list(req, res) {
    try {
      const userId = req.user.id; // Kullanıcının ID'sini al
      // Find all blogs that belong to the current user
      const blogs = await Blog.find({ author: userId });

      // Send success response with the list of blogs
      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            blogs,
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
    try {
      const { title, content, tags } = req.body;
      // Check if the title is unique
      const existingBlog = await Blog.findOne({ title });
      if (existingBlog) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Title already exists',
          'A blog post with this title already exists.'
        );
      }

      // Get user ID from the JWT
      const userId = req.user?._id;

      // Check if user ID exists
      if (!userId) {
        throw new CustomError(
          HTTP_CODES.UNAUTHORIZED,
          'Not authorized',
          'User ID not found'
        );
      }

      // Check if user ID exists in the database
      const userExists = await User.findById(userId);
      if (!userExists) {
        throw new CustomError(
          HTTP_CODES.NOT_FOUND,
          'User not found',
          'The user ID does not match any user in the database'
        );
      }

      // Create a new blog post
      const newBlog = new Blog({
        title,
        content,
        tags: tags || [], // If tags is not provided, set it to an empty array
        author: userId,
        authorName: userExists.name, // Add authorName
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
      const { title, content, tags, newTags } = req.body;
      const slug = req.params.slug; // slug parametresini al

      // Find the blog post by slug
      const blog = await Blog.findOne({ slug });

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

      // Update tags based on newTags if provided
      if (Array.isArray(newTags) && newTags.length > 0) {
        blog.tags = newTags; // Replace existing tags with new tags
      } else if (tags) {
        // Merge new tags with existing tags, ensuring no duplicates
        const newTagSet = new Set([...blog.tags, ...tags]);
        blog.tags = [...newTagSet];
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
          'The blog post with the provided slug does not exist.'
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
    res.json('welcome blog detail');
  }
}

export default new BlogController();
