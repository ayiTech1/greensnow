import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  LogBox,
} from "react-native";
import moment from "moment";
import tw from "twrnc";
import JobCard from "./components/JobCard";
import { router, useFocusEffect } from "expo-router";
import { OngoingShiftProps, ShiftDetailsProps } from "./types";
import {
  fetchOngoingShifts,
  fetchOngoingShiftsByEmployee,
  fetchShifts,
  fetchUpcomingShifts,
  fetchUpcomingShiftsByEmployee,
} from "@/services/api_test";
import { UpcomingShiftProps } from "./types";
import Home from "./HomeNotVerified";
import HomeNoPost from "./HomeNoPost";

const employeeId = "92453a49-e948-4e0a-804c-7dd58995b29a"; //Supply employee ID

const HomePostedShifts: React.FC = () => {
  const [tab, setTab] = useState("upcoming");
  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [ongoing, setOngoing] = useState<OngoingShiftProps[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingShiftProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadOngoingShiftsByEmployee();
      loadUpcomingShiftsByEmployee();
    }, [])
  );

  const loadData = async () => {
    try {
      const data = await fetchShifts();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadUpcomingShiftsByEmployee = async () => {
    try {
      const data = await fetchUpcomingShiftsByEmployee(employeeId);
      setUpcoming(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOngoingShiftsByEmployee = async () => {
    try {
      const data = await fetchOngoingShiftsByEmployee(employeeId);
      setOngoing(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter upcoming shifts and ongoing shifts
  const upcomingShifts = useMemo(() => {
    if (!data.length || !upcoming.length) return [];
    const upcomingIds = upcoming.map((shift) => shift.shift);
    return data.filter((shifts) => upcomingIds.includes(shifts.id));
  }, [data, upcoming]);

  const ongoingShifts = useMemo(() => {
    if (!data.length || !ongoing.length) return [];
    const filteredOngoingShifts = ongoing.filter(
      (shift) => shift.shift_progress == "IN_PROGRESS"
    );
    const ongoingIds = filteredOngoingShifts.map((shift) => shift.shift);
    return data.filter((shifts) => ongoingIds.includes(shifts.id));
  }, [data, ongoing]);

  if (data.length === 0) {
    return <HomeNoPost />;
  }

  return (
    <View
      style={tw`flex-1 px-1 pt-1 pb-6 mx-auto w-full bg-zinc-100 max-w-[480px] items-center`}
    >
      <View style={tw`flex-1 mt-5 w-full`}>
        {/* Tab Buttons */}
        <View style={tw`flex flex-row items-start gap-2.5 w-full`}>
          <TouchableOpacity onPress={() => setTab("upcoming")}>
            <Text
              style={tw`text-base font-extrabold ${
                tab === "upcoming" ? "text-green-700 underline" : "text-black"
              }`}
            >
              Upcoming Shifts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab("ongoing")}>
            <Text
              style={tw`text-base font-extrabold ${
                tab === "ongoing" ? "text-green-700 underline" : "text-black"
              }`}
            >
              Ongoing Shifts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={tw`flex-1 w-full`}>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              data={tab === "upcoming" ? upcomingShifts : ongoingShifts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <JobCard job={item} route={`/shifts/${tab}-shift-details`} />
              )}
              contentContainerStyle={tw`flex-grow p-1`} // Ensure full height
              ListEmptyComponent={() => (
                <Text style={tw`text-center text-gray-500 mt-4`}>
                  No {tab} shifts available.
                </Text>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default HomePostedShifts;
