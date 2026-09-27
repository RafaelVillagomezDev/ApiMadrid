import express, { Application } from 'express';
import restaurantRoutes from './routes/v1/restaurant-routes';
import imageRoutes from './routes/v1/image-routes';
import locationRoutes from './routes/v1/location-routes';
import anonymusRoutes from './routes/v1/user-anonymus-routes';
import menuRoutes from './routes/v1/menu-routes';
import dishRoutes from './routes/v1/dish-routes';
import userRoutes from './routes/v1/user-routes';
import csrfRoutes from './routes/v1/csrf-routes';
import authRoutes from './routes/v1/auth-routes';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet'; // <-- AÑADIDO
import { requestLogger } from './middleware/logger-middleware';
import { errorLogger } from './middleware/error-middleware';
import { errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limit-middleware';
import { csrfProtection, initCookieParser } from './auth/auth-csrf';

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production'; // <-- VARIABLE DE CONTROL

const envFileName = env === 'development' ? '.env.development' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFileName) });

console.log(`[Config] Iniciando en modo: ${env}`);

const app: Application = express();

// Proxy de Dokploy
app.set('trust proxy', 1); 

// --- SEGURIDAD: HELMET ---
// Oculta "X-Powered-By: Express" y añade cabeceras de seguridad estrictas
app.use(helmet());

const whitelist = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL 
].filter(Boolean) as string[];

// --- SEGURIDAD: CORS ESTRICTO ---
app.use(
  cors({
    origin: (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean | undefined) => void) => {
      // Si el origen está en la lista blanca, pasa.
      if (origin && whitelist.includes(origin)) {
        callback(null, true);
      } 
      // Si NO hay origen (Postman, curl), solo lo permitimos en desarrollo.
      else if (!origin && !isProduction) {
        callback(null, true);
      } 
      // En producción, bloqueamos todo lo que no venga de tu frontend.
      else {
        console.error(`[CORS Bloqueado]: Origen no permitido -> ${origin || 'Sin origen'}`);
        callback(new Error('No permitido por CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-csrf-token',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['x-csrf-token', 'X-New-CSRF-Token']
  }),
);

app.options('*', cors());
app.use(express.json());



app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.use(requestLogger);
app.use(initCookieParser);
app.use('/api/', csrfProtection);
app.use('/api/', apiLimiter);

// Routes
app.use('/api/v1/restaurant', restaurantRoutes);
app.use('/api/v1/image', imageRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/anonymous', anonymusRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/dish', dishRoutes);
app.use('/api/v1/csrf', csrfRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[Server] Corriendo en el puerto ${port}`);
});