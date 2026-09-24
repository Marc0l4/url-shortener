import express from 'express';
import { urlRoutes } from './routes/url.routes';
import { healthRoutes } from './routes/health.routes';
import { errorHandler } from './middlewares/errorHandler';
import { rateLimiter } from './middlewares/rateLimiter';

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static("public"));

app.use(healthRoutes);
app.use("/api/shorten", rateLimiter);
app.use(urlRoutes);

app.use(errorHandler);

export { app };