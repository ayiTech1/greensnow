import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="upcoming-shift" /> {/* Maps to UpcomingShift */}
      <Stack.Screen name="ongoing-shift" />
    </Stack>
  );
}
