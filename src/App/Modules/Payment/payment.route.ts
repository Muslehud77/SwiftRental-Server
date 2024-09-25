import { Router } from 'express';
import {
  paymentController
} from './payment.controller';

const router = Router();

// Stripe Payment Route
router.post('/create-payment-intent-stripe', paymentController.createStripePaymentIntentHandler);

// Aamarpay Payment Route
router.post(
  '/create-payment-intent-aamarpay',
  paymentController.createAamarpayPaymentIntentHandler,
);

// Aamarpay Payment Verification Route
router.post('/payment', paymentController.verifyAamarpayPaymentHandler);

export const PaymentRoutes = router;
