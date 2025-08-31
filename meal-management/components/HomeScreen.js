import { Picker } from "@react-native-picker/picker";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDataContext } from "../context/DataContext";
import { format } from "date-fns";

export const HomeScreen = () => {
  const {
    data,
    loading,
    error,
    sheets,
    selectedSheet,
    setSelectedSheet,
    handleRefresh,
    refreshing,
    bazarListData,
  } = useDataContext();


function getCurrentAndNextPerson(date = new Date()) {

  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = Jan, 1 = Feb, ...)
  const day = date.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get last day of current month
  const pairIndex = Math.floor((day - 1) / 5);
  const currentIndex = pairIndex % bazarListData.length;
  const nextIndex = (currentIndex + 1) % bazarListData.length;

  const startDay = pairIndex * 5 + 1;
  const endDay = Math.min(startDay + 4, daysInMonth);
  const monthName = format(date, 'MMMM');

  return {
    current: bazarListData[currentIndex],
    next: bazarListData[startDay >= 26 ? 2 : nextIndex],
    dateRange: `${daysInMonth === 31 && startDay >= 26 ? "26" : startDay}–${daysInMonth === 31 && startDay >= 26 ? "31" : endDay} ${monthName}`,
  };
}


  const { current, next, dateRange } = getCurrentAndNextPerson();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  //   if (error) {
  //     return (
  //       <View style={styles.errorContainer}>
  //         <Text style={styles.errorText}>Error: {error.message}</Text>
  //       </View>
  //     );
  //   }


  if (error || !data || !data.basicData) {
    return (
      <View style={styles.noContainer}>
        <LottieView
          source={require("../assets/json/notfound.json")} // your .json file
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.noDataText}>No Basic Data Available</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSheet}
            onValueChange={(itemValue) => {
              setSelectedSheet(itemValue);
            }}
            style={styles.picker}
            dropdownIconColor={"#000"}
          >
            {sheets.map((sheet) => (
              <Picker.Item key={sheet} label={sheet} value={sheet} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Basic Data</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSheet}
          onValueChange={(itemValue) => {
            setSelectedSheet(itemValue);
          }}
          style={styles.picker}
          dropdownIconColor={"#000"}
        >
          {sheets.map((sheet) => (
            <Picker.Item key={sheet} label={sheet} value={sheet} />
          ))}
        </Picker>
      </View>
      <ScrollView
        style={{ width: "100%", marginBottom: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Month</Text>
            <Text style={styles.cell}>{data.basicData.month}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Total Meal</Text>
            <Text style={styles.cell}>{data.basicData.totalMeal}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Total Bazar</Text>
            <Text style={styles.cell}>{data.basicData.totalBazar}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Total Extra Cost</Text>
            <Text style={styles.cell}>{data.basicData.totalExtraSpend}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Dokan</Text>
            <Text style={styles.cell}>{data.basicData.dokan}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Per Meal Cost</Text>
            <Text style={styles.cell}>{data.basicData.perMeal}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Extra Per Head</Text>
            <Text style={styles.cell}>{data.basicData.extraPer}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.containerCard}>
        <Text style={styles.cardTitle}>Bazar Schedule ({dateRange})</Text>

        <View style={styles.card}>
          <Text style={styles.label}>🧍 Current in Line</Text>
          <Text style={styles.nameCurrent}>{current}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>⏭️ Next in Line</Text>
          <Text style={styles.nameNext}>{next}</Text>
        </View>
      </View>
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe0e0",
    padding: 20,
  },
  errorText: {
    color: "#FF0B55",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    margin: 6,
    fontSize: 14,
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
    margin: 16,
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
  containerCard: {
    padding: 10,
    backgroundColor: "#F9FAFB",
    width: "90%",

  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#03A791",
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 8,
  },
  nameCurrent: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2563EB",
  },
  nameNext: {
    fontSize: 24,
    fontWeight: "600",
    color: "#10B981",
  },
});
