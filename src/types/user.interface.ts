// Defines the structure of a User object using a TypeScript interface.
// Ensures type safety throughout the application when working with users.

import { Document, Types } from "mongoose";

// Interfaz de usuario sin métodos de Mongoose
export interface IUser {
  _id?: Types.ObjectId | string | unknown; // 🔹 Aseguramos compatibilidad
  name?: string;
  email: string;
  password: string;
  refreshTokens: string [];
  createdAt?: Date;
  updatedAt?: Date;
}
// Modelo Mongoose sin duplicar `_id`
export interface IUserModel extends Omit<Document, '_id'>, IUser {}
