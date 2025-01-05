import { Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  bio: string;
  role: TUserRole;
  isUserPremium: boolean;
  passwordChangeAt: Date;
  isDeleted: boolean;
};

export type TUserRole = keyof typeof USER_ROLE;
