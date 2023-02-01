import { createContext, useReducer } from "react";
import uuid from "react-native-uuid";

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  setExpenses: (expenses) => {},
  removeExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

function expensesReduser(state, action) {
  switch (action.type) {
    case "ADD":
      const id = uuid.v4();
      return [{ ...action.payload, id: id }, ...state];
    case "SET":
      const reversed = action.payload.reverse();
      return reversed;
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
  const [expensesState, dispatch] = useReducer(expensesReduser, []);

  function addExpenseHandler(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function setExpensesHandler(expenses) {
    dispatch({ type: "SET", payload: expenses });
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
    setExpenses: setExpensesHandler,
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
