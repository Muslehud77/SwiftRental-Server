import { z } from 'zod';

// Validation for additionalFeatures array
const additionalFeatureSchema = z.object({
  name: z.string(),
  price: z.number(),
});

// Create booking validation schema based on bookingData
const createBookingValidation = z.object({
  body: z.object({
    carId: z.string(),
    origin: z.string().optional(),
    destination: z.string().optional(),
    drivingLicense: z.string(),
    nidOrPassport: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    totalCost: z.number(),
    additionalFeatures: z.array(additionalFeatureSchema).optional(),
    status: z.enum(['pending' , 'approved' , 'rejected']).optional(),
    completedPayment: z.boolean().optional(),
  }),
});

const modifyBookingValidation = createBookingValidation.deepPartial()

// Validation schema for returning the car
const returnCarValidation = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string(),
  }),
});

export const bookingValidation = {
  createBookingValidation,
  returnCarValidation,
  modifyBookingValidation,
};
