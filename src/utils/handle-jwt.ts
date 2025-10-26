import jsonwebtoken from 'jsonwebtoken';
import { JWTPayload, UserData } from 'jwt-type';

const SECRET_TOKEN = process.env.JWT_SECRET;


export const tokenSign = async ({ id_user, email, rol }:UserData) => {
  if (!SECRET_TOKEN) {
      throw new Error("JWT_SECRET no está definido en las variables de entorno.");
  }

  const sign = jsonwebtoken.sign(
    {
      id_user: id_user,
      email: email,
      rol: rol,
    },
    SECRET_TOKEN,
    {
      expiresIn: "1m", // Duración del Token de Acceso
    }
  );
  return sign;
};


export const verifyToken = async (token:string):Promise<JWTPayload | null> => {
  if (!SECRET_TOKEN) {
      throw new Error("JWT_SECRET no está definido en las variables de entorno.");
  }

  try {
    const decodedToken=jsonwebtoken.verify(token, SECRET_TOKEN);
    return decodedToken as JWTPayload;
  } catch (e) {
    
    return null; 
  }
};