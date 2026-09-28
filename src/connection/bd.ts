import mysql from 'mysql2';
import { BdInterface } from '../types/bd-type';
import dotenv from 'dotenv';
import path from 'path';


const env = process.env.NODE_ENV || 'development';
const envFileName = env === 'development' ? '.env.development' : '.env';


dotenv.config({ path: path.resolve(process.cwd(), envFileName) });

if (
  !process.env.DBHOST ||
  !process.env.DBUSER ||
  !process.env.DBPASSWORD ||
  !process.env.DBDATABASE ||
  !process.env.DBPORT
) {
  throw new Error(`Variables de entorno vacias. Entorno actual: ${envFileName}`);
}

const connection: BdInterface = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBDATABASE,
  port: process.env.DBPORT ? parseInt(process.env.DBPORT, 10) : 3306,
  connectionLimit: 10,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0,
  debug: false,
  timezone: 'Z',
  multipleStatements: true,
  charset: 'utf8mb4_general_ci',
  maxIdle: 1,
};

// Crear el pool de conexiones
const pool = mysql.createPool(connection);

export { pool };