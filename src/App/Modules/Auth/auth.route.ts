import express from 'express';
import { validateRequest } from '../../Middlewares/validateRequest';
import { userValidation } from '../User/user.validation';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import { Auth } from '../../Middlewares/auth';

const router = express.Router();

router.post('/signup',validateRequest(userValidation.createUserValidation),authController.createUser);
router.post('/signin',validateRequest(authValidation.UserSignInValidation),authController.userSignIn);
router.post('/refreshToken',authController.refreshToken);

router.patch(
  '/role/:id',
  Auth('admin'),
  validateRequest(authValidation.ChangeRoleValidation),
  authController.changeRole,
);




export const AuthRouts = router;
