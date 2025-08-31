import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';
import { FRONTEND_ORIGIN } from '../config/env.js';

export const limiter = rateLimit({
    windowMs: (Number(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100
});

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const allowedOrigin = (FRONTEND_ORIGIN || '').trim();
if (!allowedOrigin) {
    console.warn('[CORS] FRONTEND_ORIGIN not set; all browser requests with Origin will be rejected.');
} else {
    console.log('[CORS] Allowed origin:', allowedOrigin);
}

export const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);
    if (origin === allowedOrigin) return callback(null, true);
    return callback(new Error(`CORS not allowed from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400
};
