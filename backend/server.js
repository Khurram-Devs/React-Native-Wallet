import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
dotenv.config();

const app = express();


app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDatabase() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

        console.log('Database initialized successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}


app.get('/api/transactions/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;

        res.status(200).json(transactions);

    } catch (error) {
        console.error('Error getting the transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.delete('/api/transactions/:id', async (req, res) => {

    try {

        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Invalid transaction ID' });
        }

        const result = await sql`DELETE FROM transactions WHERE id = ${id}`;

        if (result.count === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });

    } catch (error) {
        console.error('Error deleting the transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})

app.post('/api/transactions', async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;

        if (!user_id || !title || !category || amount === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES(${user_id}, ${title}, ${amount}, ${category})
        RETURNING *;
        `
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})



initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});