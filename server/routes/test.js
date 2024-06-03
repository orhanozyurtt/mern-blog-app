import { Router } from 'express';
import { deneme } from '../controller/testController.js';
const route = Router();

route.get('/', deneme);

export default route;
