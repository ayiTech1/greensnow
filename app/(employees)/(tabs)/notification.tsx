import React from "react";
import { View, ScrollView, BackHandler } from "react-native";
import tw from "twrnc";
import { NotificationItem } from "../components/NotificationItem";
import { useFocusEffect } from "expo-router";

export const Notifications: React.FC = () => {
  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  return (
    <View
      style={tw`flex-1 bg-gray-100 w-full items-center  px-4 pt-10 pb-10 mx-auto`}
    >
      <ScrollView contentContainerStyle={tw`mt-10`}>
        <NotificationItem
          iconUrl={require("@/assets/images/bag.png")}
          title="You took the shift"
          message="Review shift details and prepare for it."
        />
        <NotificationItem
          iconUrl={require("@/assets/images/clipboardwithcheck.png")}
          title="Completion confirmed"
          message="Employer has verified your shift has ended."
        />
        <NotificationItem
          iconUrl={require("@/assets/images/calendarnotification.png")}
          title="Starting shift confirmed"
          message="Employer has verified your shift has started."
        />
        <NotificationItem
          iconUrl={require("@/assets/images/personcircled.png")}
          title="Profile verified"
          message="Management has cleared you to pick shifts."
        />
      </ScrollView>
    </View>
  );
};

export default Notifications;
