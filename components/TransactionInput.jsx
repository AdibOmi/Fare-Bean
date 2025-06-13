import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TransactionInput({ onAdd, selectedDate }) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!amount) return;

    const newTransaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      date: selectedDate,
    };

    onAdd(newTransaction);
    setDescription('');
    setAmount('');
  };

  useEffect(() => {
    setAmount('');
    setDescription('');
    setType('income');
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => setType('income')}
          style={[styles.toggleButton, type === 'income' && styles.active]}
        >
          <Text style={[styles.toggleText, type === 'income' && { color: 'black' }]}>Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType('expense')}
          style={[styles.toggleButton, type === 'expense' && styles.active]}
        >
          <Text style={[styles.toggleText, type === 'expense' && { color: 'black' }]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView>
        {/* Amount Field */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Amount:</Text>
          <TextInput
            style={styles.inputField}
            placeholder=""
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Description Field */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput
            style={styles.inputField}
            placeholder=""
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={[styles.addBtnText, { color: 'black' }]}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#1877F2',
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 10,
  },
  toggleButton: {
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#1877F2',
  },
  toggleText: {
    color: 'white',
    fontSize: 20,
  },
  active: {
    backgroundColor: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    width: '100%',
  },
  inputLabel: {
    color: 'white',
    fontSize: 18,
    width: 100,
  },
inputField: {
  flex: 1,
  borderBottomWidth: 1,
  borderBottomColor: 'white',
  fontSize: 18,
  color: 'white',
  paddingVertical: 4,
  marginLeft: 10,
},
  addBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 190,
  },
  addBtnText: {
    fontSize: 20,
  },
});
