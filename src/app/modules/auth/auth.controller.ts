import { AuthServices } from './auth.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendApiResponse } from '../../utils/sendApiResponse';
import { setRefreshTokenInCookie } from './auth.utils';

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

const createAdminByAdmin = catchAsync(async (req, res) => {
  const payload = await AuthServices.createAdminByAdminIntoDB(req.body);

  sendApiResponse(res, {
    statusCode: httpStatus.CREATED,
    message: `Admin registered successfully`,
    payload,
  });
});

const login = catchAsync(async (req, res) => {
  const {
    accessToken,
    refreshToken,
    user: payload,
  } = await AuthServices.login(req.body);

  setRefreshTokenInCookie(res, refreshToken);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `User logged in successfully`,
    accessToken: accessToken,
    payload,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const { accessToken } = await AuthServices.refreshToken(refreshToken);

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: `Access token retrieved successfully`,
    accessToken: accessToken,
    payload: null,
  });
});

export const AuthControllers = {
  userRegistration,
  createAdminByAdmin,
  login,
  refreshToken,
};
