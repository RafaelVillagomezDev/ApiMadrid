interface RefreshTokenInterface {
  id?: number;
  user_id: string; // Basado en el VARCHAR(255) de tu tabla USERS
  token: string;
  expires_at: Date;
}

export { RefreshTokenInterface};