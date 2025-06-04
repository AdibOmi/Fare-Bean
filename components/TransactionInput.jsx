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
                <Text style={styles.toggleText}>Income</Text>
            </TouchableOpacity>

             <TouchableOpacity onPress={()=>setType('expense')}
            style={[styles.toggleButton, type==='expense' && styles.active]}>
                <Text style={styles.toggleText}>Expense</Text>
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
                <Text style={styles.addBtnText}>Add Transaction</Text>
           </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#007C88',
        paddingVertical: 50,
        paddingHorizontal: 100,
        // fixed height width
        // height: 250,
        // width: 370,

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
        backgroundColor:'rgb(4, 96, 105)',    
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
        backgroundColor: '#00B4AA',
    },
    buttonRow:{
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    
    addBtn:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor:'#00B4AA', 
        marginTop: 20,
        borderRadius: 5,
    },

    addBtnText:{
        color: 'white',
        fontSize: 20,
    },

});
