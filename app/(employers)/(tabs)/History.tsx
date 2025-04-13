import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  LogBox,
  BackHandler,
} from "react-native";
import moment from "moment";
import tw from "twrnc";
import UserHeader from "../components/UserHeader";
import JobCard from "../components/JobCard";
import { images } from "@/assets/images";
import { router, useFocusEffect } from "expo-router";
import {
  ShiftDetailsData,
  TakenShiftsjobCardData,
  postedShiftsJobCardData,
} from "@/assets/data/Data";
import { JobCardProps, ShiftDetailsProps } from "./types";
import {
  fetchOngoingShifts,
  fetchShifts,
  fetchShiftsByEmployer,
} from "@/services/api_test";
import { OngoingShiftProps } from "./types";
import ShiftDetailsJobCard from "../home/components/ShiftDetailsJobCard";
import ShiftsTakenJobCard from "../components/ShiftsTakenJobCard";

const employerId = "92453a49-e948-4e0a-804c-7dd58995b217"; //Supply Employer ID

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
        const data = await fetchShiftsByEmployer(employerId);
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
  let filteredShifts: ShiftDetailsProps[] = [];
  let filteredOngoingShifts: OngoingShiftProps[] = [];
  if (data.length !== 0 && ongoing.length !== 0) {
    filteredOngoingShifts = ongoing.filter(
      (shift) => shift.shift_progress == "COMPLETED"
    );
    const allowedIds = filteredOngoingShifts.map((shift) => shift.shift); // Extract shift IDs
    filteredShifts = data.filter((shifts) => allowedIds.includes(shifts.id));
  }

  return (
    <View
      style={tw`flex-1 flex-col overflow-hidden flex-col items-center w-full bg-zinc-100`}
    >
      <View
        style={tw`flex flex-row gap-5 justify-between w-full text-center max-w-[362px] text-stone-900`}
      >
        <View style={tw`flex flex-col items-start`}>
          <View
            style={tw`self-stretch mt-4 text-xl font-extrabold tracking-tight leading-none`}
          >
            <Text
              style={tw`text-xl font-extrabold tracking-tight leading-none`}
            >
              Previous shifts
            </Text>
          </View>
        </View>
      </View>

      {/* Shift card goes here */}
      <View style={tw`flex  h-[90%] mt-5 mb-20 w-full`}>
        <View
          style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
        >
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <FlatList
              style={tw`w-full`}
              showsVerticalScrollIndicator={false}
              data={filteredShifts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/shifts/CompletedShiftDetails",
                      params: {
                        shift_id: item.id,
                        employee_id: filteredOngoingShifts[index].employee,
                      },
                    })
                  }
                >
                  <ShiftsTakenJobCard
                    jobId={item.id.toString()}
                    date={moment(item.date).format("ddd, Do MMM")}
                    time={moment(item.start_time).format("hh:mm A")}
                    location={item.location}
                    shiftType={item.name}
                    hourlyRate={+item.salary_per_time}
                    hours={+item.shift_duration}
                    totalAmount={+item.total_earning}
                    backgroundImage={item.background_image_url}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>

      {/* navigation goes here */}
    </View>
  );
};

export default History;
