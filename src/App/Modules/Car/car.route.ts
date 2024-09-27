import express from 'express';
import { validateRequest } from '../../Middlewares/validateRequest';
import { carValidation } from './car.validation';
import { carControllers } from './car.controller';
import { Auth } from '../../Middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { bookingControllers } from '../Booking/booking.controller';
import { bookingValidation } from '../Booking/booking.validation';

const router = express.Router();

//*Route: /api/cars/return(PUT)

router.patch('/return', Auth(USER_ROLE.admin),validateRequest(bookingValidation.returnCarValidation), bookingControllers.returnTheCar);

router.post(
  '/',
  Auth(USER_ROLE.admin),
  validateRequest(carValidation.createCarValidation),
  carControllers.createACar,
);

router.get('/', carControllers.getAllCars);

router.get('/:id', carControllers.getACarById);

//*Route: /api/cars/:id(PUT)
router.put(
  '/:id',
  Auth(USER_ROLE.admin),
  validateRequest(carValidation.updateCarValidation),
  carControllers.updateACar,
);

router.delete('/:id', Auth(USER_ROLE.admin), carControllers.deleteACar);


export const CarRoutes = router;
