import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound } from './App/ErrorHandler/notFound';
import { globalErrorHandler } from './App/ErrorHandler/globalErrorHandler';
import router from './App/routes';
import configs from './App/configs';
import axios from 'axios';

import stripe from 'stripe';
const app = express();

const st = new stripe(configs.STRIPE_SECRET);

// parsers
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [configs.CLIENT_URL],
    credentials: true,
  }),
);

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//stripe-intent
app.post('/api/create-payment-intent-stripe', async (req, res) => {
  try {
    const { price } = req.body;
    const amount = price * 100;

    const paymentIntent = await st.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
  }
});
//amarpay-intent
app.post('/api/create-payment-intent-amarpay', async (req, res) => {
  try {
    const { price, _id, user } = req.body;

    const data = {
      store_id: configs.AMARPAY_STORE_ID,
      tran_id: _id,
      success_url: `${configs.CLIENT_URL}/dashboard/payments?${_id}`,
      fail_url: 'http://www.merchantdomain.com/failedpage.html',
      cancel_url: 'http://www.merchantdomain.com/cancellpage.html',
      amount: price,
      currency: 'USD',
      signature_key: configs.AMARPAY_SIGNATURE_KEY,
      desc: 'Pay to Swift Rental',
      cus_name: 'user.name',
      cus_email: 'payer@merchantcusomter.com',
      cus_add1: 'N/A',
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'Bangladesh',
      cus_phone: 'user.phone',
      type: 'json',
    };

    const result = await axios.post(
      `${configs.AMARPAY_URL}/jsonpost.php`,
      data,
    );

    console.log(result);

    res.send(result.data);
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/amarpay-verify', async (req, res) => {
  try {
    const { _id } = req.body;

    const url = `${configs.AMARPAY_PAYMENT_VERIFY_URL}?request_id=${_id}&store_id=${configs.AMARPAY_STORE_ID}&signature_key=${configs.AMARPAY_SIGNATURE_KEY}&type=json`;

    const result = await axios.get(url);

    res.send({ paymentStatus: result?.data?.pay_status || 'unsuccessful' });
  } catch (err) {
    console.log(err);
  }
});

//global err handler
app.use(globalErrorHandler);

//Not found route
app.use(notFound);

export default app;
