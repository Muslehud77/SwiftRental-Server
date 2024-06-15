import { TCar } from './car.interface';
import { Car } from './car.model';


const createACarInDB =async (carData:TCar)=>{
const result = await Car.create(carData)
return result
}

const getAllCarsFromDB = async () => {
  const result = await Car.find();
  return result;
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