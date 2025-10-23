import express, { Application } from 'express';
import restaurantRoutes from './routes/v1/restaurant-routes';
import imageRoutes from './routes/v1/image-routes';
import locationRoutes from './routes/v1/location-routes';
import anonymusRoutes from './routes/v1/user-anonymus-routes';
import menuRoutes from './routes/v1/menu-routes';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger-middleware';
import { errorLogger } from './middleware/error-middleware';
import { errorHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limit-middleware';
import { csrfProtection, initCookieParser } from './auth/auth-csrf';



dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app: Application = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;


//Logger Winstom
app.use(requestLogger);
//Cookie Parser
app.use(initCookieParser)
//AUTH CSRF
//app.use('/api/', csrfProtection);
//Rate limit Middleware
app.use('/api/', apiLimiter);

//Routes

app.use('/api/v1/restaurant', restaurantRoutes);
app.use('/api/v1/image', imageRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/anonymous', anonymusRoutes);
//Logger de errores para capturarlos s
app.use(errorLogger)

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
//Envio errores a Cliente
app.use(errorHandler)



