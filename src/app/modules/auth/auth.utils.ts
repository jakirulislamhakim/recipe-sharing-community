import bcrypt from 'bcryptjs';
import config from '../../config';
import { TJwtPayload } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const bcryptHashPassword = async (password: string) => {
  return await bcrypt.hash(password, Number(config.BCRYPT_SALT_ROUNDS));
};

export const bcryptComparePassword = async (
  plainTextPassword: string,
  hashPassword: string,
) => {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const createJwtAccessToken = (jwtPayload: TJwtPayload) => {
  return jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET_KEY as string, {
    expiresIn: config.JWT_ACCESS_EXP_TIME,
  });
};

export const createJwtRefreshToken = (jwtPayload: TJwtPayload) => {
  return jwt.sign(jwtPayload, config.JWT_REFRESH_SECRET_KEY as string, {
    expiresIn: config.JWT_REFRESH_EXP_TIME,
  });
};

export const setRefreshTokenInCookie = (
  res: Response,
  refreshToken: string,
) => {
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV !== 'development',
    httpOnly: true,
  });
};

// this utils for validate accessToken and return decoded value
export const decodedAccessToken = (accessToken: string) => {
  try {
    const decoded = jwt.verify(
      accessToken,
      config.JWT_ACCESS_SECRET_KEY as string,
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    const isTokenExpired = error instanceof jwt.TokenExpiredError;

    throw new AppError(
      httpStatus.UNAUTHORIZED,
      isTokenExpired
        ? 'Access token has expired. Please request a new access token.'
        : 'Invalid token. Please provide valid authentication credentials.',
    );
  }
};

// this utils for validate refreshToken and return decoded value
export const decodedRefreshToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      config.JWT_REFRESH_SECRET_KEY as string,
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    const isTokenExpired = error instanceof jwt.TokenExpiredError;
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      isTokenExpired
        ? 'Refresh token has expired. Please log in again.'
        : 'Invalid token. Please provide valid authentication credentials.',
    );
  }
};