import express , {Application} from 'express';
import restaurantRoutes from './routes/v1/restaurant-routes';
import imageRoutes from './routes/v1/image-routes'
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-middleware';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app: Application = express()
const customFormat =
  ':method :url :status :res[content-length] - :response-time ms :remote-addr';
app.use(morgan(customFormat));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

app.use('/api/v1/restaurant', restaurantRoutes);
app.use('/api/v1/image', imageRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.use(errorHandler);
