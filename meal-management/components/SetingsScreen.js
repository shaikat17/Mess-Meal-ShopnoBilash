import LottieView from "lottie-react-native";
import { StyleSheet, Text, View } from "react-native";

export const SettingsScreen = () => {
  return (
    <View style={styles.noContainer}>
      <LottieView
              source={require('../assets/json/comming.json')} // your .json file
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
    </View>
  );
};

const styles = StyleSheet.create({
    noContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
  });