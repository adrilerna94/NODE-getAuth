// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/application.error';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user.interface';
import { hashPassword } from '../utils/auth/hash';
import { formatJwtTimestamp, generateAccessToken, generateRefreshToken, parseJwt } from '../utils/auth/token';

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

  login = async (userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) => {
    const user = await this.userRepository.findByEmail(userData.email);
    if (!user){
        throw new AppError('User not Found. Please Register', httpStatus.NOTFOUND);
    }

    // Check hashedPassword in DB with UserPassword
    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid Credentials', httpStatus.UNAUTHORIZED);
    }

    // Generate JWT Tokens
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    // Decodificar los tokens con seguridad
    const decodedAccessToken = parseJwt(accessToken);
    const decodedRefreshToken = parseJwt(refreshToken);

    // Agregar refreshToken y actualizar usuarios
    user.refreshTokens.push(refreshToken);
    await this.userRepository.update(user);

    // Formatear fechas
    const formattedAccessToken = {
      token: accessToken,
      issuedAt: formatJwtTimestamp(decodedAccessToken.iat),
      expiresAt: formatJwtTimestamp(decodedAccessToken.exp)
    };

    const formattedRefreshToken = {
      token: refreshToken,
      issuedAt: formatJwtTimestamp(decodedRefreshToken.iat),
      expiresAt: formatJwtTimestamp(decodedRefreshToken.exp)
    };
    return {
        accessToken: formattedAccessToken,
        refreshToken: formattedRefreshToken,
        user: {
            id: user._id as string,
            email: user.email,
            name: user.name
        }
    };
};

}
