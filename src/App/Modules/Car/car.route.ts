import express from 'express';
import { validateRequest } from '../../Middlewares/validateRequest';
import { carValidation } from './car.validation';
import { carControllers } from './car.controller';
import { Auth } from '../../Middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';

const router = express.Router();

router.post(
  '/',
  Auth(USER_ROLE.admin),
  validateRequest(carValidation.createCarValidation),
  carControllers.createACar,
);

router.get('/', carControllers.getAllCars);

router.get('/:id', carControllers.getACarById);

router.put(
  '/:id',
  Auth(USER_ROLE.admin),
  validateRequest(carValidation.updateCarValidation),
  carControllers.updateACar,
);

router.delete('/:id', Auth(USER_ROLE.admin), carControllers.deleteACar);

export const CarRoutes = router;
