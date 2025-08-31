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

const allowedOrigin = (FRONTEND_ORIGIN || '').trim().replace(/\/$/, ''); // strip trailing slash
if (!allowedOrigin) {
    throw new Error('[CORS] FRONTEND_ORIGIN is required (exact frontend origin, no trailing slash).');
}
console.log('[CORS] Allowed origin:', allowedOrigin);

export const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true); // non-browser
        const cleaned = origin.replace(/\/$/, '');
        if (cleaned === allowedOrigin) return callback(null, true);
        console.warn(`[CORS] Blocked origin: ${origin} (expected: ${allowedOrigin})`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400
};
