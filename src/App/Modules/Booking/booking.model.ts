import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking>({
  date: { type: String ,required:true},
  startTime: { type: String , required:true},
  endTime: { type: String ,default:null},
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  totalCost: { type: Number, default: 0 },
},{
    timestamps:true
});


export const Booking = model<TBooking>('Booking',bookingSchema)