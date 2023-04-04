import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Input from './Input';
import Button from '../UI/button';
import { getFormattedDate } from '../../utils/date';
import { GlobalStyles } from '../../constants/style';

export default function ExpenseForm({
  submitButtonLabel,
  onCancel,
  onConfirm,
  defaultValues,
}) {
  const [Inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : '',
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : '',
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
    },
  });

  function InputtChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currVal) => ({
      ...currVal,
      [inputIdentifier]: { value: enteredValue, isValid: true },
    }));
  }

  function submitHandler(params) {
    const expenseData = {
      amount: +Inputs.amount.value,
      date: new Date(Inputs.date.value),
      description: Inputs.description.value,
    };

    const amountIsValid = !isNaN(expenseData.amount) || expenseData.amount > 0;
    const dateIsValid =
      new Date(expenseData.date).toString() !== 'Invalid Date';
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      // Alert.alert('Invalid input', 'Please check your input values');
      setInputs((currInput) => ({
        amount: { value: currInput.amount.value, isValid: amountIsValid },
        date: { value: currInput.date.value, isValid: dateIsValid },
        description: {
          value: currInput.description.value,
          isValid: descriptionIsValid,
        },
      }));
      return;
    }

    onConfirm(expenseData);
  }

  const formIsInvalid =
    Inputs.amount.isValid || Inputs.date.isValid || Inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Expenses</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label='Amount'
          invalid={!Inputs.amount.isValid}
          textInputConfig={{
            KeyboardType: 'decimal-pad',
            onChangeText: InputtChangeHandler.bind(this, 'amount'),
            value: Inputs.amount.value,
          }}
        />
        <Input
          style={styles.rowInput}
          label='Date'
          invalid={!Inputs.date.isValid}
          textInputConfig={{
            placeholder: 'YYYY-MM-DD',
            maxLength: 10,
            value: Inputs.date.value,
            onChangeText: InputtChangeHandler.bind(this, 'date'),
          }}
        />
      </View>

      <Input
        label='Description'
        invalid={!Inputs.description.isValid}
        textInputConfig={{
          onChangeText: InputtChangeHandler.bind(this, 'description'),
          value: Inputs.description.value,
          multiline: true,
          // autoCapitalize: 'none',
          // autoCorrect:false,
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}>
          Invalid input values - please check your entered data!
        </Text>
      )}
      <View style={styles.buttons}>
        <Button mode='flat' onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 24,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: { flex: 1 },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
