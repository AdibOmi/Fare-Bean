// HomeScreen.js
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
    const updated = {
      ...transactionsByDate,
      [dateKey]: [transaction, ...existing],
    };
    setTransactionsByDate(updated);
  };

  const deleteTransaction = (id) => {
    const updatedList = transactionsByDate[selectedDate].filter((t) => t.id !== id);
    setTransactionsByDate({ ...transactionsByDate, [selectedDate]: updatedList });
  };

  const transactionList = (transactionsByDate[selectedDate] || []).sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Fare Bean</Text>
        <Text style={styles.subtitle}>Where Every Bean Adds Up</Text>
        <Text style={styles.balance}>Current Balance: BDT {totalBalance.toFixed(2)}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Summary')}>
          <Text style={styles.summaryLink}>View All Transactions</Text>
        </TouchableOpacity>

        <TransactionInput onAdd={addTransactions} selectedDate={selectedDate} />

        <Text style={styles.dateLabel}>Viewing: {selectedDate}</Text>

        <FlatList
          data={transactionList}
          style={styles.transactionList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Home', { date: item.date })}
                style={{ flex: 1 }}
              >
                <Text
                  style={{
                    color: item.type === 'income' ? 'rgb(23, 124, 20)' : 'rgb(187, 5, 5)',
                    fontSize: 14,
                  }}
                >
                  {item.date} {item.description} {item.type === 'income' ? '+' : '-'} BDT {item.amount}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
                <Text style={styles.deleteBtn}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      {/* Fixed Date Navigation */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 80, // space for navigation buttons
  },
  title: { marginTop: 30, fontSize: 42, fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '500', marginBottom: 10 },
  balance: { marginTop: 20, fontSize: 18, marginBottom: 10 },
  summaryLink: { fontSize: 14, textDecorationLine: 'underline', marginBottom: 10 },
  dateLabel: { fontSize: 14, marginTop: 10 },
  transactionList: { width: '100%', marginTop: 10 },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 5,
  },
  deleteBtn: { fontSize: 16, marginLeft: 10 },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 15,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#f2f2f2',
  },
  navButton: { fontWeight: '600', fontSize: 14 },
});
