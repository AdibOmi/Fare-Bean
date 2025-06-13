import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

//temporarily not using database. Using local storage instead

export default function TransactionInput({onAdd}){
    const [type, setType]=useState('income');
    const [amount, setAmount]=useState('');
    const [description, setDescription]=useState('');

    const handleAdd = () =>{
        if(!amount) return;
        //description is optional anyway
        const newTransaction = {
            id: Date.now().toString(),
            description,
            amount: parseFloat(amount),
            //input is stored as string, so convert it
            type,
            date: new Date().toISOString().split('T')[0], //!!//
            //format based on device location
        };

        onAdd(newTransaction);
        setDescription('');
        setAmount('');
    };

    return(
        <View style = {styles.container}>

            <View style={styles.buttonRow}>
                 {/* Income or Expenditure */}
            <TouchableOpacity onPress={()=>setType('income')}
            style={[styles.toggleButton, type==='income' && styles.active]}>
                <Text style={[styles.toggleText, type === 'income' && { color: 'black' }]}>Income</Text>
            </TouchableOpacity>

             <TouchableOpacity onPress={()=>setType('expense')}
            style={[styles.toggleButton, type==='expense' && styles.active]}>
                <Text style={[styles.toggleText, type === 'expense' && { color: 'black' }]}>Expense</Text>
            </TouchableOpacity>
            </View>
           
           <KeyboardAvoidingView>
                <TextInput style={styles.input} placeholder="Amount"   placeholderTextColor="white"
                 value={amount} onChangeText={setAmount} keyboardType='numeric'/>
                <TextInput style={styles.descriptionStyle} placeholder='Description'  placeholderTextColor="white"
                value={description} onChangeText={setDescription}/>
           </KeyboardAvoidingView>

           {/* <Button title="Add Transaction" onPress={handleAdd} style={styles.addBtn} /> */}

           {/* the button wont work as in react native, buttons dont allow styles. Use this: */}

           <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={[styles.addBtnText, {color: 'black'}]}>Add Transaction</Text>
           </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20,
        backgroundColor: '#1877F2',
        paddingVertical: 30,
        paddingHorizontal: 100,
         width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    toggleButton:{
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 3, 
        marginHorizontal: 10, 
        backgroundColor:'#1877F2',    
    },
    
    toggleText:{
        color: 'white',
        fontSize: 20,
        
    },
    input:{
        color: 'white',
        fontSize: 20,
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        paddingBottom: 5,
        marginTop: 10,
    },
    descriptionStyle:{
        color: 'white',
        fontSize: 20,
        alignSelf: 'stretch',
        paddingHorizontal: 20,
        paddingTop: 5,
        
    },

    active: {
        backgroundColor: 'white',
        color: 'black',
    },
    buttonRow:{
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    
    addBtn:{
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor:'white', 
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 190,
    },

    addBtnText:{
        color: 'white',
        fontSize: 20,
    },

});
