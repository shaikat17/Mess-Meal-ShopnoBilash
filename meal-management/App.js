import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants"; // Import Constants for status bar height
import { HomeScreen } from "./components/HomeScreen";
import { SettingsStack } from "./components/SettingsScreen";
import { PersonDataScreen } from "./components/PersonDataScreen";

const Tab = createBottomTabNavigator();

const App = () => {
  // Date functionality
  const monthsNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();
  const year = today.getFullYear();
  const lastTwoDigits = String(year).substring(2);
  const currentMonth = today.getMonth(); // Months are 0-indexed

  const currentData = monthsNames[currentMonth];
  const currentSheet = `${currentData} ${lastTwoDigits}`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(currentSheet);
  const [sheets, setSheets] = useState([
    "Select Sheet",
    "April 24",
    "May 24",
    "June 24",
    "July 24",
    "Aug 24",
    "Sep 24",
    "Oct 24",
    "Nov 24",
    "Dec 24",
    "Jan 25",
    "Feb 25",
    "March 25",
    "April 25",
    "May 25",
    "June 25",
    "July 25",
    "Aug 25",
    "Sep 25",
    "Oct 25",
    "Nov 25",
    "Dec 25",
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  // Replace with your actual API endpoint
  // http://192.168.1.11:5000/sheets
  // const apiUrl = "http://192.168.79.151:5000/sheets";
  const apiUrl = "https://meal-manage-back.vercel.app/sheets?sheetName="; // Replace with your actual API endpoint

  useEffect(() => {
    if (!selectedSheet || selectedSheet === "Select Sheet") {
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching data from API:", `${apiUrl}${selectedSheet}`); // Debug: Print the URL
        const response = await fetch(`${apiUrl}${selectedSheet}`);
        console.log("API response status:", response.data); // Debug: Print the response status

        if (!response.ok) {
          const errorText = await response.text(); // Get error message
          console.error("API error response:", errorText); // Debug: Print error
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Fetch error:", error); // Debug: Print the error
        setError(error);
      } finally {
        setLoading(false);
        setRefreshing(false); // Reset refreshing state
        console.log("Fetch completed"); // Debug: Print completion
      }
    };

    fetchData();
  }, [selectedSheet, refreshing]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false, // Hide the header for all screens
            tabBarStyle: {
              backgroundColor: "#FFDEDE",
              height: 60,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarActiveTintColor: "#FF0B55", // Active tab color
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Person Data") {
                iconName = focused ? "people" : "people-outline";
              } else if (route.name === "Settings") {
                iconName = focused ? "settings" : "settings-outline";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarInactiveTintColor: "gray", // Color of inactive tab icon and label
          })}
        >
          <Tab.Screen name="Home">
            {() => (
              <HomeScreen
                data={data}
                loading={loading}
                error={error}
                sheets={sheets}
                setSelectedSheet={setSelectedSheet}
                selectedSheet={selectedSheet}
                refreshing={refreshing}
                handleRefresh={handleRefresh}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Person Data">
            {() => (
              <PersonDataScreen
                data={data}
                loading={loading}
                error={error}
                refreshing={refreshing}
                handleRefresh={handleRefresh}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Settings">
            {() => <SettingsStack data={data} refreshing={refreshing} handleRefresh={handleRefresh} loading={loading} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 0, // Adjust for Android status bar
    backgroundColor: "#FFDEDE",
  },
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
    borderColor: "#C1C0B9",
    borderRadius: 4,
    marginBottom: 20,
    marginTop: 10,
  },
  picker: {
    flex: 1,
  },
});

export default App;
