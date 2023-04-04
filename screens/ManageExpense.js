import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useLayoutEffect, useState } from 'react';
import { GlobalStyles } from '../constants/style';
import IconButton from '../components/UI/IconButton';
import Button from '../components/UI/button';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { deleteExpenses, storeExpenses, updateExpenses } from '../utils/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';

export default function ManageExpense({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Error, setError] = useState(false);
  const editedExpensesId = route.params?.expenseId;
  const isEditing = !!editedExpensesId;

  const expenseCtx = useContext(ExpensesContext);

  const selectedExpense = expenseCtx.expenses.find(
    (exp) => exp.id === editedExpensesId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expenses' : 'Add Expenses',
    });
  }, [route, isEditing]);

  async function deleteHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpenses(editedExpensesId);
      expenseCtx.deleteExpense(editedExpensesId);
      navigation.goBack();
    } catch (error) {
      setError('Could not fetch expenses');
      setIsSubmitting(false);
    }
  }
  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expensesData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateExpenses(editedExpensesId, expensesData);
        expenseCtx.updateExpense(editedExpensesId, expensesData);
      } else {
        const id = await storeExpenses(expensesData);
        expenseCtx.addExpense({ ...expensesData, id });
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not fetch expenses');
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) return <LoadingOverlay />;
  if (!isSubmitting && Error)
    return <ErrorOverlay message={Error} onConfirm={() => setError(null)} />;

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onCancel={cancelHandler}
        onConfirm={confirmHandler}
        defaultValues={selectedExpense}
      />
      <View style={styles.deleteContainer}>
        {isEditing && (
          <IconButton
            icon='trash'
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteHandler}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});
