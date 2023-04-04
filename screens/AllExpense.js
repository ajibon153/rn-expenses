import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/Expenses/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import { fetchExpenses } from '../utils/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

export default function AllExpense({ navigation, route }) {
  const [isFetching, setIsFetching] = useState(true);
  const [Error, setError] = useState(false);
  const expenseCtx = useContext(ExpensesContext);

  useEffect(() => {
    loadData();
    async function loadData() {
      setIsFetching(true);
      try {
        let res = await fetchExpenses();
        expenseCtx.setExpense(res);
      } catch (error) {
        setError('Could not fetch expenses');
      }
      setIsFetching(false);
    }
  }, [navigation, route]);

  if (!isFetching && Error)
    return <ErrorOverlay messsage={Error} onConfirm={() => setError(null)} />;

  if (isFetching) return <LoadingOverlay />;

  return (
    <ExpensesOutput
      // expenses={DataFetchExpenses}
      expenses={expenseCtx.expenses}
      expensesPeriod={'Total'}
      fallbackText={'No expenses registered found!'}
    />
  );
}

const styles = StyleSheet.create({});
