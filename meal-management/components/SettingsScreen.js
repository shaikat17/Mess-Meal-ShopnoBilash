import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingMain } from "./subScreens/SettingMain";
import { MonthSummary } from "./subScreens/MonthSummary";

const Stack = createNativeStackNavigator();

export function SettingsStack({ data, refreshing, handleRefresh, loading }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingMain" component={SettingMain} />
      <Stack.Screen name="monthsummary">{({props}) => <MonthSummary {...props} data={data} refreshing={refreshing} handleRefresh={handleRefresh} loading={loading} />}</Stack.Screen>
    </Stack.Navigator>
  );
}