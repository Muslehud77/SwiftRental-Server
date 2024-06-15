// const bookingServices = {
//   returnTheCar,
//   getUsersBookingsFromDB,
//   bookACarIntoDB,
//   getAllBookingsFromDB,
//   getBookingByIdFromDB,
// };

import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TUserRequest } from "../User/user.interface";
import { TBooking } from "./booking.interface";

import { bookingServices } from "./booking.service";


const getBookingsByUserId = catchAsync(async(req,res)=>{
   
     const userId = req.user.id;

     const result = await bookingServices.getBookingByUserIdFromDB(userId) as unknown as TBooking[]

     const data = {
       success: true,
       statusCode: 200,
       message: 'My Bookings retrieved successfully',
       data: result,
     };

     sendResponse<TBooking[]>(res, data);
})


const bookACar = catchAsync(async (req, res) => {
  const bookingData = req.body;
  const userData = req.user as TUserRequest

  const result = (await bookingServices.bookACarIntoDB(
    userData,
    bookingData,
  )) as unknown as TBooking;

  const data = {
    success: true,
    statusCode: 200,
    message: 'Car booked successfully',
    data: result,
  };

  sendResponse<TBooking>(res, data);
});

const getAllBookings = catchAsync(async (req, res) => {
  const query = req.query;
 

  const result = (await bookingServices.getAllBookingsFromDB(
    query
  )) as unknown as TBooking[];

  const data = {
    success: true,
    statusCode: 200,
    message: 'Bookings retrieved successfully',
    data: result,
  };

  sendResponse<TBooking[]>(res, data);
});

const returnTheCar = catchAsync(async (req, res) => {

  const returnData = req.body;
  

  const result = (await bookingServices.returnTheCar(
   returnData
  )) as unknown as TBooking;

  const data = {
    success: true,
    statusCode: 200,
    message: 'Car booked successfully',
    data: result,
  };

  sendResponse<TBooking>(res, data);
});


export const bookingControllers = {
  getBookingsByUserId,
  returnTheCar,
  bookACar,
  getAllBookings,
};