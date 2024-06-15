import { z } from "zod";

const createBookingValidation = z.object({
  body: z.object({
    carId: z.string(),
    date: z.string(),
    startTime: z.string(),
  }),
});

const returnCarValidation = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string(),
  }),
});

export const bookingValidation = {
  createBookingValidation,
  returnCarValidation,
};