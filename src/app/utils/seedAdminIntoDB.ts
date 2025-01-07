import config from '../config';
import { bcryptHashPassword } from '../modules/auth/auth.utils';
import { USER_ROLE } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

type TFirstAdminData = Pick<
  TUser,
  'fullName' | 'email' | 'username' | 'role' | 'isUserPremium'
>;

const firstAdminData: TFirstAdminData = {
  fullName: 'Jakirul Islam Hakim',
  email: config.FIRST_ADMIN_EMAIL as string,
  role: USER_ROLE.superAdmin,
  username: 'hakim_h4',
  isUserPremium: true,
};

export const seedFirstAdminIntoDB = async () => {
  const user = await User.findOne({
    email: config.FIRST_ADMIN_EMAIL,
    role: USER_ROLE.superAdmin,
  });

  if (!user) {
    const password = await bcryptHashPassword(
      config.FIRST_ADMIN_PASSWORD as string,
    );

    await User.create({ ...firstAdminData, password });
  }
};
