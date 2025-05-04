import React, { useState, useCallback } from "react";
// import { Button } from 'react-native-elements';
import DateTimePicker from "@react-native-community/datetimepicker"; // Import the date time picker
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { format, set } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { useDataContext } from "../../context/DataContext";

export const AddMeal = () => {
    const { personNames, apiUrl, selectedSheet, loading, setLoading } = useDataContext();
  const [date, setDate] = useState(new Date()); // Initialize with a default date
  const [name, setName] = useState("");
  const [numOfMeal, setnumOfMeal] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
 

  const navigation = useNavigation();

    const handleAddMeal = useCallback(async () => {
    if (!date) {
      Alert.alert("Error", "Please select a date.");
      return;
    }
    if (!name) {
      Alert.alert("Error", "Please enter a name.");
      return;
    }
        console.log(numOfMeal)
    if (numOfMeal < 0) {
      Alert.alert("Error", "Please enter a valid number of meals.");
      return;
    }
        setLoading(true);
    const formattedDate = format(date, "d-MMM-yyyy");
      try {
        const response = await fetch(
          `${apiUrl}/addmeal?sheetName=${selectedSheet}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ date:formattedDate, name, numOfMeal }),
          }
        );
          const data = await response.json();
          Alert.alert("Success", data.message, [{ text: "OK" }]);
          setLoading(false);
      } catch (error) {
          console.error(error);
          Alert.alert("Error", error.error, [{ text: "OK" }]);
          setLoading(false);
      }
    setDate(new Date());
    setName("");
    setnumOfMeal(undefined);
  }, [date, name, numOfMeal]);

    const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (Platform.OS === "ios") {
      // For iOS, the date picker doesn't automatically close
      setShowDatePicker(false);
    }

        if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };
    
    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading data...</Text>
          </View>
        );
      }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add Meal</Text>
      </View>

      {/* Date Picker */}
      <View style={styles.dateNameContainer}>
        <View style={styles.dateContainer}>
          <View>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerButtonText}>Select Date</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
                              style={styles.datePicker}
              />
            )}
          </View>
          <View>
            {date && (
              <Text style={styles.selectedDateText}>
                Selected Date: {format(date, "PPP")}
              </Text>
            )}
          </View>
        </View>
        {/* Person Name Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={name}
            onValueChange={(itemValue) => setName(itemValue)}
            style={styles.picker}
          >
            {personNames.map((person) => (
              <Picker.Item key={person} label={person} value={person} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Number of Meals Input */}
      <View style={styles.mealNumberContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Meals</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={numOfMeal === undefined ? "" : numOfMeal.toString()}
            onChangeText={(text) => setnumOfMeal(Number(text))}
            placeholder="Enter meal"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity
          style={[styles.datePickerButton, { marginTop: 25 }]}
          onPress={handleAddMeal}
        >
          <Text style={styles.datePickerButtonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SettingMain")}
      >
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 20,
    width: "90%",
    paddingHorizontal: 20,
  },
  dateContainer: {
    flexDirection: "column",
    marginTop: 18,
  },
  mealNumberContainer: {
    marginTop: 20,
    width: "90%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "medium",
    color: "#808080",
    marginBottom: 8,
  },
  inputContainer: {
    width: "50%",
  },
  selectedDateText: {
    fontSize: 12,
    color: "#808080",
    marginTop: 10,
  },
  datePickerButton: {
    backgroundColor: "#03A791",
    borderRadius: 6,
    padding: 10,
    textAlign: "center",
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#03A791",
    width: "100%",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  tableContainer: {
    borderRadius: 8,
    margin: 16,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FF0B55",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  boldCell: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 4,
    fontSize: 16,
    textAlign: "center",
  },
  updateBtn: {
    backgroundColor: "#03A791",
    padding: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  updateBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#03A791",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    width: 150,
    height: 50,
    borderWidth: 1,
    borderColor: "#C1C0B9",
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 10,
  },
  picker: {
    flex: 1,
    color: "#808080",
    fontSize: 16,
  },
});

export default AddMeal;
