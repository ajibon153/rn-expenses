import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/Expenses/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import { fetchExpenses } from '../utils/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';

export default function AllExpense({ navigation, route }) {
  const [isFetching, setIsFetching] = useState(true);
  const expenseCtx = useContext(ExpensesContext);

  useEffect(() => {
    loadData();
    async function loadData() {
      setIsFetching(true);
      let res = await fetchExpenses();
      expenseCtx.setExpense(res);
      setIsFetching(false);
    }
  }, [navigation, route]);

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
