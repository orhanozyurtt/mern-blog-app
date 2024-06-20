import { Router } from 'express';
import userController from '../controller/userController.js';
import { admin, protect, loginControl } from '../middleware/authMiddleware.js';
import { controller, updateController } from '../lib/InputController.js';
const route = Router();

// register user
// /api/user/register
route.post('/register', loginControl, controller, userController.register);
// mail confirm
// /api/user/confirm
route.post('/confirm', protect, userController.confirmEmail);
// user login
// /api/user/login
route.post('/login', loginControl, userController.login);

// user logout
// /api/user/logout
route.post('/logout', userController.logout);
route.get('/profile', protect, userController.profile);
route.post('/update', protect, updateController, userController.update);

export default route;
