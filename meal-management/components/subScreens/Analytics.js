import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { useDataContext } from "../../context/DataContext";

export const Analytics = () => {
  const {
    data,
    loading,
    error,
    refreshing,
    handleRefresh,
    selectedValue,
    setSelectedValue,
    values,
    selectedData,
  } = useDataContext();
  const [screenWidth, setScreenWidth] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [lineChartLabels, setLineChartLabels] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const { width } = Dimensions.get("window");
    setScreenWidth(width);
  }, []);

  useEffect(() => {
    if (selectedData) {
      setLineChartLabels([]);
      setLineChartData([]);
      // Convert the object into an array of key-value pairs and process
      const dataArray = Object.entries(selectedData)
        .slice(1)
        .map(([name, value], index) => {
          const colors = [
            "rgba(214, 11, 102, 1)",
            "#F00",
            "#fb01ff",
            "rgb(0, 0, 255)",
            "rgb(16, 223, 130)",
            "#8073e5",
            "#d8d107",
            "#d900ff",
            "#90CAF9",
          ];
          const color = colors[index % colors.length];
          // Remove '৳' and ',' and convert to number
          const numericValue = Number(value.replace(/[৳,]/g, ""));
          const validValue = isNaN(numericValue) ? 0 : numericValue;

          setLineChartLabels((prev) => [...prev, name]);
          setLineChartData((prev) => [...prev, validValue]);

          return {
            name: name,
            population: validValue,
            color: color,
            legendFontColor: "#808080",
            legendFontSize: 15,
          };
        });
      // console.log("data", dataArray);
      setChartData(dataArray);
    } else {
      setChartData([]);
      setLineChartLabels([]);
      setLineChartData([]);
    }
  }, [selectedData]);

  const chartConfig = {
    backgroundGradientFrom: "#1E293B",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#1E293B",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.8,
    propsForLabels: {
      fill: "#000",
    },
    propsForLegend: {
      fill: "#000",
    },
  };
  const navigation = useNavigation();

  console.log(lineChartLabels);
  console.log(lineChartData);

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
        >
          {values.map((value) => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
      </View>
      <View style={{ flex: 1, height: 400 }}>
        <PieChart
          data={chartData.length > 0 ? chartData : []}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 50]}
          style={{ flex: 1 }}
        />
      </View>
      {/* <View style={{ backgroundColor: "#f0f4c3" }}>
        <LineChart
          data={{
            labels: lineChartLabels.length > 0 ? lineChartLabels : [],
            datasets: [
              {
                data: lineChartData.length > 0 ? lineChartData : [],
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          backgroundColor={"#f0f4c3"} //Added background color
        />
      </View> */}
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
    borderEndEndRadius: 10,
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

export default Analytics;

