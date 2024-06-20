import { Router } from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';

import blogController from '../controller/blogController.js';
import validateAddBlog, { validateUpdate } from '../lib/InputBlogController.js';
const route = Router();

// api/blog/list
// methot : get
route.get('/list', protect, blogController.list);

// api/blog/add
// methot : post
route.post('/add', validateAddBlog, protect, blogController.add);

// api/blog/update
// methot : post
route.post('/update/:slug', validateUpdate, protect, blogController.update);

// api/blog/delete
// methot : post
//! kullanıcı dan gelen id verisini kontrol et
route.post('/delete/:slug', protect, blogController.delete);

// api/blog/detail
// methot : get
route.get('/detail/:slug', protect, blogController.detail);

export default route;
