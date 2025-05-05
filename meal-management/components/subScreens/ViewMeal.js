
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDataContext } from "../../context/DataContext";
import { useNavigation } from "@react-navigation/native";

export const ViewMeal = () => {
  const { selectedSheet, loading, error, data, mealTableData } = useDataContext();

  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Meal Data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>View Meal Table</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>View Meal Table</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No meal data available.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>View Meal Table of {selectedSheet}</Text>
      </View>
      <ScrollView style={styles.tableContainer}>
        {mealTableData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
          {item.map((subItem, subIndex) => (
            
            <Text style={index === 0 ? styles.boldCell : styles.cell}>{subIndex === 0 ? subItem.split('-').slice(0,-1).join('-') : subItem}</Text>
          
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
  container: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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
    width: "90%",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FF0B55",
    alignItems: "center",
    flexWrap: "wrap",
  },
  cell: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 5,
  },
  boldCell: {
    fontWeight: "bold",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
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
