import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import registerCallProcessingRoute from './component/call-processing/call-processing.route';
import errorMiddleware from './middleware/error.middleware';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));

registerCallProcessingRoute(app);
app.get('/health/live', (_request, response) => response.json({ status: true }));
app.get('/', (_request, response) =>
  response.json({
    message: 'InTouchNow.ai call processing API',
    status: true,
  }),
);

app.use((request, response) => {
  response.status(404).json({
    message: `No endpoint found for ${request.method} ${request.path}.`,
    status: false,
  });
});
app.use(errorMiddleware);

export default app;
