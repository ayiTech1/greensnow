import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  LogBox,
  FlatList,
  ActivityIndicator,
} from "react-native";

import tw from "twrnc";
import { DateTimeDisplay } from "../components/DateTimeDisplay";
import { MetricDisplay } from "../components/MetricsDisplay";
import { TotalEarnings } from "../components/TotalEarning";
import { LocationDisplay } from "../components/LocationDisplay";
import { Details } from "../components/ShiftDetailsDescription";
import {
  EmployerProps,
  ReviewDataProps,
  ShiftDetailsProps,
  ShiftRatingsProps,
  UserProps,
} from "./types";
import { ActionButton } from "../components/ActionButton";
import { images } from "@/assets/images";
import { router, useLocalSearchParams } from "expo-router";
import { ReviewData } from "@/assets/data/Data";
import {
  fetchEmployee,
  fetchEmployer,
  fetchOngoingShift,
  fetchShift,
  fetchShiftRatings,
  fetchUser,
} from "@/services/api_test";
import moment from "moment";
import ShiftDetailsBanner from "../components/ShiftDetailsBanner";
import { OngoingShiftProps } from "@/services/types";

const ShiftDetailsTaken: React.FC = () => {
  const [isCancelShiftModal, setisCancelShiftModal] = useState(false);
  const [data, setData] = useState<ShiftDetailsProps>();
  const [ongoingData, setOngoingData] = useState<OngoingShiftProps>();
  const [employee, setEmployee] = useState<UserProps>();
  const [employer, setEmployer] = useState<EmployerProps>();
  const [ratings, setRatings] = useState<ShiftRatingsProps>();
  const [review, setReview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();

  const ratingData = [
    { icon: images.starred, value: "-10" },
    { icon: images.ratingred, value: "-35" },
  ];

  const reviewData = [
    { name: "Arrival On Time", value: "Yes" },
    { name: "Worker Conduct", value: "Calm and Respectful" },
    { name: "Willing To Work With Again", value: "Yes" },
    { name: "Additional Info", value: "Very friendly" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [shiftData, ratingsDataRaw] = await Promise.all([
          fetchShift(id),
          fetchShiftRatings(id),
        ]);

        const ratingsData =
          typeof ratingsDataRaw === "string"
            ? JSON.parse(ratingsDataRaw)
            : ratingsDataRaw;

        console.log("Full Ratings Data:", ratingsData);
        console.log("Is ratingsData an array?", Array.isArray(ratingsData));

        setData(shiftData);

        if (Array.isArray(ratingsData) && ratingsData.length > 0) {
          console.log("Ratings Data Feedback:", ratingsData[0].feedback);
          setRatings(ratingsData[0]);
          setReview(ratingsData[0].feedback);
        } else if (ratingsData.feedback) {
          console.log("Ratings Data Feedback:", ratingsData.feedback);
          setReview(ratingsData.feedback);
        } else {
          console.warn("No feedback found.");
        }
      } catch (error) {
        console.error("Error fetching shift details or ratings:", error);
      }
    };

    loadData();
    loadOngoingShift();
  }, [id]);

  const loadOngoingShift = async () => {
    try {
      const data = await fetchOngoingShift(id);
      if (Array.isArray(data) && data.length > 0) {
        console.log("Ongoing Data:", data[0]);
        setOngoingData(data[0]);
        console.log("Ongoing data", data[0]);
        getEmployeeDetails(data[0].employee);
        getEmployer(data[0].employer);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployer = async (employer_id: string) => {
    try {
      const employerData = await fetchEmployer(employer_id);
      setEmployer(employerData);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeDetails = async (employee_id: string) => {
    try {
      const data = await fetchEmployee(employee_id);
      getEmployeeUserDetails(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeUserDetails = async (uid: string) => {
    try {
      const userData = await fetchUser(uid);
      setEmployee(userData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //Function to format rating and assurance
  const formatNumber = (value: number) => {
    return value >= 0 ? `+${value}` : `${value}`;
  };

  if (loading)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator style={tw`mt-[90%]`} size="large" color="green" />
      </View>
    );

  return (
    <View
      style={tw`flex-1 overflow-hidden items-center justify-center flex-col p-1 mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <View style={tw`flex flex-row gap-10 self-center text-stone-900`}>
        <View style={tw`flex flex-col w-full items-start`}>
          <View style={tw`self-stretch text-2xl font-bold`}>
            <Text
              style={tw`self-stretch mt-2.5 text-2xl font-bold text-start text-stone-900`}
            >
              Shift Details
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={tw`flex-grow`}
        showsVerticalScrollIndicator={false}
      >
        <DateTimeDisplay
          date={moment(data?.date).format("ddd, Do MMM")}
          time={moment(data?.start_time).format("hh:mm A")}
        />

        <View
          style={tw`shrink-0 self-center mt-1.5 max-w-full h-px border border-solid border-stone-300 w-[350px]`}
        />

        <ShiftDetailsBanner
          backgroundImage={data?.background_image_url}
          jobTitle={data?.name}
          companyName={data?.company_name || ""}
        />

        <MetricDisplay
          leftValue={"$" + parseFloat(data?.salary_per_time || "0").toFixed(2)}
          leftLabel="Hourly rate"
          rightValue={data?.shift_duration + " HRS"}
          rightLabel="Duration"
        />

        <TotalEarnings totalEarnings={data?.total_earning || 0} />

        <LocationDisplay
          address={data?.location || ""}
          mapImageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/bd168c1c64b133f2d4d9e3c84c1312dffacfbdccf2b8317ffcd8ad231338fdbc?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
        />

        <MetricDisplay
          leftValue={moment(data?.start_time).format("hh:mm A")}
          leftLabel="start time"
          rightValue={moment(data?.end_time).format("hh:mm A")}
          rightLabel="End Time"
        />

        <View style={tw`mt-2`}>
          <Details description={data?.requirement_description || ""} />
        </View>

        {/* Link to employer profile */}
        <View style={tw`mt-2`}>
          <View
            style={tw`flex flex-col items-start mt-3 tracking-tight mt-4 rounded-none max-w-[359px]`}
          >
            <Text
              style={tw`font-semibold leading-6 text-neutral-400 text-sm tracking-tight`}
            >
              Posted By
            </Text>

            <View style={tw`flex flex-row justify-between gap-5 w-full mt-1`}>
              <Text
                style={tw`text-zinc-600 tracking-tight text-sm text-neutral-500`}
              >
                {data?.company_name}
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/screens/EmployerProfileDetails",
                    params: {
                      user_id: employer?.user,
                    },
                  })
                }
              >
                <Text
                  style={tw`text-zinc-600 tracking-tight text-sm text-green-700 underline`}
                >
                  View Profile
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={tw`flex flex-col gap-1 mt-4`}>
          {/* Employer rating */}
          <View style={tw`flex flex-col gap-1 mt-4`}>
            <Text
              style={tw`font-semibold leading-6 text-neutral-400 text-sm tracking-tight`}
            >
              Employer Rating
            </Text>
            <View style={tw`flex flex-row gap-2`}>
              <Image
                source={images.greenstar}
                style={tw`object-contain shrink-0 self-center my-auto w-[20.83px] aspect-square`}
              />

              <Text
                style={tw`my-auto text-base tracking-tight text-center text-zinc-600`}
              >
                {formatNumber(ratings?.rating ?? 0)} Rating
              </Text>
            </View>
          </View>

          {/* Link to employee profile  */}

          <View style={tw`mt-2 mb-8`}>
            <View
              style={tw`flex flex-col items-start mt-3 tracking-tight mt-4 rounded-none max-w-[359px]`}
            >
              <Text
                style={tw`font-semibold leading-6 text-neutral-400 text-base tracking-tight`}
              >
                Shift Picked By
              </Text>

              <View style={tw`flex flex-row justify-between gap-5 w-full mt-1`}>
                <Text
                  style={tw`text-zinc-600 tracking-tight text-sm text-neutral-500`}
                >
                  {employee?.username}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/screens/EmployeeProfileDetails",
                      params: {
                        user_id: employee?.id,
                      },
                    })
                  }
                >
                  <Text
                    style={tw`text-zinc-600 tracking-tight text-sm text-green-700 underline`}
                  >
                    View Profile
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Jobseeker Rating Earned */}
          <View style={tw`flex flex-col gap-1`}>
            <Text
              style={tw`font-semibold leading-6 text-neutral-400 text-base tracking-tight`}
            >
              Job Seeker Rating Earned
            </Text>
            <View style={tw`flex flex-col gap-1`}>
              <View style={tw`flex flex-row gap-2`}>
                <Image
                  source={images.greenstar}
                  style={tw`object-contain shrink-0 self-center my-auto w-[20.83px] aspect-square`}
                />

                <Text
                  style={tw`my-auto text-base tracking-tight text-center text-zinc-600`}
                >
                  {formatNumber(ratings?.rating ?? 0)} Rating{" "}
                </Text>
              </View>
              <View style={tw`flex flex-row gap-2`}>
                <Image
                  source={images.greenapproval}
                  style={tw`object-contain shrink-0 self-center my-auto w-[20.83px] aspect-square`}
                />

                <Text
                  style={tw`my-auto text-base tracking-tight text-center text-zinc-600`}
                >
                  {formatNumber(ratings?.rating ?? 0)} Assurance
                </Text>
              </View>
            </View>
          </View>

          {/* Job Seeker Performance Review */}
          <View style={tw`flex flex-col gap-1 mt-4`}>
            <Text
              style={tw`font-semibold leading-6 text-neutral-400 text-base tracking-tight`}
            >
              Job Seeker Performance Review
            </Text>
            <View style={tw`flex flex-col`}>
              <Text
                style={tw`my-auto text-base tracking-tight text-zinc-600 mt-0.5`}
              >
                Arrival On Time -{" "}
                <Text style={tw`font-bold text-stone-900`}>
                  {review[0].onTime}
                </Text>
              </Text>

              <Text
                style={tw`my-auto text-base tracking-tight text-zinc-600 mt-0.5`}
              >
                Worker Conduct -{" "}
                <Text style={tw`font-bold text-stone-900`}>
                  {review[0].conduct}
                </Text>
              </Text>

              <Text
                style={tw`my-auto text-base tracking-tight text-zinc-600 mt-0.5`}
              >
                Willing To Work With Again -{" "}
                <Text style={tw`font-bold text-stone-900`}>
                  {review[0].workAgain}
                </Text>
              </Text>

              <Text
                style={tw`my-auto text-base tracking-tight text-zinc-600 mt-0.5`}
              >
                Additional Info -{" "}
                <Text style={tw`font-bold text-stone-900`}>
                  {review[0].additionalInfo}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShiftDetailsTaken;
