import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import { limiter, corsOptions } from './middlewares/security.js';

const checkEmailConfig = () => {
  const requiredVars = ['SMTP_USER', 'SMTP_PASS', 'SENDER_EMAIL'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    console.warn(`[EMAIL CONFIG] Missing: ${missing.join(', ')}`);
  }
};

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());

// CORS FIRST 
app.use(cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: { 
    policy: 'cross-origin' 
  },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'img-src': [
        "'self'",
        'data:',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://res.cloudinary.com'
      ]
    }
  }
}));
app.use(limiter);
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}


app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


import { promises as fsp } from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
fsp.stat(uploadsDir).catch(()=> fsp.mkdir(uploadsDir, { recursive: true }).catch(()=>{}));

app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);

checkEmailConfig();

app.get('/api/health', (req, res) => {
  res.json({ message: 'Car Dealership API is running' });
});

import { notFound, errorHandler } from './middlewares/error.js';

app.use(notFound);
app.use(errorHandler);


export {app};