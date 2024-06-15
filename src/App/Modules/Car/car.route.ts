import express from 'express';
import { validateRequest } from '../../Middlewares/validateRequest';
import { carValidation } from './car.validation';
import { carControllers } from './car.controller';


const router = express.Router();

router.post("/",validateRequest(carValidation.createCarValidation),
carControllers.createACar);

router.get("/",
carControllers.getAllCars);

router.get("/:id",
carControllers.getACarById);

router.put("/:id",validateRequest(carValidation.updateCarValidation),
carControllers.updateACar);

router.delete("/:id",
carControllers.deleteACar);



export const CarRoutes = router;
