import dayjs from 'dayjs';
import { JwtPayload } from 'jsonwebtoken';
import { QueryBuilder } from '../../Builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TUserRequest } from '../User/user.interface';
import { TBooking, TBookingResponse, TReturnData } from './booking.interface';
import { Booking } from './booking.model';

import mongoose from 'mongoose';
import { TCar } from '../Car/car.interface';

const deleteBooking = async (id: string) => {
  const result = await Booking.deleteOne({ _id: id, status: 'pending' });

  if (!result.deletedCount) {
    throw new AppError(400, 'Something went wrong');
  }

  return result;
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find().populate('user').populate('carId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fieldQuery();

  const result = await bookingQuery.modelQuery;
  const meta = await bookingQuery.countTotal();
  return { result, meta };
};

const getBookingByUserIdFromDB = async (id: string) => {
  const result = await Booking.find({ user: id }).populate('carId');
  return result;
};

const modifyBookingInDB = async (
  bookingData: TBooking,
  bookingId: string,
  user: JwtPayload,
) => {
  const booking = await Booking.findOne({ _id: bookingId, user: user.id });

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  if (bookingData.endDate && bookingData.startDate) {
    const overlappingBookings = await Booking.find({
      carId: booking.carId,
      user: { $ne: user.id },
      $or: [
        // Condition 1: Existing booking starts within the new booking's range
        {
          startDate: { $lt: new Date(bookingData.endDate) },
          endDate: { $gte: new Date(bookingData.startDate) },
        },
        // Condition 2: Existing booking ends within the new booking's range
        {
          startDate: { $lte: new Date(bookingData.endDate) },
          endDate: { $gt: new Date(bookingData.startDate) },
        },
        // Condition 3: Existing booking completely overlaps with new booking
        {
          startDate: { $gte: new Date(bookingData.startDate) },
          endDate: { $lte: new Date(bookingData.endDate) },
        },
      ],
    });

    if (overlappingBookings.length) {
      throw new AppError(
        400,
        'Car is already booked within the provided date range',
      );
    }
  }

  const result = await Booking.updateOne({ _id: booking._id }, bookingData, {
    new: true,
  });

  return result;
};
const updateStatusIntoDB = async (bookingData: TBookingResponse) => {
  const booking = await Booking.findById(bookingData._id);

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }
  const result = await Booking.updateOne(
    { _id: bookingData._id },
    { status: bookingData.status },
    {
      new: true,
    },
  );

  return result;
};

const bookACarIntoDB = async (
  userData: TUserRequest,
  bookingData: Omit<TBooking, 'user'>,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if there are any overlapping bookings for the car within the specified date range
    const overlappingBookings = await Booking.find({
      carId: bookingData.carId,
      $or: [
        // Condition 1: Existing booking starts within the new booking's range
        {
          startDate: { $lt: new Date(bookingData.endDate) },
          endDate: { $gte: new Date(bookingData.startDate) },
        },
        // Condition 2: Existing booking ends within the new booking's range
        {
          startDate: { $lte: new Date(bookingData.endDate) },
          endDate: { $gt: new Date(bookingData.startDate) },
        },
        // Condition 3: Existing booking completely overlaps with new booking
        {
          startDate: { $gte: new Date(bookingData.startDate) },
          endDate: { $lte: new Date(bookingData.endDate) },
        },
      ],
    }).session(session);

    if (overlappingBookings.length > 0) {
      throw new AppError(
        400,
        'Car is already booked within the provided date range',
      );
    }

    // Create booking record
    const result = (await Booking.create(
      [{ user: userData.id, ...bookingData }],
      {
        session,
      },
    )) as unknown as TBookingResponse[];

    if (!result.length) {
      throw new AppError(400, 'Could not book the car');
    }

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message || 'Could not book the car');
  }
};

const returnTheCar = async (returnData: TReturnData) => {
  const booking = await Booking.findById(returnData._id).populate('carId');

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }
  const startDate = booking.startDate;
  const endDate = returnData.endDate;
  const pricePerHour = (booking.carId as TCar).pricePerHour;
  const pricePerDay = (booking.carId as TCar).pricePerDay;
  const additionalFeatures = booking.additionalFeatures;

  const tripDuration = dayjs(endDate).isAfter(dayjs(startDate))
    ? dayjs(endDate).diff(dayjs(startDate), 'hour')
    : 0;

  const basePrice =
    tripDuration >= 24
      ? Math.ceil(tripDuration / 24) * Number(pricePerDay)
      : tripDuration * Number(pricePerHour);

  const featuresPrice = additionalFeatures?.reduce((total, feature) => {
    return (
      total +
      feature.price *
        (tripDuration >= 24 ? Math.ceil(tripDuration / 24) : tripDuration)
    );
  }, 0);

  const totalCost = basePrice + Number(featuresPrice);

  const data = {totalCost,endDate,status:"completed"} as unknown as Partial<TBooking>

  if(returnData.paymentId){
    data["paymentId"] = returnData.paymentId
    data['paymentType'] = returnData.paymentType;
    data['completedPayment'] = true;
  }

  const result = await Booking.findByIdAndUpdate({ _id: booking._id }, data,{new:true});


  return result;
};

export const bookingServices = {
  returnTheCar,
  bookACarIntoDB,
  getAllBookingsFromDB,
  getBookingByUserIdFromDB,
  deleteBooking,
  modifyBookingInDB,
  updateStatusIntoDB,
};
