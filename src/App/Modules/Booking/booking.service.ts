import httpStatus from 'http-status';
import { QueryBuilder } from '../../Builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TUserRequest } from '../User/user.interface';
import { TBooking, TBookingData, TBookingResponse, TReturnData } from './booking.interface';
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
  bookingData: TBookingData,
) => {
  const data: TBooking = {
    user: userData.id,
    car: bookingData.carId,
    date: bookingData.date,
    startTime: bookingData.startTime,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isCarAvailable = await Car.findById({ _id: data.car });

    if (!isCarAvailable || isCarAvailable?.status !== 'available') {
      throw new AppError(
        400,
        'Could not book the car, the car is not available at the moment',
      );
    }

    const carBooking = await Car.findByIdAndUpdate(
      { _id: data.car },
      { status: 'unavailable' },
      { session },
    );
     
    

    if (!carBooking) {
      throw new AppError(400, 'Could not book the car');
    }
    const result = await Booking.create([data], { session }) as unknown as TBookingResponse[];

    if(!result.length){
        
        throw new AppError(400, 'Could not book the car');
    }
    await session.commitTransaction();
    await session.endSession();


    const booking = await getBookingByIdFromDB(result[0]._id)

    return booking;
  } catch (err:any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message || 'Could not book the car');
  }
};



const returnTheCar = async (returnData: TReturnData) => {


  const session = await mongoose.startSession();

  try {

    session.startTransaction()
    const booking = await Booking.findById({ _id: returnData.bookingId });
  
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!');
    }

    const car = await Car.findById({ _id: booking.car });
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');
    }

    const pricePerHour = car.pricePerHour; // 500
    const startTime = new Date(`1970-01-01T${booking.startTime}`); //1970-01-01T05:00:00.000Z
    const endTime = new Date(`1970-01-01T${returnData.endTime}`); //  1970-01-01T07:00:00.000Z



    const timeDifference =
      endTime.getTime() - startTime.getTime() ;

      const timeDifferenceInHours = timeDifference / 3600000;

    
    const totalCost = pricePerHour * timeDifferenceInHours;

    const commitBooking = await Booking.findByIdAndUpdate(
      { _id: returnData.bookingId },
      { endTime: returnData.endTime, totalCost },{session}
    );

    if(!commitBooking){
        throw new AppError(400, 'Could not end the booking!');
    }
    
    const updateTheCarToAvailable = await Car.findByIdAndUpdate({_id:car._id},{status:"available"},{session})

     if (!updateTheCarToAvailable) {
       throw new AppError(400, 'Could not end the booking!');
     }

    await session.commitTransaction();
    await session.endSession();
      const bookingData = await getBookingByIdFromDB(returnData.bookingId);
    return bookingData;
  } catch (err:any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message || 'Could not end the booking!');
  }
};


export const bookingServices = {
  returnTheCar,
  bookACarIntoDB,
  getAllBookingsFromDB,
  getBookingByUserIdFromDB,
};