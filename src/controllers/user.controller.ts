// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { NextFunction, type Request, type Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getById(req.params.id);
      const response = {
        message: 'User fetched successfully',
        data: user,
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  };

  // getAll = (req: Request, res: Response) => {
  //   const users = this.userService.getAll();
  //   const response = {
  //     message: 'Users fetched successfully',
  //     data: users,
  //   };
  //   res.send(response);
  // };

  // create = (req: Request, res: Response) => {
  //   const user = {
  //     name: req.body.name,
  //     email: req.body.email,
  //   };
  //   this.userService.create(user);
  //   const response = {
  //     message: 'User created successfully',
  //     status: httpStatus.created,
  //     data: user,
  //   };
  //   res.send(response);
  // };

  // update = (req: Request, res: Response) => {
  //   const user = {
  //     id: req.params.id,
  //     name: req.body.name,
  //     email: req.body.email,
  //   };
  //   const userUpdated = this.userService.update(user);
  //   const response = {
  //     message: 'User updated successfully',
  //     data: userUpdated,
  //   };
  //   res.send(response);
  // };

  // delete = (req: Request, res: Response) => {
  //   const user = this.userService.delete(req.params.id);
  //   const response = {
  //     message: 'User deleted successfully',
  //     data: user,
  //   };
  //   res.send(response);
  // };
}
