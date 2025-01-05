import { model, Query, Schema } from 'mongoose';
import { TUser } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<TUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },
    profileImage: {
      type: String,
      required: true,
      default: 'https://i.ibb.co.com/4jr3Rn6/no-images.png',
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: 'user',
    },
    isUserPremium: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangeAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

// Middleware to trim spaces in fields before save to DB

// set password field "" when created user done
userSchema.post('save', function () {
  this.password = '';
});

// Pre middleware to filter out deleted users
userSchema.pre<Query<TUser[], TUser>>(/^find/, function (next) {
  // 'this' refers to the current query
  this.where({ isDeleted: false });
  next();
});

export const User = model<TUser>('User', userSchema);
