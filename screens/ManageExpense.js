import { useLayoutEffect, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ExpensesContext } from "../store/expenses-context";
import { GlobalStyles } from "../constants/styles";
import { storeExpense, updateExpenseRequest, removeExpenseRequest } from "../utils/http";
import IconButton from "../components/UI/IconButton";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addExpense, updateExpense, removeExpense, expenses } =
    useContext(ExpensesContext);
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;

  const selectedExpense = expenses.find((item) => item.id === expenseId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteHandler() {
    setIsLoading(true);
    try {
      await removeExpenseRequest(expenseId);
      removeExpense(expenseId);
      navigation.goBack();
    } catch (err) {
      setError("Could not delete expense - please try again later");
      setIsLoading(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsLoading(true);
    try {
      if (isEditing) {
        updateExpense(expenseId, expenseData);
        await updateExpenseRequest(expenseId, expenseData);
      } else {
        const expenseId = await storeExpense(expenseData);
        addExpense({ ...expenseData, id: expenseId });
      }
      navigation.goBack();
    } catch (err) {
      setError("Could not save data - please try again later");
      setIsLoading(false);
    }
  }

  function errorHandler() {
    setError(null);
  }

  if (error && !isLoading) {
    return <ErrorOverlay message={error} />
  }

  if (isLoading) {
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container}>
      <ExpenseForm 
        onCancel={cancelHandler} 
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
        submitButtonLabel={ isEditing ? "Update" : "Add" }
      />      
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

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
    alignItems: "center",
  },
});
