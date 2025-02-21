// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/application.error';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user.interface';
import { hashPassword } from '../utils/auth/hash';
import { generateAccessToken, generateRefreshToken } from '../utils/auth/token';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  register = async (userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) => {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already registered. Please Log in', 409); // ❌ Conflict
    }
    const hashedPassword = await hashPassword(userData);
    const newUser: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      refreshTokens: userData.refreshTokens ?? [] // evita null
    };
    return this.userRepository.register(newUser);
  }

  login = async (email: string, password: string) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user){
      throw new AppError('User not Found. Please Register', httpStatus.NOTFOUND);
    }
    // Check hashedPassword in DB with UserPassword
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid Credentials', httpStatus.UNAUTHORIZED);
    }
    // Generate JWT Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // save RefreshToken en User
    user.refreshTokens.push(refreshToken);
    // actualizar en la bbdd
    await this.userRepository.update(user);
    // retornamos accessToken para login
    // y refreshToken para poderseguirlogeados pasada 1h (caduca token)
    return { accessToken, refreshToken};
  }

}
