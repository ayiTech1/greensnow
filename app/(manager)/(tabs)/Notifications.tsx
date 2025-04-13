import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  LogBox,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from "react-native";
import tw from "twrnc";
import UserHeader from "../components/UserHeader";
import NotificationItem from "../components/NotificationItem";
import { images } from "@/assets/images";
import { NotificationsData, ShiftDetailsData } from "@/assets/data/Data";
import { NotificationDetailsProps, ShiftDetailsProps } from "./types";
import { router, useFocusEffect } from "expo-router";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<
    NotificationDetailsProps[]
  >([]);
  const [shifts, setShifts] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    setTimeout(() => {
      setNotifications(NotificationsData); // Using imported JSON data
      setShifts(ShiftDetailsData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <View
      style={tw`flex-1 overflow-hidden pt-8 flex-col items-center bg-zinc-100`}
    >
      <View style={tw`mt-4`}>
        <ScrollView>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/shifts/ShiftDetailsTaken",
                    params: {
                      id: shifts[0].id,
                      shiftType: shifts[0].shiftType,
                      date: shifts[0].date,
                      time: shifts[0].time,
                      endTime: shifts[0].endTime,
                      hourlyRate: shifts[0].hourlyRate,
                      totalEarnings: shifts[0].totalEarnings,
                      numberOfHours: shifts[0].numberOfHours,
                      numberOfOpenings: shifts[0].numberOfOpenings,
                      location: shifts[0].location,
                      description: shifts[0].description,
                      employer: shifts[0].employer,
                      employee: shifts[0].employee,
                      employerId: shifts[0].employerId,
                      employeeId: shifts[0].employeeId,
                    },
                  })
                }
              >
                <NotificationItem
                  iconUrl={images.bag}
                  title={item.title}
                  message={item.message}
                  id={item.id}
                  notificationType={item.notificationType}
                />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Notifications;
