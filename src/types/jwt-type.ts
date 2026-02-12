/**
 * Interface que representa el objeto de datos esenciales del usuario
 * necesario para FIRMAR un nuevo JWT.
 */
export interface UserData {
  id_user: string;
  email?: string;
  rol: 'cliente' | 'admin' | 'no_cliente';
  jti?: string;
}

/**
 * Interface que representa el PAYLOAD completo del JWT (Claims).
 * Incluye los datos del usuario (UserData) más los claims estándar de JWT.
 */
export interface JWTPayload extends UserData {
  // Claims estándar añadidos por jsonwebtoken
  iat: number; // Issued At (Marca de tiempo de emisión)
  exp: number; // Expiration Time (Marca de tiempo de expiración)

}