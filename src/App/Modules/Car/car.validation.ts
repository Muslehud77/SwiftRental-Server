import { z } from 'zod';

const createCarValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    model: z.string({
      required_error: 'Model is required',
      invalid_type_error: 'Model must be a string',
    }),
    year: z.string({
      required_error: 'Year is required',
      invalid_type_error: 'Year must be a string',
    }),
    carType: z.string({
      required_error: 'Car type is required',
      invalid_type_error: 'Car type must be a string',
    }),
    description: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    }),
    color: z.string({
      required_error: 'Color is required',
      invalid_type_error: 'Color must be a string',
    }),
    images: z
      .array(
        z.object({
          url: z.string({
            required_error: 'Image URL is required',
            invalid_type_error: 'Image URL must be a string',
          }),
          blurHash: z.string({
            required_error: 'Image blurHash is required',
            invalid_type_error: 'Image blurHash must be a string',
          }),
        }),
      )
      .min(1, 'At least one image is required'),
    features: z
      .array(
        z.string({
          required_error: 'Each feature must be a string',
          invalid_type_error: 'Features must be an array of strings',
        }),
      )
      .min(1, 'Features must contain at least one item'),
    pricePerHour: z.string({
      required_error: 'Price per hour is required',
      invalid_type_error: 'Price per hour must be a string',
    }),
    pricePerDay: z.string({
      required_error: 'Price per day is required',
      invalid_type_error: 'Price per day must be a string',
    }),
    status: z
      .enum(['available', 'not-available'], {
        invalid_type_error:
          "Status must be either 'available' or 'not-available'",
      })
      .default('available')
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const updateCarValidation = createCarValidation.deepPartial();

export const carValidation = {
  createCarValidation,
  updateCarValidation,
};
