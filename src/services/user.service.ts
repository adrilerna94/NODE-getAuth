// Implements business logic for user operations.
// Processes requests from the controller and interacts with the repository as needed.

import { httpStatus } from '../config/httpStatusCodes';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/application.error';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user.interface';
import jwt, { JwtPayload } from "jsonwebtoken";

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
    // generamos Salt random para fortalecer hash
    const salt = await bcrypt.genSalt(10);
    // 🔑 bcrypt ➡️ cifra contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(userData.password, salt);
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
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // save RefreshToken en User
    user.refreshTokens.push(refreshToken);
    // actualizar en la bbdd
    await this.userRepository.update(user);
    // retornamos accessToken para login
    // y refreshToken para poderseguirlogeados pasada 1h (caduca token)
    return { accessToken, refreshToken};
  }

  generateAccessToken(user:IUser) {
    const payLoad = { userEmail: user.email}; // donde almacenan los datos
    const secretKey = process.env.JWT_SECRET_KEY!; // clave privada para firmar el Token
    // ! non-null ➡️ variable nunca sera undefined | null
    const options = {expiresIn: 3600} // opciones: caducidad : 1h
    return jwt.sign(payLoad, secretKey as string, options);
  }

  generateRefreshToken(user: IUser) {
    const payLoad = {userEmail: user.email};
    const secretRefreshKey = process.env.JWT_REFRESH_SECRET!;
    const options = { expiresIn: 604_800}; // expira en 7 días
    return jwt.sign(payLoad, secretRefreshKey as string, options);
  }

  verifyRefreshToken = async (refreshToken: string) => {
    try {
        // 1️⃣ Verificar el token y tipar correctamente `decoded`
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== "object" || !decoded.userEmail) {
            throw new AppError("Invalid refresh token", httpStatus.BAD_REQUEST);
        }

        // 2️⃣ Buscar usuario en la base de datos
        const user = await this.userRepository.findByEmail(decoded.userEmail);
        if (!user) {
            throw new AppError("User not found", httpStatus.NOTFOUND);
        }

        // 3️⃣ Verificar que el token esté en la lista del usuario
        if (!user.refreshTokens.includes(refreshToken)) {
          throw new AppError("Invalid refresh token", httpStatus.BAD_REQUEST);
        }

        // 4️⃣ Generar nuevos tokens
        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user);

        // 5️⃣ Actualizar refreshTokens en la base de datos
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken); // Eliminar el viejo
        user.refreshTokens.push(newRefreshToken); // Agregar el nuevo

        await this.userRepository.update(user);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    } catch (error) {
        throw new AppError("Invalid refresh token", httpStatus.BAD_REQUEST);
    }
  };

}
