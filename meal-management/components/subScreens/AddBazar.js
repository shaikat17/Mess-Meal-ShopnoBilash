import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDataContext } from "../../context/DataContext";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export const AddBazar = () => {
  const navigation = useNavigation();

  const {
    selectedPerson,
    setSelectedPerson,
    personNames,
    selectedSheet,
    apiUrl,
    loading,
    setLoading,
    bazarTableData,
  } = useDataContext();

  const [amount, setAmount] = useState("");

  const handleAddBazar = async () => {
    if (selectedPerson === "Select Person") {
      Alert.alert("Error", "Please select a person.");
      return;
    }
    if (!selectedPerson || !amount || amount <= 1) {
      Alert.alert("Error", "Please select a person and enter a valid amount.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/addbazar?sheetName=${selectedSheet}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: selectedPerson, amount }),
        }
      );
      const data = await response.json();
      console.log(data);
      setLoading(false);
      Alert.alert("Success", data.message, [{ text: "OK" }]);
    } catch (error) {
      setLoading(false);
      console.error("Error adding bazar:", error);
    }
    setAmount("");
  };

  if (loading) {
    return (
      <View style={styles.noContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.noDataText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add Bazar</Text>
      </View>
      <View style={styles.inputwrapper}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={(itemValue) => {
              setSelectedPerson(itemValue);
            }}
            style={styles.picker}
            dropdownIconColor={"#000"}
          >
            {personNames.map((name) => (
              <Picker.Item key={name} label={name} value={name} />
            ))}
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />
          <TouchableOpacity
            style={[styles.backButton, { marginLeft: 10, height: 40 }]}
            onPress={() => handleAddBazar()}
          >
            <Text style={styles.backButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Bazar Table</Text>
              </View>
      <ScrollView style={styles.tableContainer}>
        {bazarTableData.map((item, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {Array.from({ length: 6 }).map((_, colIndex) => (
              <Text
                key={colIndex}
                style={
                  rowIndex === 0 || rowIndex === bazarTableData.length - 1
                    ? styles.boldCell
                    : styles.cell
                }
              >
                {item[colIndex] || "-"}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>

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
  noContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
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
    borderEndEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  inputwrapper: {
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#C1C0B9",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  noDataText: {
    margin: 10,
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
  pickerContainer: {
    width: 200,
    height: 60,
    borderWidth: 1,
    borderColor: "#C1C0B9",
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 10,
  },
  picker: {
    flex: 1,
    color: "#808080",
    fontSize: 12,
  },
  tableContainer: {
    borderRadius: 8,
    marginTop: 10,
    width: "90%",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FF0B55",
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  boldCell: {
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#03A791",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
