import React from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default class TransactionInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      amount: '',
      type: 'income',
    };
  }

  handleAdd = () => {
    const { description, amount, type } = this.state;
    const { onAdd } = this.props;

    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString(),
    };

    onAdd(newTransaction);

    this.setState({
      description: '',
      amount: '',
    });
  };

  render() {
    const { description, amount, type } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={(text) => this.setState({ description: text })}
          style={styles.input}
        />

        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => this.setState({ amount: text })}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => this.setState({ type: 'income' })}
            style={[styles.toggleButton, type === 'income' && styles.active]}>
            <Text style={styles.toggleText}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({ type: 'expense' })}
            style={[styles.toggleButton, type === 'expense' && styles.active]}>
            <Text style={styles.toggleText}>Expense</Text>
          </TouchableOpacity>
        </View>

        <Button title="Add Transaction" onPress={this.handleAdd} />
      </View>
    );
  }
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
