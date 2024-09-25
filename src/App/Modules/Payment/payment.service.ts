import axios from 'axios';
import stripe from 'stripe';
import configs from '../../configs';
import { TUser } from '../User/user.interface';
import { Booking } from '../Booking/booking.model';
import { TBooking } from '../Booking/booking.interface';

const st = new stripe(configs.STRIPE_SECRET);

// Create Stripe Payment Intent
const createStripePaymentIntent = async (price: number): Promise<string> => {
  const amount = price * 100; // Stripe expects the amount in cents
  const paymentIntent = await st.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  return paymentIntent?.client_secret as string;
};

// Create Aamarpay Payment Intent
const createAamarpayPaymentIntent = async (
  price: number,
  _id: string,
  user: Partial<TUser>,
) => {
  const data = {
    store_id: configs.AMARPAY_STORE_ID,
    tran_id: _id,
    success_url: `${configs.SERVER_URL}/api/pay/payment?paymentId=${_id}`,
    fail_url: 'http://www.merchantdomain.com/failedpage.html',
    cancel_url: 'http://www.merchantdomain.com/cancellpage.html',
    amount: price * 115,
    currency: 'BDT',
    signature_key: configs.AMARPAY_SIGNATURE_KEY,
    desc: 'Pay to Swift Rental',
    cus_name: user.name,
    cus_email: user.email || 'user.email@gmail.com',
    cus_add1: 'N/A',
    cus_add2: 'N/A',
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 'N/A',
    cus_country: 'Bangladesh',
    cus_phone: user.phone || '+8801631389725',
    type: 'json',
  };

  const result = await axios.post(`${configs.AMARPAY_URL}/jsonpost.php`, data);
  return result;
};

// Verify Aamarpay Payment
const verifyAamarpayPayment = async (paymentId: string): Promise<string> => {
  const url = `${configs.AMARPAY_PAYMENT_VERIFY_URL}?request_id=${paymentId}&store_id=${configs.AMARPAY_STORE_ID}&signature_key=${configs.AMARPAY_SIGNATURE_KEY}&type=json`;
  const result = await axios.get(url);

  if (result?.data?.pay_status === 'Successful') {
      
        const booking = await Booking.findById({_id:[paymentId]})

        const data = {
          paymentType: 'Aamar Pay',
          paymentId,
          completedPayment: true,
        } as Partial<TBooking>;

          if (new Date(booking?.endDate as Date) < new Date()) {
            data.status = 'completed';
          }

      const updatePaymentOfBooking = await Booking.updateOne(
        { _id: paymentId },
        data,
      );

      if(updatePaymentOfBooking){
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SwiftRental Payment Success</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
      color: #333;
    }

    .container {
      text-align: center;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #ddd;
    }

    h1 {
      font-size: 32px;
      margin-bottom: 20px;
      color: #333;
    }

    p {
      font-size: 16px;
      margin-bottom: 30px;
      color: #666;
    }

    .button-container {
      display: flex;
      justify-content: space-around;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      background-color: #3498db;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color: #2980b9;
    }

    .btn-home {
      background-color: #95a5a6;
    }

    .btn-home:hover {
      background-color: #7f8c8d;
    }

    .logo {
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="logo">SwiftRental</div>
    <h1>Payment Success!</h1>
    <p>Thank you for your payment. Your transaction has been completed successfully.</p>
    
    <div class="button-container">
      <a href="${configs.CLIENT_URL}" class="btn btn-home">Go to Homepage</a>
      <a href="${configs.CLIENT_URL}/dashboard/payments" class="btn">Go to Payments</a>
    </div>
  </div>

</body>
</html>
`;
      }else{
        return `<h1>Something Went Wrong</h1>`;
      }

    

  }else{

      return `<h1>Something Went Wrong</h1>`;
  }

};

export const paymentServices = {
  verifyAamarpayPayment,
  createAamarpayPaymentIntent,
  createStripePaymentIntent,
};
