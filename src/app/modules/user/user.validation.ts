import { z } from 'zod';
import { USER_ROLE } from './user.constant';

const changeUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(Object.keys(USER_ROLE) as [string, ...string[]]),
  }),
});

export const UserValidations = {
  changeUserRoleValidationSchema,
};
