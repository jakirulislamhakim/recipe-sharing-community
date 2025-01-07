import httpStatus from 'http-status';
import { TUser, TUserRole } from '../user/user.interface';
import { User } from '../user/user.model';
import type { TChangePassword, TJwtPayload, TLoginUser } from './auth.interface';
import {
  bcryptComparePassword,
  bcryptHashPassword,
  createJwtAccessToken,
  createJwtRefreshToken,
  createJwtResetToken,
  decodedRefreshToken,
  decodedResetToken,
} from './auth.utils';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../user/user.constant';
import { generateUniqueUsername } from '../user/user.util';
import config from '../../config';
import { sendEmail } from '../../utils/sendEmail';

const userRegistrationIntoDB = async (payload: TUser) => {
  const { password, ...remainingPayload } = payload;

  // check the user is already exists
  const isExistsUser = await User.findOne({ email: payload.email });
  if (isExistsUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      `A user with this email already exists.`,
    );
  }

  const hashPassword = await bcryptHashPassword(password);
  // set user role
  remainingPayload.role = USER_ROLE.user;
  // generate unique username
  const username = await generateUniqueUsername(payload.fullName);
  remainingPayload.username = username;

  const data = await User.create({
    password: hashPassword,
    ...remainingPayload,
  });

  if (!data) {
    throw new Error("Something went wrong! Can't created user");
  }

  // jwt payload
  const jwtPayload = {
    email: data.email,
    role: data.role as TUserRole,
  };

  // create jwt access token
  const accessToken = createJwtAccessToken(jwtPayload);
  // create jwt refresh token
  const refreshToken = createJwtRefreshToken(jwtPayload);

  return {
    data,
    accessToken,
    refreshToken,
  };
};

// const createAdminByAdminIntoDB = async (payload: TUser) => {
//   const { password, ...remainingPayload } = payload;

//   // check the email address is already exists
//   const isExistsUser = await User.findOne({ email: payload.email });
//   if (isExistsUser) {
//     throw new AppError(
//       httpStatus.CONFLICT,
//       'The admin email is already exists',
//     );
//   }

//   const hashPassword = await bcryptHashPassword(password);
//   // set admin role
//   remainingPayload.role = USER_ROLE.admin;

//   const result = await User.create({
//     password: hashPassword,
//     ...remainingPayload,
//   });

//   if (!result) {
//     throw new Error("Something went wrong! Can't created admin");
//   }

//   return result;
// };

const login = async (payload: TLoginUser) => {
  const { identifier, password } = payload;
  // check user exists
  const isExistsUser = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  })
    .select('+password')
    .select('password role email');

  if (!isExistsUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Account not found. Please check your credentials or sign up.',
    );
  }

  // check valid password
  const matchPassword = await bcryptComparePassword(
    password,
    isExistsUser?.password as string,
  );
  if (!matchPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials!');
  }

  // jwt payload
  const jwtPayload = {
    email: isExistsUser.email,
    role: isExistsUser.role as TUserRole,
  };

  // create jwt access token
  const accessToken = createJwtAccessToken(jwtPayload);
  // create jwt refresh token
  const refreshToken = createJwtRefreshToken(jwtPayload);

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('-isDeleted');

  return { accessToken, refreshToken, user };
};

// change password
const changePasswordIntoDB = async (
  payload: TChangePassword,
  userEmail: string,
) => {
  const { oldPassword, newPassword } = payload;

  // check user exists
  const isExistsUser = await User.findOne({ email: userEmail })
    .select('+password')
    .select('password');

  if (!isExistsUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  // check old password is valid
  const matchPassword = await bcryptComparePassword(
    oldPassword,
    isExistsUser.password as string,
  );

  if (!matchPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid old password!');
  }

  // hash new password
  const hashPassword = await bcryptHashPassword(newPassword);

  await User.findOneAndUpdate(
    { email: userEmail },
    { password: hashPassword, passwordChangeAt: new Date() },
  );
};

// forget password
const forgetPassword = async (payload: Pick<TLoginUser, 'identifier'>) => {
  const { identifier } = payload;

  const isExistsUser = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!isExistsUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  const jwtPayload: TJwtPayload = {
    email: isExistsUser.email,
    role: isExistsUser.role,
  };

  const resetToken = createJwtResetToken(jwtPayload);
  const resetUrl = `${config.BACKEND_BASE_URL}/auth/reset-password/${resetToken}`;

  await sendEmail({
    to: isExistsUser.email,
    subject: 'Reset Your Password',
    templateName: 'reset-password',
    emailData: {
      resetUrl,
      name: isExistsUser.fullName,
    },
  });
};

// reset password
const resetPasswordIntoDB = async (password: string, token: string) => {
  const decodedToken = decodedResetToken(token);

  // hash password
  const hashPassword = await bcryptHashPassword(password);

  // update user password
  await User.findOneAndUpdate(
    { email: decodedToken.email },
    {
      password: hashPassword,
      passwordChangeAt: new Date(),
    },
  );
};

const refreshToken = async (token: string) => {
  const verifyRefreshToken = decodedRefreshToken(token);
  const { email, role } = verifyRefreshToken;

  const isExistsUser = await User.findOne({ email, role });
  if (!isExistsUser) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid refresh token.');
  }

  // jwt payload
  const jwtPayload = { email, role };

  // create jwt access token
  const accessToken = createJwtAccessToken(jwtPayload);

  return accessToken;
};

export const AuthServices = {
  userRegistrationIntoDB,
  login,
  changePasswordIntoDB,
  forgetPassword,
  resetPasswordIntoDB,
  refreshToken,
};
