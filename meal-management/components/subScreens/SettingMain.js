import LottieView from "lottie-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const SettingMain = () => {

  const navigation = useNavigation();
  return (
    <View style={styles.noContainer}>
      <LottieView
              source={require('../../assets/json/comming.json')} // your .json file
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
      />
      
      <Pressable onPress={() => navigation.navigate("monthsummary")}>
        <Text style={styles.linkText}>📅 Month Summary</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    noContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  });