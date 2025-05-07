import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

import { useDataContext } from "../../context/DataContext";

export const Analytics = () => {
  const {
    data,
    loading,
    error,
    selectedValue,
    setSelectedValue,
    values,
    selectedData,
  } = useDataContext();
  const [chartData, setChartData] = useState([]);
  const [isZero, setIsZero] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (!data) return;
    if (selectedData) {
      const colors = [
        "#F44336",
        "#2196F3",
        "#FF9800",
        "#4CAF50",
        "#9C27B0",
        "#03f4b4",
        "#8BC34A",
        "#FFEB3B",
        "#FF5722",
        "#00BCD4",
      ];

      const newData = Object.entries(selectedData)
        .slice(1)
        .map(([key, value], index) => {
          const amount = parseFloat(value.replace(/[৳,]/g, "")) || 0;
          const color = colors[index % colors.length];
          return {
            label: key,
            dataPointText: amount,
            topLabelComponent: () => (
              <Text style={{ color: "#808080", fontSize: 12, marginTop: 6 }}>
                {amount}
              </Text>
            ),
            value: amount,
            frontColor: color,
            text: `${key}\n${amount}`, // Optional: custom label
          };
        });
      const isZero = newData.every((item) => item.value === 0);

      setIsZero(isZero);
      setChartData(newData);
    }
  }, [selectedData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <View style={styles.noContainer}>
        <LottieView
          source={require("../../assets/json/notfound.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.noDataText}>
          {error ? "Error: " + error : "No Basic Data Available"}
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => {
              setSelectedValue(itemValue);
            }}
            style={styles.picker}
            dropdownIconColor={"#000"}
          >
            {values.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
        </View>
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
        <Text style={styles.title}>Analytics</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            setSelectedValue(itemValue);
          }}
          style={styles.picker}
          dropdownIconColor={"#000"}
        >
          {values.map((value) => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
      </View>

      {isZero ? (
        <View style={styles.noContainer}>
          <LottieView
            source={require("../../assets/json/notfound.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.noDataText}>No Data Available</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.chartContainer}>
          <Text style={styles.chartTitle}>Pie Chart</Text>
          <PieChart
            data={chartData}
            radius={120}
            innerRadius={40}
            showValuesAsLabels
            showText
            fontSize={10}
          />
          <Text style={styles.chartTitle}>Bar Chart</Text>
          <BarChart
            data={chartData}
            barWidth={22}
            frontColor="#03A791"
            yAxisTextStyle={{ color: "#888" }}
            xAxisLabelTextStyle={{ color: "#888" }}
          />
          <Text style={styles.chartTitle}>Line Chart</Text>
            <LineChart
              areaChart
              curved
            data={chartData}
            yAxisTextStyle={{ color: "#808080" }}
            xAxisLabelTextStyle={{ color: "#888" }}
            dataPointsColor="#f90202"
            color="#03A791"
            animateOnDataChange
            startFillColor="rgb(46, 217, 255)"
            startOpacity={0.8}
            endFillColor="rgb(203, 241, 250)"
            endOpacity={0.3}
          />
          <Text></Text>
        </ScrollView>
      )}

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
  chartContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
    backgroundColor: "#03A791",
    paddingVertical: 10,
    width: "50%",
  },
});
