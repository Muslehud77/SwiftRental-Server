
import catchAsync from "../../utils/catchAsync";
import { sendResponse, TMeta } from "../../utils/sendResponse";
import { TCar } from "./car.interface";
import { carServices } from "./car.service";


const createACar = catchAsync(async(req,res)=>{

    const carData = req.body
    const result = await carServices.createACarInDB(carData)


    const data = {
      success: true,
      statusCode: 201,
      message: 'Car created successfully',
      data: result,
    };
    sendResponse<TCar>(res, data);
})

//*Route: /api/cars/:id(PUT) 
const updateACar = catchAsync(async(req,res)=>{
    const id = req.params.id
    const carData = req.body
    const result = await carServices.updateACarInDB(carData,id) as TCar


    const data = {
      success: true,
      statusCode: 200,
      message: 'Car updated successfully',
      data: result,
    };
    sendResponse<TCar>(res, data);
})

const getACarById = catchAsync(async (req, res) => {
  const id = req.params.id;
 
  const result = (await carServices.getACarByIdFromDB(id)) as TCar;

  const data = {
    success: true,
    statusCode: 200,
    message: 'A Car retrieved successfully',
    data: result,
  };
  sendResponse<TCar>(res, data);
});


const getAllCars = catchAsync(async (req, res) => {
  const query = req.query
  const {result,meta} = (await carServices.getAllCarsFromDB(query)) as {result:TCar[],meta:TMeta};

  

  const data = {
    success: true,
    statusCode: 200,
    message: 'Cars retrieved successfully',
    meta: meta,
    data: result
    };
  sendResponse<TCar[]>(res, data);
});

const deleteACar = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = (await carServices.deleteACarFromDB(id)) as TCar;

  const data = {
    success: true,
    statusCode: 200,
    message: "Car Deleted successfully",
    data: result,
  };
  sendResponse<TCar>(res, data);
});

export const carControllers = {
    deleteACar,
    getAllCars,
    createACar,
    updateACar,
    getACarById
}