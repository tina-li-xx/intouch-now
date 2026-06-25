import app from './app';
import EnvHelper from './config/env.helper';

const server = app.listen(EnvHelper.getPort(), () => {
  console.log('intouch api started');
});

process.on('unhandledRejection', (error) => {
  console.error('api_unhandled_rejection', error);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
