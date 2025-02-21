import bcrypt from 'bcrypt';
import { IUser } from '../../types/user.interface';

export const hashPassword = async (userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) => {
  // generamos Salt random para fortalecer hash
  const salt = await bcrypt.genSalt(10);
  // 🔑 bcrypt ➡️ cifra contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(userData.password,salt);
  return hashedPassword;
}
