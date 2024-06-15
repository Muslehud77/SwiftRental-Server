import { z } from "zod";

const createCarValidation = z.object({
    body: z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  color: z.string({
    required_error: 'Color is required',
    invalid_type_error: 'Color must be a string',
  }),
  isElectric: z.boolean({
    required_error: 'isElectric is required',
    invalid_type_error: 'isElectric must be a boolean',
  }),
  features: z
    .array(
      z.string({
        required_error: 'Each feature must be a string',
        invalid_type_error: 'Features must be an array of strings',
      }),
    )
    .min(1, 'Features must contain at least one item'),
  pricePerHour: z.number({
    required_error: 'Price per hour is required',
    invalid_type_error: 'Price per hour must be a number',
  }),
  status: z
    .enum(['available', 'not-available'], {
      invalid_type_error:
        "Status must be either 'available' or 'not-available'",
    })
    .default('available').optional(),
  isDeleted: z.boolean().default(false).optional(),
})

})


const updateCarValidation = createCarValidation.deepPartial()


export const carValidation = {
  createCarValidation,
  updateCarValidation,
};