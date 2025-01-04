import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { seedFirstAdminIntoDB } from './app/utils/seedAdminIntoDB';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);

    // first admin push if no admin exists
    seedFirstAdminIntoDB();

    server = app.listen(config.PORT, () => {
      console.log(`app is listening on port ${config.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

// unhandledRejection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit();
});

// uncaughtException
process.on('uncaughtException', (err: Error) => {
  console.log(err.message);
  console.log('UncaughtException ! 💥 shutting down....');

  process.exit(1);
});
