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
import { DataProvider } from "./context/DataContext";

const Tab = createBottomTabNavigator();

const App = () => {

  return (
    <SafeAreaView style={styles.mainContainer}>
      <DataProvider>
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
            tabBarActiveTintColor: "#03A791", // Active tab color
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
            tabBarInactiveTintColor: "#808080", // Color of inactive tab icon and label
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Person Data" component={PersonDataScreen} />
          <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>
      </NavigationContainer>
      </DataProvider>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 0, // Adjust for Android status bar
  },
  
});

export default App;
