import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDataContext } from "../../context/DataContext";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export const ExtraSpend = () => {
  const {
    data,
    loading,
    error,
    apiUrl,
    selectedSheet,
    refreshing,
    handleRefresh,
    setLoading,
    extraSpends,
    setExtraSpends,
    personNames
  } = useDataContext();

  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setExtraSpends((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleUpdate = async (name) => {
    setLoading(true);
    const amount = parseFloat(extraSpends[name]);

    if (isNaN(amount)) {
      console.warn("Invalid amount for", name);
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount. Like 1000, 520",
        [{ text: "OK" }]
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/extra?sheetName=${selectedSheet}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, amount }),
        }
      );
      const data = await response.json();
      // console.log(data);
      Alert.alert("Success", data.message, [{ text: "OK" }]);
      setLoading(false);
      handleRefresh();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require("../../assets/json/notfound.json")}
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.noDataText}>No data available</Text>
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SettingMain")}
      >
        <Text style={styles.backButtonText}>Back to Settings</Text>
      </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Extra Spend of {data?.basicData?.month}
        </Text>
      </View>

      <ScrollView
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.boldCell]}>Name</Text>
            <Text style={[styles.cell, styles.boldCell]}>Amount</Text>
            <Text style={[styles.cell, styles.boldCell]}>Action</Text>
          </View>

          {personNames.slice(1).map(
            (name) => (
              <View key={name} style={styles.tableRow}>
                <Text style={styles.cell}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Text>
                <TextInput
                  style={[styles.cell, styles.input]}
                  keyboardType="numeric"
                  value={extraSpends[name]}
                  onChangeText={(text) => handleChange(name, text)}
                  placeholder="Enter amount"
                />
                <TouchableOpacity
                  style={[styles.cell, styles.updateBtn]}
                  onPress={() => handleUpdate(name)}
                >
                  <Text style={styles.updateBtnText}>Update</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
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
    paddingVertical: 4,
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
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    margin: 10,
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
});
