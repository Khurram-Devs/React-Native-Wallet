import express from 'express';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimiter.js';
import { initDatabase } from './config/db.js';
import transactionsRouter from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

// Middlewares
app.use(rateLimiter);
app.use(express.json());

// Configurations
const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/transactions', transactionsRouter);

// Start Server
initDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    })
}); 