import express from 'express';
import { Auth } from '../../Middlewares/auth';
import { USER_ROLE } from '../Auth/auth.constant';
import { bookingControllers } from './booking.controller';
import { validateRequest } from '../../Middlewares/validateRequest';
import { bookingValidation } from './booking.validation';


const router = express.Router();

router.get("/",Auth(USER_ROLE.admin),bookingControllers.getAllBookings)
router.post("/",Auth(USER_ROLE.user),validateRequest(bookingValidation.createBookingValidation),bookingControllers.bookACar)
router.get("/my-bookings",Auth(USER_ROLE.user),bookingControllers.getBookingsByUserId)
router.get("/dashboard-stats",Auth(USER_ROLE.admin),bookingControllers.dashboardStats)
router.patch(
  '/:id',
  Auth(USER_ROLE.user),
  validateRequest(bookingValidation.modifyBookingValidation),
  bookingControllers.modifyBooking,
);
router.put(
  '/status',
  Auth(USER_ROLE.admin),
  validateRequest(bookingValidation.modifyBookingValidation),
  bookingControllers.updateStatus,
);
router.delete("/:id",Auth(USER_ROLE.user),bookingControllers.deleteBookingById)


export const BookingRoutes = router;
