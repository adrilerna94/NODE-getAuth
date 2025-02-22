import { TokenData } from "./tokenData.interface";

// Tipo para la estructura de la respuesta completa
export interface LoginResponse {
  accessToken: TokenData;
  refreshToken: TokenData;
  user: {
      id: string;
      email: string;
      name: string;
  };
};
