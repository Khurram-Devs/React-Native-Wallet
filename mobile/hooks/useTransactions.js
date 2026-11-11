import { useCallback, useState } from "react";
import { Alert } from "react-native";

// For Localhost testing
// const API_URL = "http://localhost:5001/api";

// For Android emulator
const API_URL = "http://10.0.2.2:5001/api";

// For Published Replit API
// const API_URL = "http://434f11e5-7cd1-4d7b-ba0c-64cf4aa4c2ca-00-1ajboth9g0unw.kirk.replit.dev/api";


export const useTransactions = (userId) => {

    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(
        { balance: 0, income: 0, expense: 0 }
    );

    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);

        }
    }, [userId]);


    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = useCallback(async (transactionId) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }
            loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }
    })

    return {
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction,
    }

}