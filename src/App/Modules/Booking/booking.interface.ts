import { Types } from 'mongoose';

export interface TBooking {
  user: Types.ObjectId;
  carId: Types.ObjectId;
  origin?: string;
  destination?: string;
  drivingLicense: string;
  nidOrPassport: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  additionalFeatures?: Array<{
    name: string;
    price: number;
  }>;
  paymentType?: 'cash' | 'stripe';
  paymentId?: string;
  completedPayment:boolean;
  status: "pending" | "approved" | "rejected" | "completed";
}


export interface TBookingResponse extends TBooking {
  _id: Types.ObjectId;
}

export type TBookingData = {
  carId: Types.ObjectId;
  date: string;
  startTime: string;
};

export type TReturnData = {
  bookingId: Types.ObjectId;
  endTime: string;
};
