export interface BlacklistEntry {
  id?: number;
  jti: string;
  expires_at: Date | string;
  reason?: string;
  blocked_at?: Date;
}
