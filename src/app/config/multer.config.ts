import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    folder: '', // fixme: cloudinary folder name where you want to store images
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any, //  'any' to bypass TypeScript error
});

export const upload = multer({ storage: storage });
