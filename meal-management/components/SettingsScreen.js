import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingMain } from "./subScreens/SettingMain";
import { MonthSummary } from "./subScreens/MonthSummary";
import { ExtraSpend } from "./subScreens/ExtraSpend";
import { AddMeal } from "./subScreens/AddMeal";
import { Analytics } from "./subScreens/Analytics";
import { ViewMeal } from "./subScreens/ViewMeal";
import { AddBazar } from "./subScreens/AddBazar";
import { Washroom } from "./subScreens/Washroom";

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingMain" component={SettingMain} />
      <Stack.Screen name="monthsummary" component={MonthSummary} />
      <Stack.Screen name="extraspend" component={ExtraSpend} />
      <Stack.Screen name="addmeal" component={AddMeal} />
      <Stack.Screen name="analytics" component={Analytics} />
      <Stack.Screen name="viewmeal" component={ViewMeal} />
      <Stack.Screen name="addbazar" component={AddBazar} />
      <Stack.Screen name="washroom" component={Washroom} />
    </Stack.Navigator>
  );
}