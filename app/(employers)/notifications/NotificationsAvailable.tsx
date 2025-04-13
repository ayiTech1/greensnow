import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  LogBox,
} from "react-native";
import tw from "twrnc";
import NotificationItem from "./components/NotificationItem";
import { NotificationsData, ShiftDetailsData } from "@/assets/data/Data";
import { router, useLocalSearchParams } from "expo-router";
import { NotificationDetailsProps, ShiftDetailsProps } from "./types";

const NotificationsAvailable: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<NotificationDetailsProps[]>([]);
  const [shiftData, setShiftData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    setTimeout(() => {
      setData(NotificationsData); // Using imported JSON data
      setShiftData(ShiftDetailsData); // Using imported JSON data
      setLoading(false);
    }, 1000);
  }, []);

  const filteredShifts = shiftData.filter((shift) => shift.id === id);

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center pt-5 pb-6 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <ScrollView nestedScrollEnabled={true}>
        <SafeAreaView
          style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
        >
          {loading ? (
            <ActivityIndicator style={tw`mt-[50%]`} size="large" color="blue" />
          ) : (
            <FlatList
              style={tw`w-full`}
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/shifts/ShiftDetailsTaken",
                      params: {
                        id: item.shiftId,
                      },
                    })
                  }
                >
                  <NotificationItem
                    iconUrl={item.iconUrl}
                    title={item.title}
                    message={item.message}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default NotificationsAvailable;
