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

export const HomeScreen = () => {
  const { data,
    loading,
    error,
    sheets,
    selectedSheet,
    setSelectedSheet,
    handleRefresh,
    refreshing } = useDataContext();
  
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
                    source={require('../assets/json/notfound.json')} // your .json file
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
          <ScrollView style={{ width: "100%" }} refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
      }>
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
            <Text style={styles.cell}>Babul Vai</Text>
            <Text style={styles.cell}>{data.basicData.babulVai}</Text>
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
});
