import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import ValidateRequest from '../../middleware/validateRequest';
import { AuthValidations } from './auth.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/registration',
  ValidateRequest(AuthValidations.userRegistrationValidationSchema),
  AuthControllers.userRegistration,
);

router.post(
  '/login',
  ValidateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.login,
);

router.post(
  '/change-password',
  ValidateRequest(AuthValidations.changePasswordValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  AuthControllers.changePassword,
);

router.post(
  '/forget-password',
  ValidateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password/:token',
  ValidateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

router.post(
  '/refresh',
  ValidateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// router.post(
//   '/create-admin',
//   auth(USER_ROLE.superAdmin),
//   ValidateRequest(AuthValidations.userRegistrationValidationSchema),
//   AuthControllers.createAdmin,
// );

export const AuthRoutes = router;
