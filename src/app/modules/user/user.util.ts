import { User } from './user.model';

export const generateUniqueUsername = async (fullName: string) => {
  const baseUsername = fullName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .slice(0, 12); // Get the first 12 characters

  let username = baseUsername;
  let isExistsUser = await User.findOne({ username });

  while (isExistsUser) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    username = `${baseUsername}${randomSuffix}`;
    isExistsUser = await User.findOne({ username });
  }

  return username;
};
