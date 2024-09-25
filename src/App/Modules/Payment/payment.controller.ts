import { Request, Response } from 'express';
import { paymentServices } from './payment.service';

// Stripe Payment Intent Handler
const createStripePaymentIntentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { price } = req.body;
    const clientSecret = await paymentServices.createStripePaymentIntent(price);
    res.send({ clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

// Aamarpay Payment Intent Handler
const createAamarpayPaymentIntentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { price, _id, user } = req.body;
    const result = await paymentServices.createAamarpayPaymentIntent(
      price,
      _id,
      user,
    );
    res.send(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

// Aamarpay Payment Verification Handler
const verifyAamarpayPaymentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { paymentId } = req.query;
    const paymentStatus = await paymentServices.verifyAamarpayPayment(
      paymentId as string,
    );
    res.send(paymentStatus);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const paymentController = {
  createStripePaymentIntentHandler,
  createAamarpayPaymentIntentHandler,
  verifyAamarpayPaymentHandler,
};
