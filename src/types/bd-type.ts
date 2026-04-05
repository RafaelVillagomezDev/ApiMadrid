interface BdInterface {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  connectionLimit: number;
  connectTimeout: number;
  waitForConnections: boolean;
  queueLimit: number;
  debug: boolean;
  timezone: string;
  multipleStatements: boolean;
  charset: string;
  maxIdle: number;
}

export { BdInterface };
