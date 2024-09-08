/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import configs from '../configs';
import { User } from '../Modules/User/user.model';
import { TRequiredRoles } from '../Modules/Auth/auth.interface';
import { TUserResponse } from '../Modules/User/user.interface';

export const Auth = (...requiredRoles: TRequiredRoles[]) => {
  return catchAsync(async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    
    if (!bearerToken) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route 2',
      );
    }

    const token = bearerToken.split(' ')[1];
    

    let decode = {} as JwtPayload;
    
    try{
      decode = jwt.verify(token, configs.jwt_access_secret) as JwtPayload;
    }catch(error:any){
      throw new AppError(httpStatus.UNAUTHORIZED, error?.message);
    }

    if (!decode) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route 1',
      );
    }
    
   
    //checking is user exist/blocked/deleted
    const isUserHasAccess = (await User.isUserHasAccess(
      decode.id,
    )) as TUserResponse;
    
    if (requiredRoles && !requiredRoles.includes(isUserHasAccess.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route 3',
      );
    }

    req.user = decode as JwtPayload;

    next();
  });
};
