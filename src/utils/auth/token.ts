import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../../types/user.interface";
import { AppError } from "../application.error";
import { httpStatus } from "../../config/httpStatusCodes";
import { UserRepository } from "../../repositories/user.repository";

const userRepository = new UserRepository();

function generateAccessToken (user: IUser) {
    const payLoad = { userEmail: user.email}; // donde almacenan los datos
    const secretKey = process.env.JWT_SECRET_KEY!; // clave privada para firmar el Token
    // ! non-null ➡️ variable nunca sera undefined | null
    const options = {expiresIn: 3600} // opciones: caducidad : 1h
    return jwt.sign(payLoad, secretKey as string, options);
}

function generateRefreshToken (user: IUser) {
    const payLoad = {userEmail: user.email};
    const secretRefreshKey = process.env.JWT_REFRESH_SECRET!;
    const options = { expiresIn: 604_800}; // expira en 7 días
    return jwt.sign(payLoad, secretRefreshKey as string, options);
}

const verifyRefreshToken = async (refreshToken: string) => {
    try {
        // 1️⃣ Verificar el token y tipar correctamente `decoded`
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== "object" || !decoded.userEmail) {
            throw new AppError("Invalid refresh token", httpStatus.BAD_REQUEST);
        }

        // 2️⃣ Buscar usuario en la base de datos
        const user = await userRepository.findByEmail(decoded.userEmail);
        if (!user) {
            throw new AppError("User not found", httpStatus.NOTFOUND);
        }

        // 3️⃣ Verificar que el token esté en la lista del usuario
        if (!user.refreshTokens.includes(refreshToken)) {
          throw new AppError("Invalid refresh token", httpStatus.BAD_REQUEST);
        }

        // 4️⃣ Generar nuevos tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // 5️⃣ Actualizar refreshTokens en la base de datos
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken); // Eliminar el viejo
        user.refreshTokens.push(newRefreshToken); // Agregar el nuevo

        await userRepository.update(user);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    } catch (error) {
        throw new AppError("Invalid refresh token", httpStatus.BAD_REQUEST);
    }
  };


export { generateRefreshToken, generateAccessToken, verifyRefreshToken};
