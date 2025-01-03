import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendApiResponse } from '../../utils/sendApiResponse';
import { UserServices } from './user.service';

const getAllUser = catchAsync(async (req, res) => {
  const payload = await UserServices.getAllUserFromDB();

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    payload,
  });
});

const changeUserRole = catchAsync(async (req, res) => {
  const currentUserEmail = req.user?.email;
  const { user_id } = req.params;

  const payload = await UserServices.changeUserRoleIntoDB(
    user_id,
    req.body,
    currentUserEmail as string,
  );

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User role change successfully',
    payload,
  });
});

const getMe = catchAsync(async (req, res) => {
  const payload = req.user;

  // can't need get me service because user already attached in req

  sendApiResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    payload,
  });
});

export const UserController = {
  getAllUser,
  changeUserRole,
  getMe,
};
