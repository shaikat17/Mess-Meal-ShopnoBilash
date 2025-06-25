// notificationUtils.js

import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export const scheduleDailyReminder = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Notification permission not granted!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Cancel existing scheduled notifications (optional)
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule a daily notification at 9 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧾 Daily Expense Reminder',
        body: 'Don’t forget to log today’s expenses!',
      },
      trigger: {
        hour: 23,
        minute: 59,
        repeats: true,
      },
    });
  } catch (err) {
    console.error('Error setting up notification:', err);
  }
};
