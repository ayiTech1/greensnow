import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  BackHandler,
} from "react-native";
import tw from "twrnc";
import CalendarBar from "../components/CalendarBar";
import { router, useFocusEffect } from "expo-router";
import {
  fetchEmployeeShiftApplications,
  fetchShifts,
} from "@/services/api_test";
import { ShiftDetailsProps } from "./types";
import moment from "moment";
import { ShiftsJobCard } from "../components/ShiftsJobCard ";
import NoGigsOnDate from "../shifts/shift-no-gigs";
import { ShiftApplicationProps } from "../shifts/types";

const employeeId = "92453a49-e948-4e0a-804c-7dd58995b29a";

const Shift = () => {
  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [shiftApplications, setShiftApplications] = useState<
    ShiftApplicationProps[]
  >([]);
  const [loading, setLoading] = useState(true);
  // Function to get today's date in ISO format (YYYY-MM-DD)
  const getTodayISO = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayISO()
  );

  // Function to extract only the date part (YYYY-MM-DD) from datetime
  const getISODate = (datetime: string) => datetime.split("T")[0];

  // Filter data based on posted
  const postedShifts =
    data.length !== 0 ? data.filter((item) => item.status === "POSTED") : [];

  //get shifts that have not been picked by employee
  const ApplicationShiftIDs = shiftApplications.map(
    (application) => application.shift
  );
  console.log("ApplicationsShiftIDs", ApplicationShiftIDs);
  // get shifts that have not been applied for
  const availableShifts = postedShifts.filter(
    (data) => !ApplicationShiftIDs.includes(data.id)
  );
  console.log("Available shifts", availableShifts);

  // Filter data based on selectedDate (ignoring time)
  const filteredData = selectedDate
    ? availableShifts.filter(
        (item) => getISODate(item.date.toString()) === selectedDate
      )
    : availableShifts;

  const handleCardPress = (jobId: string) => {
    router.push(`/shifts/available-shift-details?jobId=${jobId}`);
  };

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadEmployeeShiftApplications();
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

  //fetch shift applications belonging to employee
  const loadEmployeeShiftApplications = async () => {
    try {
      const data = await fetchEmployeeShiftApplications(employeeId);
      setShiftApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={tw`flex-1 items-center bg-zinc-100 w-full h-full`}>
        <ActivityIndicator
          style={tw`mt-auto mb-auto`}
          size="large"
          color="green"
        />
      </View>
    );

  return (
    <View
      style={tw`flex-1 flex-col overflow-hidden items-center px-3 pt-10 pb-6 mx-auto w-full text-center bg-gray-100 max-w-[480px]`}
    >
      <View
        style={tw`flex-1 flex-row gap-1 justify-center w-full max-w-[480px]`}
      >
        <CalendarBar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <View
          style={tw`flex-1 flex-col overflow-hidden w-full items-center mt-1 text-center`}
        >
          {/* Shift Card Section */}
          {filteredData.length !== 0 ? (
            <FlatList
              style={tw`w-full max-w-[480px]`}
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/shifts/available-shift-details",
                      params: {
                        id: item.id,
                      },
                    })
                  }
                >
                  <ShiftsJobCard
                    jobId={item.id.toString()}
                    date={moment(item.date).format("ddd, Do MMM")}
                    time={moment(item.start_time).format("hh:mm A")}
                    location={item.location}
                    position={item.name}
                    hourlyRate={+item.salary_per_time}
                    hours={+item.shift_duration}
                    totalAmount={+item.total_earning}
                    employer={item.company_name}
                    backgroundImage={item.background_image_url}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <NoGigsOnDate />
          )}
        </View>
      </View>
    </View>
  );
};

export default Shift;
