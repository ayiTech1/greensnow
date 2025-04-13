import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import moment from "moment";
import tw from "twrnc";
import JobCard from "../components/JobCard";
import { ActionButton } from "../components/ActionButton";
import { router } from "expo-router";
import { ShiftDetailsProps } from "./types";
import { fetchShifts, fetchShiftsByEmployer } from "@/services/api_test";
import { useFocusEffect } from "@react-navigation/native";

const employerId = "92453a49-e948-4e0a-804c-7dd58995b217"; //Supply Employer ID

const ShiftsWithPosts: React.FC = () => {
  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

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

      loadData();
    }, [])
  );

  // Filter shifts into posted
  const filteredData = data.filter((shift) => shift.status === "POSTED");

  return (
    <View
      style={tw`flex-1 flex-col overflow-hidden flex-col items-center px-1 pt-5 pb-6 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <View style={tw`flex-1 flex-col gap-4 w-full  max-w-[480px]`}>
        {/* Action Button */}
        <ActionButton
          className="self-start w-[193px] px-2 py-2 mt-3"
          isEnabled={true}
          label="Create Shift"
          onPress={() => router.push("/shifts/CreateShift")}
        />

        <Text style={tw`text-lg font-bold`}>Posted Shifts</Text>

        {/* Flatlist---------------------------------------------------------------------------------- */}
        {loading ? (
          <ActivityIndicator style={tw`mt-[50%]`} size="large" color="blue" />
        ) : (
          <FlatList
            style={tw`w-full`}
            showsVerticalScrollIndicator={false}
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
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
        )}
      </View>
    </View>
  );
};

export default ShiftsWithPosts;
