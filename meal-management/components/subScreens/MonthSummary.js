import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDataContext } from "../../context/DataContext";

export const MonthSummary = () => {
  const { data, loading, error, refreshing, handleRefresh, selectedValue, setSelectedValue, values, selectedData } = useDataContext();
  const navigation = useNavigation();
    
    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading data...</Text>
          </View>
        );
      }

  if (!data) {
    return (
      <View style={styles.noContainer}>
        <LottieView
          source={require("../../assets/json/notfound.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.noDataText}>No Basic Data Available</Text>
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
        <Text style={styles.title}>Summary Data of {data?.basicData?.month}</Text>
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
      <ScrollView
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {selectedData && (
          <View style={styles.tableContainer}>
            {Object.keys(selectedData).map((key, index) => (
              <View style={styles.tableRow} key={key}>
                <Text
                  style={[
                    styles.cell,
                    index === 0 ? styles.boldCell : undefined,
                  ]}
                >
                  {key}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    index === 0 ? styles.boldCell : undefined,
                  ]}
                >
                  {selectedData[key]}
                </Text>
              </View>
            ))}
          </View>
        )}
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
