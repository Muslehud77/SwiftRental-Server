import httpStatus from 'http-status';
import { QueryBuilder } from '../../Builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TUserRequest } from '../User/user.interface';
import { TBooking,  TBookingResponse, TReturnData } from './booking.interface';
import { Booking } from './booking.model';
import { Car } from '../Car/car.model';

import mongoose, { Types } from 'mongoose';


const getBookingByIdFromDB = async(id:Types.ObjectId)=>{
    const result = await Booking.findById({ _id: id })
      .populate('user')
      .populate('car');

      return result
}

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find().populate('user').populate('car'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fieldQuery();

  const result = await bookingQuery.modelQuery;
  return result;
};

const getBookingByUserIdFromDB = async (id: string) => {
  const result = await Booking.findOne({ user: id })
    .populate('user')
    .populate('car');
  return result;
};


const bookACarIntoDB = async (
  userData: TUserRequest,
  bookingData: Omit<TBooking, 'user'>,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the car exists and is available
    const isCarAvailable = await Car.findById({ _id: bookingData.carId });

    if (!isCarAvailable || isCarAvailable?.status !== 'available') {
      throw new AppError(
        400,
        'Could not book the car, the car is not available at the moment',
      );
    }

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


  // const session = await mongoose.startSession();

  // try {

  //   session.startTransaction()
  //   const booking = await Booking.findById({ _id: returnData.bookingId });
  
  //   if (!booking) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!');
  //   }

  //   const car = await Car.findById({ _id: booking.carId });
  //   if (!car) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
  //   }

  //   const pricePerHour = car.pricePerHour ; // 500
  //   const startTime = new Date(`1970-01-01T${booking.startTime}`); //1970-01-01T05:00:00.000Z
  //   const endTime = new Date(`1970-01-01T${returnData.endTime}`); //  1970-01-01T07:00:00.000Z



  //   const timeDifference =
  //     endTime.getTime() - startTime.getTime() ;

  //     const timeDifferenceInHours = timeDifference / 3600000;

    
  //   const totalCost = Number(pricePerHour) * timeDifferenceInHours;

  //   const commitBooking = await Booking.findByIdAndUpdate(
  //     { _id: returnData.bookingId },
  //     { endTime: returnData.endTime, totalCost },{session}
  //   );

  //   if(!commitBooking){
  //       throw new AppError(400, 'Could not end the booking!');
  //   }
    
  //   const updateTheCarToAvailable = await Car.findByIdAndUpdate({_id:car._id},{status:"available"},{session})

  //    if (!updateTheCarToAvailable) {
  //      throw new AppError(400, 'Could not end the booking!');
  //    }

  //   await session.commitTransaction();
  //   await session.endSession();
  //     const bookingData = await getBookingByIdFromDB(returnData.bookingId);
  //   return bookingData;
  // } catch (err:any) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw new AppError(400, err.message || 'Could not end the booking!');
  // }
};


export const bookingServices = {
  returnTheCar,
  bookACarIntoDB,
  getAllBookingsFromDB,
  getBookingByUserIdFromDB,
};