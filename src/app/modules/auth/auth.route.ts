import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import ValidateRequest from '../../middleware/validateRequest';
import { AuthValidations } from './auth.validation';

const router = Router();

router.post(
  '/registration',
  ValidateRequest(AuthValidations.userRegistrationValidationSchema),
  AuthControllers.userRegistration,
);

// router.post(
//   '/login',
//   ValidateRequest(AuthValidations.loginValidationSchema),
//   AuthControllers.login,
// );

// router.post(
//   '/refresh-token',
//   ValidateRequest(AuthValidations.refreshTokenValidationSchema),
//   AuthControllers.refreshToken,
// );

export const AuthRoutes = router;
