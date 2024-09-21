import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';


const bookingSchema = new Schema<TBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    carId: { type: Schema.Types.ObjectId, ref: 'Cars', required: true },
    origin: { type: String, default: '' }, 
    destination: { type: String, default: '' },
    drivingLicense: { type: String, required: true },
    nidOrPassport: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalCost: { type: Number, default: 0, required: true },
    additionalFeatures: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ], 
    paymentType: {
      type: String,
      enum: ['cash', 'stripe'], 
      default: 'cash', 
    },
    paymentId: { type: String, default: "" },
   
  },
  {
    timestamps: true, 
  },
);

// Create and export the Booking model
export const Booking = model<TBooking>('Booking', bookingSchema);
