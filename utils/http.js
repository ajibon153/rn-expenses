import axios from 'axios';

const baseUrl = 'https://teseatit.firebaseio.com';

export async function storeExpenses(expenseData) {
  let response = await axios.post(`${baseUrl}/expenses.json`, expenseData);
  const id = response.data.name;
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(`${baseUrl}/expenses.json`);
  const expense = [];

  Object.keys(response.data).forEach((key, i) => {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expense.push(expenseObj);
  });

  return expense;
}

export async function updateExpenses(id, expensesData) {
  return await axios.put(baseUrl + `/expenses/${id}.json`, expensesData);
}

export async function deleteExpenses(id) {
  return await axios.delete(baseUrl + `/expenses/${id}.json`);
}
