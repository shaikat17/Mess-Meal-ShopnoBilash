import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingMain } from "./subScreens/SettingMain";
import { MonthSummary } from "./subScreens/MonthSummary";
import { ExtraSpend } from "./subScreens/ExtraSpend";

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingMain" component={SettingMain} />
      <Stack.Screen name="monthsummary" component={MonthSummary} />
      <Stack.Screen name="extraspend" component={ExtraSpend} />
    </Stack.Navigator>
  );
}