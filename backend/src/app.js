import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import movieRoutes from './routes/movieRoutes.js';
import userRoutes from './routes/userRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import swaggerDocs from './docs/swagger.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'movie-browsing-api' });
});

app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

swaggerDocs(app);

app.use(notFound);
app.use(errorHandler);

export default app;
