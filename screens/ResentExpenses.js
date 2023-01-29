import { useContext } from "react";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../utils/date";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";

function ResentExpenses() {
  const { expenses } = useContext(ExpensesContext);

  const resentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date >= date7DaysAgo && expense.date <= today;
  });

  return (
    <ExpensesOutput
      expenses={resentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="No expenses registered for the last 7 days!"
    />
  );
}

export default ResentExpenses;
