import { Types } from "mongoose";

export interface TBooking {
  date: string;
  startTime: string;
  endTime?: string;
  user: Types.ObjectId;
  car: Types.ObjectId;
  totalCost? : number
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