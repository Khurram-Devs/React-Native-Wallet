import { sql } from '../config/db.js';

export async function getTransactionsByUserId(req, res) {
    try {
        const { user_id } = req.params

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;

        res.status(200).json(transactions);

    } catch (error) {
        console.error('Error getting the transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteTransactionById(req, res) {
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

}

export async function createTransaction(req, res) {
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
}

export async function getTransactionSummaryByUserId(req, res) {
    try {

        const { user_id } = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${user_id}
        `;

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${user_id} AND amount > 0 
        `;

        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${user_id} AND amount < 0 
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        })

    } catch (error) {
        console.error('Error getting the summary:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}