import express from "express"
import { userController } from "./user.controller"
import { validateRequest } from "../../Middlewares/validateRequest"
import { userValidation } from "./user.validation"
import { Auth } from "../../Middlewares/auth"

const router = express.Router()

router.get('/', Auth('admin'), userController.getAllUsers);
router.patch('/:id',Auth("admin","user"),validateRequest(userValidation.updateUserValidation),userController.updateUser)
router.delete('/:id',Auth("admin"),userController.deleteUser)
router.put(
  '/status/:id',
  Auth('admin'),
  validateRequest(userValidation.updateUserValidation),
  userController.changeStatus,
);

export const UserRouter = router