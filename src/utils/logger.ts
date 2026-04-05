import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Crear el directorio logs si no existe
const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log('Log directory created successfully');
} else {
  console.log('Log directory already exists');
}

// Formato personalizado para la consola
const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  },
);

// Crear el logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // 'info' para producción y 'debug' en desarrollo
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(), // Los logs en producción se guardan en formato JSON
  ),
  transports: [
    // 🟥 Solo errores
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error', // Solo registrar errores
    }),
    // 🟨 Todos los logs (incluye 'info', 'warn', 'debug', 'error')
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      level: 'info', // 'info' captura todos los niveles: info, warn, error
    }),
  ],
});

// 🖥️ Solo en desarrollo: consola con formato bonito
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        consoleFormat, // Formato personalizado para consola
      ),
    }),
  );
}

export default logger;
