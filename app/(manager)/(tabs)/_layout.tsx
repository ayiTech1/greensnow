import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, View, Image } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import UserHeader from "../components/UserHeader";
import { images } from "@/assets/images";
import { icons } from "@/constants/icon";
import tw from "twrnc";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
interface TabIconProps {
  color: string;
  focused: boolean;
  icon?: any;
}

const TabBarIcon = ({ color, icon, focused }: TabIconProps) => (
  <View style={tw`flex items-center`}>
    <Image
      source={icon}
      resizeMode="contain"
      style={{
        width: 24,
        height: 24,
        tintColor: color,
        marginTop: 5,
      }}
    />
    {focused && (
      <View style={tw`border border-2 border-white w-8 h-1 absolute mt-11.5`} />
    )}
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col px-2 pt-2 pb-2 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <UserHeader avatarUrl={images.avatarverified} username="Manager" />

      {/* <View style={tw`flex-1 justify-end bg-white`}> */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#B0B0B0",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#068A2D",
            height: 60,
            paddingVertical: 5,
            borderRadius: 15,
            marginHorizontal: 10,
            marginBottom: 15,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 5, // Add space between the label and the icon
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Shifts",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={icons.shift} color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="Employers"
          options={{
            title: "Employers",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.employer}
                color={color}
                focused={focused}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="JobSeekers"
          options={{
            // title: "Job Seekers",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.employee}
                color={color}
                focused={focused}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="Notifications"
          options={{
            title: "Notifications",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={icons.bell} color={color} focused={focused} />
            ),

            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="History"
          options={{
            title: "History",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.history}
                color={color}
                focused={focused}
              />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}
