import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';

// Rate limiting middleware
export const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000 || 15 * 60 * 1000, 
    max: process.env.RATE_LIMIT_MAX || 100 // limit each IP to 100 requests per windowMs
});

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


const devDefaultOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

const parsedOrigins = (() => {
    const envList = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean)
        : [];
    // Merge without duplicates; always include dev defaults in non-production
    const base = process.env.NODE_ENV === 'production' ? [] : devDefaultOrigins;
    return Array.from(new Set([...base, ...envList]));
})();

export const corsOptions = {
    origin: function(origin, callback) {
        // Allow non-browser or same-origin requests (no Origin header)
        if (!origin) return callback(null, true);
        if (parsedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('CORS not allowed from origin: ' + origin + ' (allowed: ' + parsedOrigins.join(', ') + ')'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
};
