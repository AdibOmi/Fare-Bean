import { useState } from 'react';
import { FlatList, View } from 'react-native-web';

export default function App(){
  // transactions->empty array to track transactions
  //setTransactions-> function to update the array
  const [transactions, setTransactions]=useState([]);
  
  //function takes an object transaction and adds it 
  const addTransaction=(transaction)=>{
    //takes the prev array, inserts the transaction in the front
    //prev is not built in. it works becuase of useState
    setTransactions((prev)=>[transaction,...prev]);
  };

  //reduce calculates the total sum from the list
  const totalBalance=transactions.reduce((total,tx)=>{
    return tx.type=='income'? total+tx.amount:
                              total-tx.amount;
  }, 0);
  //initial value=0

  return (
    <View style = {styles.container}>
      <Text style = {styles.title}>
        Fare Bean
      </Text>
      <Text style = {styles.balance}>
        Current Balance: BDT {totalBalance.toFixed(2)}
        {/* rounds to 2 decimal place and returns as string */}
      </Text>

      {/* Taking transaction input 
          onAdd is a custom prop, not built in
          it calls addTransaction function*/}
      <TransactionInput onAdd={addTransaction}/>
      <FlatList data={transactions}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
          <Text style={{color: item.type === 'income'? 'green': 'red'}}>
            {item.date}: {item.description} - {item.type === 'income' ? '+' : '-'}
            BDT {item.amount}
          </Text>
        )}
      />
    </View>
  );
}