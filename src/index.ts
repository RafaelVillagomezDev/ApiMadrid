import express, { Request, Response } from 'express';
import restaurantRoutes from './routes/v1/restaurant-routes';
const morgan = require('morgan');
const cors =require("cors")
const app = express();
const path = require('path');
const customFormat = ':method :url :status :res[content-length] - :response-time ms :remote-addr';
// Usar morgan con el formato personalizado
app.use(morgan(customFormat));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



const port = 3000;

app.use('/api/v1/restaurant',restaurantRoutes);


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
