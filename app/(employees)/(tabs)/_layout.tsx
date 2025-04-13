import { View, Image, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs, Stack, useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import { icons } from "@/constants/icon";
import { UserHeader } from "../components/UserHeader";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { fetchEmployeeDetailsByUser, fetchUser } from "@/services/api_test";
import { EmployeeProps, ShiftDetailsProps, UserProps } from "./types";

interface TabIconProps {
  color: string;
  name: string;
  focused: boolean;
  icon?: any;
}
const UserId = "92453a49-e948-4e0a-804c-7dd58995b29a";

const TabIcon = ({ color, name, icon, focused }: TabIconProps) => (
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
        style={tw`border border-2 border-white rounded-lg w-8 h-1 absolute mt-12`}
      />
    )}
  </View>
);

const TabLayout = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<UserProps>();
  const [employee, setEmployee] = useState<EmployeeProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUser(UserId);
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    const loadEmployeeDetails = async () => {
      try {
        const data = await fetchEmployeeDetailsByUser(UserId);
        setEmployee(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    loadEmployeeDetails();
  }, []);

  if (loading)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator
          style={tw`mt-auto mb-auto`}
          size="large"
          color="green"
        />
      </View>
    );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100 pt-5`}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 25,
          paddingHorizontal: 10,
        }}
      >
        <UserHeader
          avatarUrl={require("@/assets/images/avatarverified.png")}
          username={data?.first_name || ""}
          ratings={+(employee?.rating ?? 0)}
          assurance={+(employee?.assurance ?? 0)}
        />
        <LanguageSwitcher
          currentLanguage="EN"
          icon={require("@/assets/images/flag-france.png")}
        />
      </View>

      <Tabs
        screenOptions={{
          tabBarShowLabel: true, // Set this to true to show labels
          tabBarActiveTintColor: "#FFF",
          tabBarInactiveTintColor: "#B0B0B0",
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
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
            tabBarLabel: "Home", // Set tab label here
          }}
        />

        <Tabs.Screen
          name="shift"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.shift}
                color={color}
                name="Shift"
                focused={focused}
              />
            ),
            tabBarLabel: "Shift", // Set tab label here
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bell}
                color={color}
                name="Notification"
                focused={focused}
              />
            ),
            tabBarLabel: "Notification", // Set tab label here
          }}
        />

        <Tabs.Screen
          name="History"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.history}
                color={color}
                name="History"
                focused={focused}
              />
            ),
            tabBarLabel: "History", // Set tab label here
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabLayout;
