import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { FlatList } from 'react-native';

//npx expo install expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';



import TransactionInput from './components/TransactionInput';

export default function App(){

  const [transactions_list, setTransactions]=useState([]);
  //transactions array, declared empty
  //setTransactions is called to update it

  const addTransactions =(curren_transaction)=>{
    setTransactions((prev)=>[curren_transaction, ...prev]);
  };
    //recent transaction is added in front of the previous
    //prev works because of useState

    const totalBalance=transactions_list.reduce((total, transaction)=>{
      //reduce calculates sum 
      return transaction.type=='income'? total+transaction.amount
                                        : total-transaction.amount;
    }, 0);
    //reduce takes two parameter. One is the above part, 
    //other is total's initial value


    return(
    //gradient cannot be in stylesheet
    //view is not needed if LG is used
    <LinearGradient colors={['#00B4AA', '#007C88']} style={styles.container}>
          <Text style={styles.title}>
            Fare Bean
          </Text>
          <Text style={styles.heading}>
            Save Up and Buy Coffee
          </Text>
          <Text style={styles.balanceStyle}>
            Current Balance: BDT {totalBalance.toFixed(2)}
            {/* 2 decimal places */}
          </Text>


          {/* Transaction inputs */}
          <TransactionInput onAdd={addTransactions}/>
          {/* onAdd is a custom prop */}
          <FlatList data={transactions_list} 
          // to render scrollable list. Only renders what's visible on screen
                    keyExtractor={(item)=>item.id}

                    //defining how every item will be displayed:
                    renderItem={({item})=>(
                      <Text style={{color: item.type==='income'? 'green': 'red'}}>
                          {item.date}: {item.description} - {item.type==='income'? '+' : '-'}
                          BDT {item.amount}
                      </Text>  
                    )}
          />
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
    // alignItems: 'center',
    // justifyContent: 'center',
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
})



//colors used:
//aqua green: #00B4AA
// deep teal-blue: #007C88
// soft black: #333333
// accent blue-green:#02D2C8
// light gray: #E0E0E0
// medium-dark gray: #707070