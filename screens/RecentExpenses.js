import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ExpensesOutput from '../components/Expenses/ExpensesOutput';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../utils/date';
import { fetchExpenses } from '../utils/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

export default function RecentExpenses({ navigation, route }) {
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

  const recentExpenses = expenseCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date > date7DaysAgo && expense.date <= today;
  });

  if (!isFetching && Error)
    return <ErrorOverlay message={Error} onConfirm={() => setError(null)} />;
  if (isFetching) return <LoadingOverlay />;

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod={'Last7 Day'}
      fallbackText={'No expenses registered for last 7 days'}
    />
  );
}

const styles = StyleSheet.create({});
