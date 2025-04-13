import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  LogBox,
  BackHandler,
} from "react-native";
import tw from "twrnc";
import JobCard from "../components/JobCard";
import { router, useFocusEffect } from "expo-router";
import { ShiftDetailsData } from "@/assets/data/Data";
import { ShiftDetailsProps } from "./types";
import { ActionButton } from "../components/ActionButton";
import { fetchShifts } from "@/services/api_test";
import moment from "moment";
import ShiftsTakenJobCard from "../components/ShiftsTakenJobCard";

// Shift Tabs State

const HomePostedShifts: React.FC = () => {
  const [tab, setTab] = useState("posted");
  const [shiftsTakenData, setShiftsTakenData] = useState<ShiftDetailsProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<ShiftDetailsProps[]>([]);

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  useFocusEffect(
    useCallback(() => {
      loadShifts();
    }, [])
  );

  const loadShifts = async () => {
    try {
      const data = await fetchShifts();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter shifts into posted, taken and pending
  const postedShiftsData = useMemo(
    () => data.filter((shift) => shift.status === "POSTED"),
    [data]
  );

  const takenShiftsData = useMemo(
    () => data.filter((shift) => shift.status === "TAKEN"),
    [data]
  );

  const pendingShiftsData = useMemo(
    () => data.filter((shift) => shift.status === "PENDING"),
    [data]
  );

  return (
    <View
      style={tw`flex-1 flex-col overflow-hidden flex-col px-1 pt-1 pb-8 mx-auto w-full bg-zinc-100 max-w-[480px] items-center text-center`}
    >
      <View style={tw`flex mt-5 mb-18 w-full`}>
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

        {/* Create Shift Button */}
        <View style={tw`mb-2`}>
          <ActionButton
            buttonStyle="self-start w-[193px] px-2 py-2 mt-3"
            isEnabled={true}
            label="Create Shift"
            onPress={() => router.push("/screens/CreateShift")}
            //onPress={()=> router.push("/shifts/CreateShift")}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {tab == "posted" ? (
            <SafeAreaView
              style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
            >
              {loading ? (
                <View style={tw`mt-[50%]`}>
                  <ActivityIndicator size="large" color="blue" />
                </View>
              ) : (
                <View style={tw`w-full mb-6`}>
                  <FlatList
                    data={postedShiftsData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/shifts/ShiftDetailsPosted",
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
                          employer={item.company_name}
                          hourlyRate={item.salary_per_time}
                          hours={item.shift_duration}
                          totalAmount={item.total_earning.toString()}
                          backgroundImage={item.background_image_url}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </SafeAreaView>
          ) : //Taken shifts cards section
          tab == "taken" ? (
            <SafeAreaView
              style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
            >
              {loading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <View style={tw`w-full mb-6`}>
                  <FlatList
                    data={takenShiftsData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/shifts/ShiftDetailsTaken",
                            params: {
                              id: item.id,
                            },
                          })
                        }
                      >
                        <ShiftsTakenJobCard
                          jobId={item.id.toString()}
                          position={item.name}
                          date={moment(item.date).format("ddd, Do MMM")}
                          time={moment(item.start_time).format("hh:mm A")}
                          location={item.location}
                          shiftType={item.name}
                          employer={item.company_name}
                          hourlyRate={+item.salary_per_time}
                          hours={+item.shift_duration}
                          totalAmount={+item.total_earning.toString()}
                          backgroundImage={item.background_image_url}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </SafeAreaView>
          ) : (
            // Pending Shifts Display ------------------------------------------------------------

            <SafeAreaView
              style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
            >
              {loading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <View style={tw`w-full mb-6`}>
                  <FlatList
                    data={pendingShiftsData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/shifts/ShiftDetailsPending",
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
                          employer={item.company_name}
                          hourlyRate={item.salary_per_time}
                          hours={item.shift_duration}
                          totalAmount={item.total_earning.toString()}
                          backgroundImage={item.background_image_url}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </SafeAreaView>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomePostedShifts;
