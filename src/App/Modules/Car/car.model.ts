import { Schema, model } from 'mongoose';
import { TCar, TCarStatics } from './car.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const carSchema = new Schema<TCar, TCarStatics>(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    carType: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        blurHash: { type: String, required: true },
      },
    ],
    features: [{ type: String, required: true }],
    pricePerHour: { type: String, required: true },
    pricePerDay: { type: String, required: true },
    status: {
      enum: ['available', 'not-available'],
      type: String,
      default: 'available',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

carSchema.statics.isCarExistByID = async function (id: string) {
  const car = await Car.findById({ _id: id });
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car does not exists!');
  }
  return car;
};

carSchema.statics.isCarAvailableByID = async function (id: string) {
  const car = await Car.isCarExistByID(id);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car does not exists!');
  }

  if (car.status !== 'available') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car is not available!');
  }

  if (car.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car is deleted!');
  }

  return car;
};

export const Car = model<TCar, TCarStatics>('Car', carSchema);
