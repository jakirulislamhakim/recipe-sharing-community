import { z } from 'zod';

const userRegistrationValidationSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: 'fullname is required',
        invalid_type_error: 'fullname must be a string',
      })
      .min(3, { message: 'fullname must be at least 3 characters' })
      .max(40, { message: 'fullname must be at most 40 characters' })
      .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces.')
      .trim(),
    email: z
      .string({
        required_error: 'email is required',
        invalid_type_error: 'email must be a string',
      })
      .email({
        message: 'Invalid email format',
      }),
    password: z
      .string({
        required_error: 'password is required',
        invalid_type_error: 'password must be a string',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
        },
      )
      .trim(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email(),
    password: z.string({
      required_error: 'password is required',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

export const AuthValidations = {
  userRegistrationValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
};
