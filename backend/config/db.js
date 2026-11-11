import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

// Initialize and export the database connection
export const sql = neon(process.env.DATABASE_URL);