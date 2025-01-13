import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

const userRegistrationValidationSchema = z.object({
  body: z
    .object({
      fullName: z
        .string({
          required_error: 'fullname is required',
          invalid_type_error: 'fullname must be a string',
        })
        .min(3, { message: 'fullname must be at least 3 characters' })
        .max(40, { message: 'fullname must be at most 40 characters' })
        .regex(
          /^[a-zA-Z\s]+$/,
          'Full name can only contain letters and spaces.',
        )
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
        .max(20, { message: "Passwords can't be longer than 20 characters." })
        .trim(),
    })
    .strict({
      message: 'Extra field found in request body',
    }),
});

const loginValidationSchema = z.object({
  body: z
    .object({
      identifier: z.string({
        required_error: 'username/email is required',
      }),
      password: z
        .string({
          required_error: 'password is required',
        })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message:
              'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
          },
        )
        .max(20, { message: "Passwords can't be longer than 20 characters." }),
    })
    .refine(
      (data) =>
        emailRegex.test(data.identifier) || usernameRegex.test(data.identifier),
      {
        message: 'Identifier must be a valid email or username',
        path: ['identifier'],
      },
    ),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'Old password is required',
      })
      .max(20, { message: "Passwords can't be longer than 20 characters." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
        },
      ),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .max(20, { message: "Passwords can't be longer than 20 characters." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
        },
      )
      .max(20, { message: "Passwords can't be longer than 20 characters." }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z
    .object({
      identifier: z.string({
        required_error: 'email or username must required',
      }),
    })
    .refine(
      (data) =>
        emailRegex.test(data.identifier) || usernameRegex.test(data.identifier),
      {
        message: 'Identifier must be a valid email or username',
        path: ['identifier'],
      },
    ),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .max(20, { message: "Passwords can't be longer than 20 characters." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
        },
      ),
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
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
};
