import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  LogBox,
  Alert,
} from "react-native";
import moment from "moment";
import tw from "twrnc";
import JobCard from "./components/JobCard";
import { router } from "expo-router";
import {
  OngoingShiftProps,
  ShiftDetailsProps,
  UpcomingShiftProps,
} from "./types";
import {
  fetchOngoingShiftsByEmployer,
  fetchShifts,
  fetchShiftsByEmployer,
  fetchUpcomingShiftByEmployer,
} from "@/services/api_test";
import ShiftsTakenJobCard from "./components/ShiftsTakenJobCard";
import HomeNoPost from "./HomeNoPost";
import { useFocusEffect } from "@react-navigation/native";

const employerId = "92453a49-e948-4e0a-804c-7dd58995b217";

const HomePostedShifts: React.FC = () => {
  const [tab, setTab] = useState("posted");
  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [upcomingData, setUpcomingData] = useState<UpcomingShiftProps[]>([]);
  const [ongoingData, setOngoingData] = useState<OngoingShiftProps[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
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

      //find upcoming shifts belonging to employer
      const loadUpcomingData = async () => {
        try {
          const data = await fetchUpcomingShiftByEmployer(employerId);
          setUpcomingData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      //find ongoing shifts belonging to employer
      const loadOngoingData = async () => {
        try {
          const data = await fetchOngoingShiftsByEmployer(employerId);
          setOngoingData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
      loadUpcomingData();
      loadOngoingData();
    }, [])
  );

  // Filter shifts into posted, taken and pending
  const postedShiftsData = data.filter((shift) => shift.status === "POSTED");
  const pendingShiftsData = data.filter((shift) => shift.status === "PENDING");
  // Extract shift ids from upcoming shifts belonging to employer
  const upcomingShiftIDs = upcomingData.map((data) => data.shift);
  // Get shift in progress from ongoing shifts
  const shiftsInProgress = ongoingData.filter(
    (shift) => shift.shift_progress === "IN_PROGRESS"
  );
  const ongoingShiftIDs = shiftsInProgress.map((data) => data.shift);
  //combine shift ids from upcoming and ongoing shifts
  const mergedIDs = [...upcomingShiftIDs, ...ongoingShiftIDs];

  // Filter shifts where the ID is in `upcoming and ongoing Shifts`
  const takenShiftsData = data.filter((data) => mergedIDs.includes(data.id));

  if (!loading && data.length === 0) {
    return <HomeNoPost />;
  }

  return (
    <View
      style={tw`flex-1 flex-col overflow-hidden flex-col px-1 pt-1 pb-6 mx-auto w-full bg-zinc-100 max-w-[480px] items-center text-center`}
    >
      <View style={tw`flex mt-5 w-full`}>
        <View
          style={tw`flex flex-row items-start gap-2.5 w-64 max-w-full rounded-none w-full`}
        >
          <TouchableOpacity onPress={() => setTab("posted")}>
            <Text
              style={tw`grow text-base text-stone-900 font-extrabold tracking-tight leading-loose ${
                tab == "posted" ? `text-green-700 underline` : ``
              } `}
            >
              Posted Shifts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab("taken")}>
            <Text
              style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose ${
                tab == "taken" ? `text-green-700 underline` : ``
              }`}
            >
              Shifts Taken
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTab("pending")}>
            <Text
              style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose ${
                tab == "pending" ? `text-green-700 underline` : ``
              }`}
            >
              Pending Shifts
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Tab view logic-------------------------------------------------------------------------------------------------------- */}
          {tab == "posted" ? (
            <View
              style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
            >
              {loading ? (
                <ActivityIndicator
                  style={tw`mt-[50%]`}
                  size="large"
                  color="blue"
                />
              ) : (
                <View style={tw`w-full`}>
                  <FlatList
                    data={postedShiftsData}
                    keyExtractor={(item) => item.id.toString().toString()}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/shifts/PostedPendingShiftDetails",
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
                          position={item.name}
                          hourlyRate={+item.salary_per_time}
                          hours={+item.shift_duration}
                          totalAmount={+item.total_earning}
                          backgroundImage={item.background_image_url}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          ) : tab == "taken" ? (
            <SafeAreaView
              style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
            >
              {takenShiftsData.length === 0 ? (
                <Text style={tw`mt-[50%] text-lg text-center`}>
                  No shifts taken yet
                </Text>
              ) : (
                <View style={tw`w-full`}>
                  <FlatList
                    data={takenShiftsData}
                    keyExtractor={(item) => item.id.toString()}
                    nestedScrollEnabled={true}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => {
                          //find upcoming shift details for this card item
                          const upcomingDetails = upcomingData.filter(
                            (shift) => shift.shift === item.id
                          );
                          //find upcoming shift details for this card item
                          const ongoingDetails = ongoingData.filter(
                            (shift) => shift.shift === item.id
                          );

                          router.push({
                            pathname: "/shifts/UpComingShiftDetails",
                            params: {
                              id: item.id,
                              employee_id:
                                upcomingDetails.length > 0
                                  ? upcomingDetails[0].employee
                                  : ongoingDetails[0].employee,
                              upcoming_id:
                                upcomingDetails.length > 0
                                  ? upcomingDetails[0].id
                                  : "",
                            },
                          });
                        }}
                      >
                        <ShiftsTakenJobCard
                          jobId={item.id.toString()}
                          date={moment(item.date).format("ddd, Do MMM")}
                          time={moment(item.start_time).format("hh:mm A")}
                          location={item.location}
                          position={item.name}
                          hourlyRate={+item.salary_per_time}
                          hours={+item.shift_duration}
                          totalAmount={+item.total_earning}
                          backgroundImage={item.background_image_url}
                          shiftType={item.name}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </SafeAreaView>
          ) : (
            <SafeAreaView
              style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
            >
              {pendingShiftsData.length === 0 ? (
                <Text style={tw`mt-[50%] text-lg text-center`}>
                  No pending shifts
                </Text>
              ) : (
                <SafeAreaView style={tw`w-full`}>
                  <FlatList
                    data={pendingShiftsData}
                    keyExtractor={(item) => item.id.toString()}
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/shifts/PostedPendingShiftDetails",
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
                          position={item.name}
                          hourlyRate={+item.salary_per_time}
                          hours={+item.shift_duration}
                          totalAmount={+item.total_earning}
                          backgroundImage={item.background_image_url}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </SafeAreaView>
              )}
            </SafeAreaView>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomePostedShifts;
