import dotenv from 'dotenv';

dotenv.config();

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,

  // authentication secret
  JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
  JWT_RESET_ACCESS_SECRET_KEY: process.env.JWT_RESET_ACCESS_SECRET_KEY,
  JWT_ACCESS_EXP_TIME: process.env.JWT_ACCESS_EXP_TIME,
  JWT_REFRESH_EXP_TIME: process.env.JWT_REFRESH_EXP_TIME,
  JWT_RESET_ACCESS_EXP_TIME: process.env.JWT_RESET_ACCESS_EXP_TIME,

  // first admin secret
  FIRST_ADMIN_EMAIL: process.env.FIRST_ADMIN_EMAIL,
  FIRST_ADMIN_PASSWORD: process.env.FIRST_ADMIN_PASSWORD,

  // image upload secret key
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,

  // email send
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,

  //backend base url
  BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
};
