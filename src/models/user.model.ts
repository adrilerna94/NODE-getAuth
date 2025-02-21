// Mongoose schema and model definition for the User entity.
// Defines the structure of user documents in the database.

import mongoose from 'mongoose';
import { IUser } from '../types/user.interface';

export interface IUserModel extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshTokens: {type: [String], default: [] },
  },
  {timestamps: true},
);

export const UserModel = mongoose.model<IUserModel>('User', userSchema, 'users_auth');
