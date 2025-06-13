import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SummaryScreen({ navigation }) {
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    const loadAllTransactions = async () => {
      try {
        const data = await AsyncStorage.getItem('transaction_by_date');
        if (data) {
          const parsed = JSON.parse(data);
          const flatList = Object.entries(parsed)
            .flatMap(([date, txns]) =>
              txns.map((txn) => ({ ...txn, date }))
            )
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
          setAllTransactions(flatList);
        }
      } catch (err) {
        console.log('Summary Load Error:', err);
      }
    };

    loadAllTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Summary</Text>

      <FlatList
  data={allTransactions}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingHorizontal: 20 }}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Home', { date: item.date })}
    >
      <View style={styles.transactionRow}>
        <Text style={{ flex: 1, fontSize: 14 }}>
          {item.date} - {item.description} - {item.type === 'income' ? '+' : '-'} BDT {item.amount}
        </Text>
      </View>
    </TouchableOpacity>
  )}
/>

<TouchableOpacity
  onPress={() => navigation.goBack()}
  style={styles.backButton}
>
  <Text style={styles.backButtonText}>← Back</Text>
</TouchableOpacity>


      <TouchableOpacity
        onPress={() => navigation.navigate('Home', { date: item.date })}

        style={styles.backButton}
      >
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
   
    textAlign: 'center',
    marginBottom: 20,
  },
  transactionRow: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {

    fontSize: 16,
  },
});
