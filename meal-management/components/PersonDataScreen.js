import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { captureRef } from "react-native-view-shot";

export const PersonDataScreen = ({ data, loading, error }) => {
    const [selectedPerson, setSelectedPerson] = useState('Select Person');
    const [personData, setPersonData] = useState(null);
    const [personNames, setPersonNames] = useState(["Select Person", "shaikat", "ajoy", "shanto", "himel", "pranto", "Somir"]);
    const viewRef = useRef(null);

    const captureView = async () => {
        try {
            const uri = await captureRef(viewRef, {
                format: "png",
                quality: 0.8,
            });
            const permission = await MediaLibrary.requestPermissionsAsync();
            if (permission.granted) {
                const asset = await MediaLibrary.createAssetAsync(uri);
                console.log("Image saved to gallery:", asset);
            } else {
                console.log("Permission to access media library denied");
            }
        } catch (error) {
            console.error("Error capturing view:", error);
        }
    }
    
  
    useEffect(() => {
      if (selectedPerson) {
            setPersonData(data[selectedPerson]);
        }
    }, [selectedPerson])
  
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
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error.message}</Text>
          </View>
        );
      }
  
    if (!data || Object.keys(data).length === 0 || !personData) {
      return (
        <View style={styles.noContainer}>
          <Text style={styles.noDataText}>No Person Data Available</Text>
          <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={(itemValue) => {
              setSelectedPerson(itemValue);
            }}
            style={styles.picker}
          >
            {personNames.map((personName) => (
              
              <Picker.Item key={personName} label={personName} value={personName} />
            ))}
          </Picker>
        </View>
        </View>
      );
    }
  
  
  
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Person Data</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPerson}
            onValueChange={(itemValue) => {
              setSelectedPerson(itemValue);
            }}
            style={styles.picker}
          >
            {personNames.map((personName) => (
              
              <Picker.Item key={personName} label={personName} value={personName} />
            ))}
          </Picker>
        </View>
  
        <ScrollView ref={viewRef}>
        {personData && (
          <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>
             Name: {selectedPerson.charAt(0).toUpperCase() + selectedPerson.slice(1)}
            </Text>
            <Text style={styles.itemTitle}>
            Extra Spend: {personData.extraSpend}
          </Text>
          <Text style={styles.itemTitle}>
            Meal Cost: {personData.mealCost}
          </Text>
          <Text style={styles.itemTitle}>
           House Wifi: {personData.houseWifi}
          </Text>
          <Text style={styles.itemTitle}>
            Didi: {personData.didi}
          </Text>
          <Text style={styles.itemTitle}>
            Total: {personData.total}
          </Text>
          <Text style={styles.itemTitle}>
            Total Extra: {personData.totalExtra}
          </Text>
          <Text style={styles.itemTitle}>
            Debit Credit: {personData.debitCredit}
          </Text>
          <Text style={styles.itemTitle}>
            Total Meal: {personData.totalMeal}
          </Text>
          <Text style={styles.itemTitle}>
            Total Bazar: {personData.totalBazar}
              </Text>
              
        </View>
                )}
                
            </ScrollView>
            <TouchableOpacity onPress={captureView}>
                    <Text style={styles.text}>Download</Text>
                </TouchableOpacity>
      </View>
    );
};
  
const styles = StyleSheet.create({
    noContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
    container: {  
      flex: 1,
      alignItems: "center",
    },
    titleContainer: {
      alignItems: "center",
      paddingVertical: 20,
      borderRadius: 10,
      backgroundColor: "#FFDEDE",
      width: "90%",
      marginHorizontal: 20,
      marginTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#FF0B55",
    },
    itemContainer: {
      padding: 10,
      marginTop: 10,
    },
    itemTitle: {
      fontSize: 24,
      marginBottom: 10,
      color: "#333",
      borderColor: "#FF0B55",
      borderBottomWidth: 1,
      paddingBottom: 5,
      borderRadius: 15,
      paddingLeft: 15,
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
      height: 50,
      borderWidth: 1,
      borderColor: '#C1C0B9',
      borderRadius: 4,
      marginBottom: 20,
      marginTop: 10,
    },
    picker: {
      flex: 1,
    },
  });