import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TransactionInput from '../components/TransactionInput';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [transactionsByDate, setTransactionsByDate] = useState({}); 
  const [selectedDate, setSelectedDate] = useState(
    route.params?.date || new Date().toISOString().split('T')[0]
  );

  const addTransactions = (transaction) => {
    const dateKey = transaction.date;
    const existing = transactionsByDate[dateKey] || [];
    const updated = { ...transactionsByDate, [dateKey]: [transaction, ...existing] };
    setTransactionsByDate(updated);
  };


  const deleteTransaction = (id) => {
    const updatedList = transactionsByDate[selectedDate].filter((t) => t.id !== id);
    setTransactionsByDate({ ...transactionsByDate, [selectedDate]: updatedList });
  };

  const transactions_list = transactionsByDate[selectedDate] || [];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem('transaction_by_date');
        if (data) setTransactionsByDate(JSON.parse(data));
      } catch (err) {
        console.log('Load error:', err);
      }
    };
    loadTransactions();
  }, []);

  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('transaction_by_date', JSON.stringify(transactionsByDate));
      } catch (err) {
        console.log('Save error:', err);
      }
    };
    saveTransactions();
  }, [transactionsByDate]);

  const totalBalance = Object.values(transactionsByDate)
    .flat()
    .reduce((total, t) => (t.type === 'income' ? total + t.amount : total - t.amount), 0);

  return (
    // <LinearGradient colors={['#00B4AA', '#007C88']} style={styles.container}>
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Fare Bean</Text>
        <Text style={styles.subtitle}>Save Up and Buy Coffee</Text>
        <Text style={styles.balance}>Current Balance: BDT {totalBalance.toFixed(2)}</Text>

        {/* Summary Button */}
        <TouchableOpacity onPress={() => navigation.navigate('Summary')}>
          <Text style={styles.summaryLink}>View Summary →</Text>
        </TouchableOpacity>

        <TransactionInput onAdd={addTransactions} />

        <Text style={styles.dateLabel}>Viewing: {selectedDate}</Text>

       <FlatList
  data={transactions_list}
  style={styles.transactionList}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Home', { date: item.date })}
    >
      <View style={styles.transactionRow}>
        <Text
          style={{
            color: item.type === 'income' ? 'lightgreen' : 'salmon',
            flex: 1,
            fontSize: 14,
          }}
        >
          {item.date} - {item.description} - {item.type === 'income' ? '+' : '-'} BDT {item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  )}
/>


        <View style={styles.dateSection}>
          <TouchableOpacity
            onPress={() => {
              const prev = new Date(selectedDate);
              prev.setDate(prev.getDate() - 1);
              setSelectedDate(prev.toISOString().split('T')[0]);
            }}
          >
            <Text style={styles.navButton}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const next = new Date(selectedDate);
              next.setDate(next.getDate() + 1);
              setSelectedDate(next.toISOString().split('T')[0]);
            }}
          >
            <Text style={styles.navButton}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    {/* </LinearGradient> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',

  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  balance: {
    fontSize: 16,
    marginBottom: 10,
  },
  summaryLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    marginTop: 10,
  },
  transactionList: {
    width: '100%',
    marginTop: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 5,
  },
  deleteBtn: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
  navButton: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
