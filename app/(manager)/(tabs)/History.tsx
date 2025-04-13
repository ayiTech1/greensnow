import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  LogBox,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from "react-native";

import tw from "twrnc";
import UserHeader from "../components/UserHeader";
import JobCard from "../components/JobCard";
import { images } from "@/assets/images";
import { router, useFocusEffect } from "expo-router";
import { ShiftDetailsData } from "@/assets/data/Data";
import { ShiftDetailsProps } from "./types";
import { fetchShifts, fetchOngoingShifts } from "@/services/api_test";
import { OngoingShiftProps } from "@/services/types";
import moment from "moment";

const History: React.FC = () => {
  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [ongoing, setOngoing] = useState<OngoingShiftProps[]>([]);

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShifts();
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadOngoingShifts = async () => {
      try {
        const data = await fetchOngoingShifts();
        setOngoing(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    loadOngoingShifts();
  }, []);

  // Filter completed shifts
  let completedShifts: ShiftDetailsProps[] = [];
  if (data.length !== 0 && ongoing.length !== 0) {
    const filteredOngoingShifts = ongoing.filter(
      (shift) => shift.shift_progress === "COMPLETED"
    );
    const ongoingIds = filteredOngoingShifts.map((shift) => shift.shift); // Extract shift IDs
    completedShifts = data.filter((shifts) => ongoingIds.includes(shifts.id));
  }

  if (loading)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator style={tw`mt-[90%]`} size="large" color="green" />
      </View>
    );

  return (
    <View style={tw`flex-1 bg-zinc-100`}>
      <View style={tw`mt-8`}>
        <Text style={tw`text-xl font-extrabold tracking-tight leading-none`}>
          Previous shifts
        </Text>
      </View>

      {/* Shift card goes here */}

      <FlatList
        data={completedShifts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../shifts/ShiftDetailsHistory",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <JobCard
              jobId={item.id.toString()}
              date={moment(item.date).format("ddd, Do MMM")}
              time={moment(item.start_time).format("hh:mm A")}
              location={item.location}
              shiftType={item.name}
              employee="Employee name"
              employer={item.company_name}
              hourlyRate={item.salary_per_time}
              hours={item.shift_duration}
              totalAmount={item.total_earning.toString()}
              backgroundImage={item.background_image_url}
            />
          </TouchableOpacity>
        )}
      />

      {/* navigation goes here */}
    </View>
  );
};

export default History;
