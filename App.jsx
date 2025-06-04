import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TransactionInput from './components/TransactionInput';

export default function App(){

  const [transactionsByDate, setTransactionsByDate] = useState({}); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 

  const addTransactions =(curren_transaction)=>{
    const dateKey=curren_transaction.date;
    const existing=transactionsByDate[dateKey] || [];
    const updated = { ...transactionsByDate, [dateKey]: [curren_transaction, ...existing]};
    setTransactionsByDate(updated);
  };

  const transactions_list = transactionsByDate[selectedDate] || []; 

  //Loading saved transactions
  useEffect(()=>{
    const loadTransactions = async () =>{
        try{
            const data = await AsyncStorage.getItem('transaction_by_date');
            if(data) setTransactionsByDate(JSON.parse(data));
        } catch (err) {
            console.log("Load error:", err);
        }
    };
    loadTransactions();
  }, []);

  //saving transactions
  useEffect(()=>{
    const saveTransactions = async ()=>{
        try{
            await AsyncStorage.setItem(
                'transaction_by_date', JSON.stringify(transactionsByDate) 
            );
        }
        catch(err){
            console.log("Save error:", err);
        }
    }; 
    saveTransactions();
  }, [transactionsByDate]);

  const totalBalance=Object.values(transactionsByDate).flat().reduce((total, transaction)=>{ 
    return transaction.type=='income'? total+transaction.amount
                                      : total-transaction.amount;
  }, 0); 

  return(
    <LinearGradient colors={['#00B4AA', '#007C88']} style={styles.container}>
          <Text style={styles.title}>
            Fare Bean
          </Text>
          <Text style={styles.heading}>
            Save Up and Buy Coffee
          </Text>
          <Text style={styles.balanceStyle}>
            Current Balance: BDT {totalBalance.toFixed(2)}
          </Text>

          <TransactionInput onAdd={addTransactions}/>

          <Text style={{color: 'white', marginTop: 10}}>Viewing: {selectedDate}</Text> 
          

          <FlatList data={transactions_list} 
                    keyExtractor={(item)=>item.id}
                    renderItem={({item})=>(
                      <Text style={{color: item.type==='income'? 'green': 'red'}}>
                          {item.date}: {item.description} - {item.type==='income'? '+' : '-'}
                          BDT {item.amount}
                      </Text>  
                    )}
          />

          <View style={styles.dateSection}>
              <TouchableOpacity onPress={()=>{
                const prev = new Date(selectedDate); 
                prev.setDate(prev.getDate()-1); 
                setSelectedDate(prev.toISOString().split('T')[0]); 
              }}>
                  <Text>Previous</Text>
              </TouchableOpacity>

                 <TouchableOpacity onPress={()=>{
                const next = new Date(selectedDate); 
                next.setDate(next.getDate()+1); 
                setSelectedDate(next.toISOString().split('T')[0]); 
              }}>
                  <Text>Next</Text>
              </TouchableOpacity>
          </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    marginTop: 160,
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: 'white',
    marginBottom: 30,
  },
  balanceStyle:{
    color: 'white',
    marginBottom: 20,
  },
  dateSection:{
  },
});
