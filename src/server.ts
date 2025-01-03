import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { seedFirstAdminIntoDB } from './app/utils/seedAdminIntoDB';

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);

    // first admin push if no admin exists
    seedFirstAdminIntoDB();

    app.listen(config.PORT, () => {
      console.log(`app is listening on port ${config.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();
