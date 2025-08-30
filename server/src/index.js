import connectDB from './config/connectDB.js';

import {app} from './app.js';

const requiredEnv = ['MONGODB_URI'];
requiredEnv.forEach(v => {
    if (!process.env[v]) {
        console.warn(`[CONFIG WARNING] Missing ${v}. Define it in .env`);
    }
});

connectDB().catch(err => console.log("Database Connection Failed!!", err.message));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

