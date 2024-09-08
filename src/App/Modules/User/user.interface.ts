import { Model, Types } from 'mongoose';

export interface TUser {
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  phone: string;
  address: string;
  isDeleted?: boolean;
  status?: 'in-progress' | 'blocked';
  image: { url: string; blurHash: string };
}

export interface TUserResponse extends TUser {
  _id: string;
  _doc: TUser
}

export type TUserRequest = {
  id: Types.ObjectId;
  role: 'admin'| 'user';
  iat: number;
  exp: number;
};

export interface TUserStatics extends Model<TUser> {
  isUserExists(id: string): Promise<TUserResponse>;
  isUserHasAccess(id: string): Promise<TUserResponse>;
}
