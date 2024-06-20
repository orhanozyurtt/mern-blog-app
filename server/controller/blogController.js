import { HTTP_CODES } from '../config/Enum.js';
import CustomError from '../lib/Error.js';
import Response from '../lib/Response.js';
import Blog from '../db/models/blogModel.js';
import User from '../db/models/userModel.js'; // User modelini ekledim
import Category from '../db/models/categoryModel.js';
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

  // async add(req, res) {
  //   try {
  //     const { title, content, tags , } = req.body;
  //     // Check if the title is unique
  //     const existingBlog = await Blog.findOne({ title });
  //     if (existingBlog) {
  //       throw new CustomError(
  //         HTTP_CODES.BAD_REQUEST,
  //         'Title already exists',
  //         'A blog post with this title already exists.'
  //       );
  //     }

  //     // Get user ID from the JWT
  //     const userId = req.user?._id;

  //     // Check if user ID exists
  //     if (!userId) {
  //       throw new CustomError(
  //         HTTP_CODES.UNAUTHORIZED,
  //         'Not authorized',
  //         'User ID not found'
  //       );
  //     }

  //     // Check if user ID exists in the database
  //     const userExists = await User.findById(userId);
  //     if (!userExists) {
  //       throw new CustomError(
  //         HTTP_CODES.NOT_FOUND,
  //         'User not found',
  //         'The user ID does not match any user in the database'
  //       );
  //     }

  //     // Create a new blog post
  //     const newBlog = new Blog({
  //       title,
  //       content,
  //       tags: tags || [], // If tags is not provided, set it to an empty array
  //       author: userId,
  //       authorName: userExists.name, // Add authorName
  //     });

  //     // Save the blog post to the database
  //     const savedBlog = await newBlog.save();

  //     // Send success response
  //     res
  //       .status(HTTP_CODES.CREATED)
  //       .json(
  //         Response.successResponse(
  //           savedBlog,
  //           'Blog post created successfully',
  //           HTTP_CODES.CREATED
  //         )
  //       );
  //   } catch (error) {
  //     const errorResponse = Response.errorResponse(error);
  //     res.status(errorResponse.code).json(errorResponse);
  //   }
  // }
  async add(req, res) {
    if (req.user) {
      console.log(req.user);
    }
    try {
      const { title, content, tags, category } = req.body;
      const { _id, name } = req.user;

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

      // Create a new blog post
      const newBlog = new Blog({
        title,
        content,
        tags: tags || [], // If tags is not provided, set it to an empty array
        author: userId,
        authorName: userName, // Add authorName
        category: categoryDoc._id, // Add category ID
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
      const { title, content, tags, newTags, category } = req.body;
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
    // console.log('test detail', req.params.slug);
    const slug = req.params.slug; // Slug parametresini al

    try {
      // Blog belgesini slug değerine göre bul
      const blog = await Blog.findOne({ slug });

      if (!blog) {
        throw new Error('Blog not found');
      }

      // Blog belgesindeki category alanından gelen _id ile Category belgesini bul
      const category = await Category.findById(blog.category);

      if (!category) {
        throw new Error('Category not found');
      }

      // Kategorinin adını al
      const categoryName = category.name;
      const blogRes = {
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        tags: blog.tags,
        author: blog.author,
        authorName: blog.authorName,

        categoryName: categoryName,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        slug: blog.slug,
      };
      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            blogRes,
            'Blog post details retrieved successfully',
            HTTP_CODES.OK
          )
        );
      console.log('Category Name:', categoryName);
    } catch (error) {
      console.error('Error:', error.message);
    }
    // const blogRes = {
    //   _id: blog._id,
    //   title: blog.title,
    //   content: blog.content,
    //   tags: blog.tags,
    //   author: blog.author,
    //   authorName: blog.authorName,
    //   category: blog.category,
    //   categoryName: blog.categoryName,
    //   createdAt: blog.createdAt,
    //   updatedAt: blog.updatedAt,
    //   slug: blog.slug,
    // };
    // console.log('blog detail ', blog);

    // if (!blog) {
    //   throw new CustomError(
    //     HTTP_CODES.NOT_FOUND,
    //     'Blog not found',
    //     'The blog post with the provided slug does not exist.'
    //   );
    // }

    // // Send success response with blog details
    // res
    //   .status(HTTP_CODES.OK)
    //   .json(
    //     Response.successResponse(
    //       blog,
    //       'Blog post details retrieved successfully',
    //       HTTP_CODES.OK
    //     )
    //   );
  }
}

export default new BlogController();
