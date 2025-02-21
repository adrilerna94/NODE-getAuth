// Defines the routes for user-related operations.
// Maps HTTP methods and endpoints to the corresponding controller methods.

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/joiValidation.middleware';
import { userIdSchema } from '../validators/user.validators';
// import { userIdSchema, userCreateSchema, userUpdateSchema } from '../validators/user.validators';

const userController = new UserController();
export const userRouter = Router();

userRouter.get('/:id', validate(userIdSchema, 'params'), userController.getById);
// userRouter.post('/', validate(userCreateSchema, 'body'), userController.create);
// userRouter.get('/', userController.getAll);
// userRouter.put('/:id', validate(userUpdateSchema, 'body'), userController.update);
// userRouter.delete('/:id', validate(userIdSchema, 'params'), userController.delete);
