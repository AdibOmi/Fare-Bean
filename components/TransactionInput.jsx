import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TransactionInput({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  const handleAdd = () => {
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString(),
    };

    onAdd(newTransaction);

    setDescription('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setType('income')}
          style={[styles.toggleButton, type === 'income' && styles.active]}>
          <Text style={styles.toggleText}>Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType('expense')}
          style={[styles.toggleButton, type === 'expense' && styles.active]}>
          <Text style={styles.toggleText}>Expense</Text>
        </TouchableOpacity>
      </View>

      <Button title="Add Transaction" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  active: {
    backgroundColor: '#cce5ff',
    borderColor: '#007bff',
  },
  toggleText: {
    fontSize: 16,
  },
});
