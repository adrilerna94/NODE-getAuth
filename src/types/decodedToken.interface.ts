// Interfaz para el contenido del token decodificado
export interface DecodedToken {
  userEmail: string;
  iat: number;
  exp: number;
};
