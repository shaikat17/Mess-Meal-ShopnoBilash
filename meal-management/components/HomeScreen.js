import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export const HomeScreen = ({ data, loading, error }) => {
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
  
    if (!data || !data.basicData) {
      return (
        <View style={styles.noContainer}>
          <Text style={styles.noDataText}>No Basic Data Available</Text>
        </View>
      );
    }
  
  
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Basic Data</Text>
        </View>
        <ScrollView>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>Month: {data.basicData.month}</Text>
            <Text style={styles.itemTitle}>
              Total Meal: {data.basicData.totalMeal}
            </Text>
            <Text style={styles.itemTitle}>
              Total Bazar: {data.basicData.totalBazar}
            </Text>
            <Text style={styles.itemTitle}>
              Total Extra Spend: {data.basicData.totalExtraSpend}
            </Text>
            <Text style={styles.itemTitle}>Babul Vai: {data.basicData.babulVai}</Text>
            <Text style={styles.itemTitle}>Per Meal: {data.basicData.perMeal}</Text>
            <Text style={styles.itemTitle}>Extra Per: {data.basicData.extraPer}</Text>
          </View>
        </ScrollView>
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