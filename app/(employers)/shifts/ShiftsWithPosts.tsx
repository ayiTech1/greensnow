import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import tw from "twrnc";
import UserHeader from "./components/UserHeader";
import JobCard from "./components/JobCard";
import { images } from "@/assets/images";
import { ActionButton } from "./components/ActionButton";
import { router } from "expo-router";
import { JobCardProps, ShiftDetailsProps } from "./types";
import { postedShiftsJobCardData } from "@/assets/data/Data";
import { fetchShifts } from "@/services/api_test";

const ShiftsWithPosts: React.FC = () => {
  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setData(postedShiftsJobCardData); // Using imported JSON data
  //     setLoading(false);
  //   }, 1000);
  // }, []);

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

    loadData();
  }, []);

  return (
    <View
      style={tw`flex-1 flex-col overflow-hidden flex-col items-center px-1 pt-10 pb-6 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <UserHeader avatarUrl={images.avatarverified} username="Angela" />

      <View></View>

      <View
        style={tw`flex-1 flex-col gap-4 justify-center w-full mt-4 max-w-[480px]`}
      >
        {/* Action Button */}
        <ActionButton
          className="self-start w-[193px] px-2 py-2 mt-3"
          isEnabled={true}
          label="Create Shift"
          onPress={() => router.push("/shifts/CreateShift")}
        />

        <Text style={tw`text-lg font-bold`}>Posted Shifts</Text>

        <ScrollView>
          <SafeAreaView
            style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
          >
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {}}>
                    <JobCard
                      jobId={item.id.toString()}
                      date={item.date}
                      time={item.start_time}
                      location={item.location}
                      position={item.name}
                      hourlyRate={+item.salary_per_time}
                      hours={+item.shift_duration}
                      totalAmount={item.total_earning}
                      backgroundImage={item.background_image_url}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </SafeAreaView>
        </ScrollView>
      </View>
    </View>
  );
};

export default ShiftsWithPosts;
