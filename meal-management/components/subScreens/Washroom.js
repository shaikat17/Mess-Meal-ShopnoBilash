import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDataContext } from "../../context/DataContext";
import { set } from "date-fns";

export const Washroom = () => {
  const [date, setDate] = useState("");
  const [nextPerson, setNextPerson] = useState("");
  const navigation = useNavigation();

  const { apiUrl, loading, setLoading } = useDataContext();

  const fetchNextPerson = async () => {
    try {
      const response = await fetch(`${apiUrl}/bathroom`);
      const result = await response.json();
      setNextPerson(result);
    } catch (error) {
      console.error("Error fetching next person:", error);
    }
  };
  const handleWashroom = async () => {
    if (!date) {
      Alert.alert("Error", "Please enter a date.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/bathroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      });

      // Check if the response status is OK (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        Alert.alert("Error", "Failed to add washroom data.");
        return;
      }

      // Parse the JSON response
      const data = await response.json();
      // console.log("Success:", data);
      setLoading(false);
      Alert.alert("Success", data.message || "Washroom data added.", [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Error adding person:", error);
      setLoading(false);
      Alert.alert("Error", "An error occurred while adding washroom data.");
    }
    setDate("");
    setLoading(false);
    fetchNextPerson();
  };

  useEffect(() => {
    fetchNextPerson();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Washroom Detais</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="11-Sep-25"
          keyboardType="default"
          value={date}
          onChangeText={(text) => setDate(text)}
        />
        <TouchableOpacity
          style={[styles.backButton, { marginLeft: 10, height: 40 }]}
          onPress={() => handleWashroom()}
        >
          <Text style={styles.backButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.nextPersonCard}>
        <Text style={styles.nextPersonTitle}>Next in Line</Text>
        <LottieView
          source={require("../../assets/json/bathroom.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.nextPersonName}>
          {nextPerson || "No data available"}
        </Text>
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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    width: "90%",
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
  nextPersonCard: {
    width: "90%",
    backgroundColor: "#E6F4F1",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  nextPersonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#03A791",
    marginBottom: 10,
  },

  nextPersonName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },

  lottie: {
    width: 120,
    height: 120,
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
