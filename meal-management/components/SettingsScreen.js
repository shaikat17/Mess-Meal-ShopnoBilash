import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingMain } from "./subScreens/SettingMain";
import { MonthSummary } from "./subScreens/MonthSummary";

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingMain} />
      <Stack.Screen name="monthsummary" component={MonthSummary} />
    </Stack.Navigator>
  );
}