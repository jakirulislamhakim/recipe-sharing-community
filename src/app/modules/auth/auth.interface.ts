import { TUserRole } from '../user/user.interface';

export type TLoginUser = {
  identifier: string;
  password: string;
};

export type TJwtPayload = {
  email: string;
  role: TUserRole;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};
