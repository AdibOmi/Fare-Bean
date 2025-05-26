import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import TransactionInput from './components/TransactionInput';


interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const totalBalance = transactions.reduce((total, tx) => {
    return tx.type === 'income' ? total + tx.amount : total - tx.amount;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Finance Tracker</Text>
      <Text style={styles.balance}>Balance: ৳{totalBalance.toFixed(2)}</Text>

      <TransactionInput onAdd={addTransaction} />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ color: item.type === 'income' ? 'green' : 'red' }}>
            {item.date}: {item.description} - {item.type === 'income' ? '+' : '-'}৳{item.amount}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  balance: { fontSize: 20, marginBottom: 20 },
});
