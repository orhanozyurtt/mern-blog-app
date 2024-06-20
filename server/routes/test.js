import { Router } from 'express';
import { deneme, post } from '../controller/testController.js';
const route = Router();

route.get('/', deneme);
route.post('/post', post);

export default route;
