import express, { Request, Response } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { notFound } from './App/ErrorHandler/notFound';
import { globalErrorHandler } from './App/ErrorHandler/globalErrorHandler';
import router from './App/routes';
import configs from './App/configs';


import stripe from 'stripe';
const app = express();

const st = new stripe(configs.STRIPE_SECRET);

// parsers
app.use(cookieParser());
app.use(express.json())
app.use(
  cors({
    origin: [configs.CLIENT_URL],
    credentials: true,
  }),
);

// application routes
app.use('/api',router)

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!');
});

  app.post('/api/create-payment-intent', async (req, res) => {
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


//global err handler
app.use(globalErrorHandler)

//Not found route
app.use(notFound)

export default app