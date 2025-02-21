// Defines the routes for user-related operations.
// Maps HTTP methods and endpoints to the corresponding controller methods.

import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/joiValidation.middleware';
import { userLoginSchema, userRegisterSchema } from '../validators/auth.validators';

const authController = new AuthController();
export const authRouter = Router();

authRouter.post('/login', validate(userLoginSchema, 'body'), authController.login);
authRouter.post('/register', validate(userRegisterSchema, 'body'), authController.register);
