import { Schema, model } from 'mongoose';
import { TUser, TUserStatics } from './user.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import configs from '../../configs';

const userSchema = new Schema<TUser, TUserStatics>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    password: { type: String, required: true, select: 0 },
    phone: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    image: {
      url: { type: String },
      blurHash: { type: String },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isUserExists = async function (id: string) {
  const user = await this.findById({ _id: id }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
  }
  return user;
};

userSchema.statics.isUserHasAccess = async function (id: string) {
  const user = await this.findById({ _id: id }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is Deleted!');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is Blocked!');
  }
  return user;
};

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const encryptedPassword = await bcrypt.hash(
      this.password,
      configs.saltRounds,
    );
    this.password = encryptedPassword;
  }
});

userSchema.post('save', async function (doc, next) {
  this.password = '';
  next();
});

export const User = model<TUser, TUserStatics>('User', userSchema);
