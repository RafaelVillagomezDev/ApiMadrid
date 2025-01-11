import {getRestaurant} from "../../controllers/restaurant-controller";
const express = require('express');
const router = express.Router();


router.get('/',getRestaurant);

export default router