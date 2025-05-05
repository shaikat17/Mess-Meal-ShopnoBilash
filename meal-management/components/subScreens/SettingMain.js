import LottieView from "lottie-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export const SettingMain = () => {
  const navigation = useNavigation();

  const features = [
    { title: "📅 Month Summary", route: "monthsummary" },
    { title: "💸 Extra Spend", route: "extraspend" },
    { title: "🍽️ Add Meal", route: "addmeal" },
    { title: "📈 Analytics", route: "analytics" },
    // { title: "⚙️ Preferences", route: "preferences" },
    // { title: "👤 Profile Settings", route: "profilesettings" },
    // { title: "🔔 Notifications", route: "notifications" },
    // { title: "💾 Data Backup", route: "backup" },
    // { title: "📤 Export Data", route: "export" },
    // { title: "❓ Help & Support", route: "support" },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Placeholder for symmetrical layout */}
        <View style={styles.backButton} />
      </View>

      {/* Lottie Animation */}
      <LottieView
        source={require('../../assets/json/comming.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* Feature Links */}
      <ScrollView contentContainerStyle={styles.linksContainer}>
        {features.map((feature, index) => (
          <Pressable
            key={index}
            style={styles.featureButton}
            onPress={() => navigation.navigate(feature.route)}
          >
            <Text style={styles.featureText}>{feature.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: "#03A791",
    borderEndEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  backButton: {
    padding: 5,
    width: 80,
    alignItems: "flex-start",
    marginLeft: 15,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  linksContainer: {
    paddingBottom: 40,
    marginHorizontal: 20,
  },
  featureButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  featureText: {
    fontSize: 16,
    color: "#333",
  },
});
