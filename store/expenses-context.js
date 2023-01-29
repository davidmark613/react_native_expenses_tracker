import { createContext, useState, useReducer } from "react";
import uuid from "react-native-uuid";

const DUMMY_EXPENSES = [
  {
    id: "e1",
    description: "A pair of shoes",
    amount: 59.99,
    date: new Date("2021-12-19"),
  },
  {
    id: "e2",
    description: "A pair of trousers",
    amount: 89.99,
    date: new Date("2022-01-05"),
  },
  {
    id: "e3",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2021-12-01"),
  },
  {
    id: "e4",
    description: "A book",
    amount: 18.59,
    date: new Date("2022-02-18"),
  },
  {
    id: "e5",
    description: "Another book",
    amount: 14.99,
    date: new Date("2022-02-19"),
  },
  {
    id: "e6",
    description: "A pair of shoes",
    amount: 59.99,
    date: new Date("2023-01-25"),
  },
  {
    id: "e7",
    description: "A pair of trousers",
    amount: 89.99,
    date: new Date("2022-01-05"),
  },
  {
    id: "e8",
    description: "Some bananas",
    amount: 5.99,
    date: new Date("2023-01-28"),
  },
  {
    id: "e9",
    description: "A book",
    amount: 18.59,
    date: new Date("2022-02-18"),
  },
  {
    id: "e10",
    description: "Another book",
    amount: 14.99,
    date: new Date("2022-02-19"),
  },
];

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  removeExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

function expensesReduser(state, action) {
  switch (action.type) {
    case "ADD":
      const id = uuid.v4();
      return [{ ...action.payload, id: id }, ...state];
    case "UPDATE":
      const idx = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const currentExpense = state[idx];
      const updatedExpense = { ...currentExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[idx] = updatedExpense;
      return updatedExpenses;
    case "REMOVE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReduser, DUMMY_EXPENSES);

  function addExpenseHandler(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function updateExpenseHandler(expenseId, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: expenseId, data: expenseData } });
  }

  function removeExpenseHandler(expenseId) {
    dispatch({ type: "REMOVE", payload: expenseId });
  }

  const value = {
    expenses: expensesState,
    addExpense: addExpenseHandler,
    removeExpense: removeExpenseHandler,
    updateExpense: updateExpenseHandler,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
