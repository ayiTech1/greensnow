import { Stack } from "expo-router";
import React from "react";
import { ShiftsHeader } from "../components/ShiftsHeader";
import { View } from "react-native";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

export default function ShiftLayout() {
  return (
    <SafeAreaView
      style={tw`flex-1 overflow-hidden flex-col px-3 py-3 mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <ShiftsHeader />
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="confirm-shift" options={{ headerShown: false }} />
        <Stack.Screen
          name="shift-requirement"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ongoing-shift-details"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="upcoming-shift-details"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="completed-shift-details"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="available-shift-details"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="shift-not-allowed"
          options={{ headerShown: false }}
        />
      </Stack>
    </SafeAreaView>
  );
}
