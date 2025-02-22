import { DecodedToken } from "./decodedToken.interface";

// Interfaz para la estructura de los tokens
export interface TokenData {
  token: string;
  details: DecodedToken;
};
