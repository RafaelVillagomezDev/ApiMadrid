import express from 'express';
import restaurantRoutes from './routes/v1/restaurant-routes';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import {errorHandler} from './middleware/error-middleware';

dotenv.config({ path: path.resolve(__dirname, '../.env')})

const app = express();
const customFormat =':method :url :status :res[content-length] - :response-time ms :remote-addr';
// Usar morgan con el formato personalizado
app.use(morgan(customFormat));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

app.use('/api/v1/restaurant', restaurantRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.use(errorHandler)