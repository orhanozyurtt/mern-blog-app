import { Router } from 'express';
import userController from '../controller/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { controller } from '../lib/InputController.js';
const route = Router();

// register user
// /api/user/register
route.post('/register', controller, userController.register);
// mail confirm
// /api/user/confirm
route.post('/confirm', protect, userController.confirmEmail);
// user login
// /api/user/login
route.post('/login', userController.login);

// user logout
// /api/user/logout
route.post('/logout', userController.logout);
route.get('/test', protect, admin, userController.test);
export default route;
