import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import tw from "twrnc";
import UserHeader from "../components/UserHeader";
import { images } from "@/assets/images";
import { icons } from "@/constants/icon";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

interface TabIconProps {
  color: string;
  name: string;
  focused: boolean;
  icon?: any;
}

const TabBarIcon = ({ color, name, icon, focused }: TabIconProps) => (
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
      <View
        style={tw`border border-2 border-white rounded-lg w-8 h-1 absolute mt-11`}
      />
    )}
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col px-3 pt-10 pb-6 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <UserHeader
        avatarUrl={images.avatarverified}
        username="Jacob Construction"
      />

      <View style={tw`flex-1 justify-end bg-white`}>
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
              // marginBottom: 15,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Shifts"
            options={{
              title: "Shifts",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  icon={icons.shift}
                  name="briefcase"
                  color={color}
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="History"
            options={{
              title: "History",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  icon={icons.history}
                  name="history"
                  color={color}
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Notifications"
            options={{
              title: "Notifications",
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon
                  icon={icons.bell}
                  name="bell"
                  color={color}
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
