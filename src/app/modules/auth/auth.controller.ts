import { AuthServices } from './auth.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendApiResponse } from '../../utils/sendApiResponse';
import { setRefreshTokenInCookie } from './auth.utils';
import AppError from '../../errors/AppError';

const userRegistration = catchAsync(async (req, res) => {
  const {
    data: payload,
    accessToken,
    refreshToken,
  } = await AuthServices.userRegistrationIntoDB(req.body);

  // Set refresh token in cookie
  setRefreshTokenInCookie(res, refreshToken);

  sendApiResponse(res, {
    statusCode: httpStatus.CREATED,
    message: `Welcome! Your account has been created successfully`,
    payload,
    accessToken,
    links: {
      login: {
        method: 'POST',
        href: '/auth/login',
      },
    },
  });
});

// const createAdminByAdmin = catchAsync(async (req, res) => {
//   const payload = await AuthServices.createAdminByAdminIntoDB(req.body);

//   sendApiResponse(res, {
//     statusCode: httpStatus.CREATED,
//     message: `Admin registered successfully`,
//     payload,
//   });
// });

const login = catchAsync(async (req, res) => {
  const {
    accessToken,
    refreshToken,
    user: payload,
  } = await AuthServices.login(req.body);

  // Set refresh token in cookie
  setRefreshTokenInCookie(res, refreshToken);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `User logged in successfully`,
    accessToken: accessToken,
    payload,
  });
});

// change password of user by user token
const changePassword = catchAsync(async (req, res) => {
  await AuthServices.changePasswordIntoDB(req.body, req.user!.email);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `Password changed successfully`,
    payload: null,
  });
});

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  await AuthServices.forgetPassword(req.body);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `We’ve sent you an email with instructions to reset your password`,
    payload: null,
  });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Reset token is required');
  }

  await AuthServices.resetPasswordIntoDB(req.body.password, token);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `Password has been successfully reset.`,
    payload: null,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const accessToken = await AuthServices.refreshToken(refreshToken);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `New access token retrieved successfully`,
    accessToken: accessToken,
    payload: null,
  });
});

export const AuthControllers = {
  userRegistration,
  login,
  changePassword,
  forgetPassword,
  resetPassword,
  refreshToken,
};
