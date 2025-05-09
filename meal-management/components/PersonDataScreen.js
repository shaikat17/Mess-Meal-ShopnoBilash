import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import LottieView from "lottie-react-native";
import { useDataContext } from "../context/DataContext";

export const PersonDataScreen = () => {
  const { data, loading, error, refreshing, handleRefresh, selectedPerson, setSelectedPerson, personData, personNames } = useDataContext();
  const viewRef = useRef(null);

  const captureView = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
        fileName: data?.basicData.month + " " + selectedPerson,
      });
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        Alert.alert(
          "Image Saved",
          "The image has been saved to your gallery.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access the media library.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error capturing view:", error);
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

  //   if (error) {
  //     return (
  //       <View style={styles.errorContainer}>
  //         <Text style={styles.errorText}>Error: {error.message}</Text>
  //       </View>
  //     );
  //   }

  if (error || !data || Object.keys(data).length === 0 || !personData) {
    return (
      <View style={styles.noContainer}>
        <LottieView
          source={require("../assets/json/notfound.json")} // your .json file
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.noDataText}>Select a Person to view data</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={(itemValue) => {
              setSelectedPerson(itemValue);
            }}
            style={styles.picker}
            dropdownIconColor={"#000"}
          >
            {personNames.map((personName) => (
              <Picker.Item
                key={personName}
                label={personName}
                value={personName}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {selectedPerson === "Select Person"
            ? "Select Person"
            : "Data of " +
              selectedPerson.charAt(0).toUpperCase() +
              selectedPerson.slice(1)}
        </Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPerson}
          onValueChange={(itemValue) => {
            setSelectedPerson(itemValue);
          }}
          style={styles.picker}
          dropdownIconColor={"#000"}
        >
          {personNames.map((personName) => (
            <Picker.Item
              key={personName}
              label={personName}
              value={personName}
            />
          ))}
        </Picker>
      </View>

      <ScrollView
        ref={viewRef}
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {personData && (
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Name</Text>
              <Text style={styles.cell}>
                {selectedPerson.charAt(0).toUpperCase() +
                  selectedPerson.slice(1)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Month</Text>
              <Text style={styles.cell}>{data.basicData.month}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Total Meal</Text>
              <Text style={styles.cell}>{personData.totalMeal}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Extra Cost</Text>
              <Text style={styles.cell}>{personData.extraSpend}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Total Meal Cost</Text>
              <Text style={styles.cell}>{personData.mealCost}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>House and Wifi Cost</Text>
              <Text style={styles.cell}>{personData.houseWifi}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Didi</Text>
              <Text style={styles.cell}>{personData.didi}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Total Cost</Text>
              <Text style={styles.cell}>{personData.total}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Total Cost With Extra</Text>
              <Text style={styles.cell}>{personData.totalExtra}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>Total Bazar</Text>
              <Text style={styles.cell}>{personData.totalBazar}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>
                {personData.debitCredit <= 0 ? "Credit" : "Debit"}
              </Text>
              <Text style={styles.cell}>{personData.debitCredit}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity onPress={captureView} style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>Download</Text>
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
  tableContainer: {
    margin: 16,
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#FF0B55",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  cell: {
    flex: 1,
    fontSize: 16,
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
    color: "#ff0000",
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
  downloadButton: {
    backgroundColor: "#03A791",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
