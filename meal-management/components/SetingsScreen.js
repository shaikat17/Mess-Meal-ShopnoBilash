import { StyleSheet, Text, View } from "react-native";

export const SettingsScreen = () => {
  return (
    <View style={styles.noContainer}>
      <Text>Comming soon</Text>
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