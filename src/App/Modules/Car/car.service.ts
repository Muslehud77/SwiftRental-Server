import mongoose from 'mongoose';
import { QueryBuilder } from '../../Builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Booking } from '../Booking/booking.model';
import { TCar } from './car.interface';
import { Car } from './car.model';
import { ObjectId } from 'mongoose';

const createACarInDB = async (carData: TCar) => {
  const result = await Car.create(carData);
  return result;
};

const getAllCarsFromDB = async (query: Record<string, unknown>) => {


  const session = await mongoose.startSession(); // Start a new mongoose session
  session.startTransaction(); // Start a transaction

  try {
    const { startDate, endDate } = query as {
      startDate: string;
      endDate: string;
    };

    let overlappingBookings = [] as unknown as {
      _id: ObjectId;
      carId: string;
    }[];
    if (startDate || endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find bookings where there is an overlap
      overlappingBookings = (await Booking.find({
        status: { $nin: ['rejected', 'completed'] },
        $or: [
          // New booking starts within an existing booking
          {
            startDate: { $lte: end }, // Existing booking starts before or on the new booking's end date
            endDate: { $gte: start }, // Existing booking ends after or on the new booking's start date
          },
        ],
      })
        .select('_id carId')
        .session(session)) as unknown as { _id: ObjectId; carId: string }[];
    }

    // Build the car query with QueryBuilder and execute
    const carQuery = new QueryBuilder(Car.find(), query)
      .search(['name', 'year', 'model', 'description'])
      .filter()
      .sort()
      .paginate()
      .fieldQuery();

    const cars = await carQuery.modelQuery;
    const meta = await carQuery.countTotal();

    let result = [...cars] as unknown as TCar[];

    if (overlappingBookings.length) {
      // Get a list of carIds from overlapping bookings
      const overlappingCarIds = overlappingBookings.map(booking =>
        booking.carId.toString(),
      );

      // Modify the result by adding the new key to cars that have overlapping bookings
      result = cars.map(car => {
        const carObj = car.toObject();
        if (overlappingCarIds.includes(car._id.toString())) {
          carObj['availableForTheDateEntered'] =
            'Not available for the date entered';
        }

        return carObj;
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { result, meta };
  } catch (error: any) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      500,
      error.message || 'An error occurred while fetching the cars',
    );
  }
};

const getACarByIdFromDB = async (id: string) => {
  const result = await Car.findById({ _id: id });
  return result;
};

const updateACarInDB = async (carData: Partial<TCar>, id: string) => {
  await Car.isCarExistByID(id);

  const result = await Car.findByIdAndUpdate({ _id: id }, carData, {
    new: true,
  });

  return result;
};

const deleteACarFromDB = async (id: string) => {
  const result = await Car.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const carServices = {
  deleteACarFromDB,
  updateACarInDB,
  getACarByIdFromDB,
  getAllCarsFromDB,
  createACarInDB,
};
