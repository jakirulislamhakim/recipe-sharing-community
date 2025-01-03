import config from '../config';
import { bcryptHashPassword } from '../modules/auth/auth.utils';
import { USER_ROLE } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

// fixme : use real user schema model when seed a admin or superAdmin
const firstAdminData: Omit<TUser, 'isDeleted' | '_id' | 'password'> = {
  name: 'Jakirul Islam Hakim',
  email: config.FIRST_ADMIN_EMAIL as string,
  phone: '01736100945',
  role: USER_ROLE.superAdmin,
  address: 'Dhaka , Bangladesh',
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
