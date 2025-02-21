// Manages HTTP requests related to users.
// Contains methods for handling routes like GET, POST, PUT, DELETE for users.
// Delegates business logic to the user service.

import { NextFunction, type Request, type Response } from 'express';
import { AuthService } from '../services/auth.service';
import { verifyRefreshToken } from '../utils/auth/token';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = await this.authService.login(req.body.email, req.body.password);
      const response = {
        message: 'User successfully logged in',
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const registeredUser = await this.authService.register(req.body);
      const response = {
        message: `${registeredUser?.name} successfully registered`,
        user: registeredUser
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const newToken = await verifyRefreshToken(refreshToken);
      const response = {
        message: 'New AccessToken Successfully generated',
        newAccessToken: newToken
      }
      res.send(response);
    } catch (error) {
      next(error)
    }
  }

}
