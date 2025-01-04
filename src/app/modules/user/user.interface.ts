import { Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: TUserRole;
  address: string;
  isDeleted: boolean;
};

export type TUserRole = keyof typeof USER_ROLE;
