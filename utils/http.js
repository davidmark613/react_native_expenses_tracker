import axios from "axios";

const BACKEND_URL = "[YOUR_FIREBASE_URL]";

export async function storeExpense(expenseData) {
  const response = await axios.post(`${BACKEND_URL}/expenses.json`, expenseData);
  return response.data.name;
}

export async function fetchExpenses() {
  const response = await axios.get(`${BACKEND_URL}/expenses.json`);
  const expenses = [];

  for (const key in response.data) {
    expenses.push({
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    });          
  }

  return expenses;
}

export function updateExpenseRequest(id, expenseData) {
  return axios.put(`${BACKEND_URL}/expenses/${id}.json`, expenseData);
}

export function removeExpenseRequest(id) {
  return axios.delete(`${BACKEND_URL}/expenses/${id}.json`);
}
