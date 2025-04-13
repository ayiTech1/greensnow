import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LocationDisplay } from "../components/LocationDisplay";
import { MetricDisplay } from "../components/MetricsDisplay";
import tw from "twrnc";
import { DateTimeDisplay } from "./components/DateTimeDisplay";
import { TotalEarnings } from "./components/TotalEarning";
import { Details } from "../components/ShiftDetailsDescription";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
import moment from "moment";
import {
  EmployeeProps,
  OngoingShiftProps,
  ShiftDetailsProps,
  UserProps,
} from "./types";
import { images } from "@/assets/images";
import {
  fetchEmployee,
  fetchOngoingShift,
  fetchShift,
  fetchShiftRatings,
  fetchUser,
} from "@/services/api_test";
import ShiftDetailsBanner from "./components/ShiftDetailsBanner";
import { ShiftRatingsProps } from "@/services/types";

const ShiftDetailsPreview: React.FC = () => {
  const { shift_id } = useLocalSearchParams<{
    shift_id: string;
    employee_id: string;
  }>();
  const [data, setData] = useState<ShiftDetailsProps>();
  const [ongoing, setOngoing] = useState<OngoingShiftProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<UserProps>();
  const [employeeData, setEmployeeData] = useState<EmployeeProps>();

  const [ratings, setRatings] = useState<ShiftRatingsProps>();
  const [review, setReview] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [shiftData, ratingsDataRaw] = await Promise.all([
          fetchShift(shift_id),
          fetchShiftRatings(shift_id),
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
      } finally {
        setLoading(false);
      }
    };

    loadData();
    loadOngoingShift();
  }, [shift_id]);

  const loadOngoingShift = async () => {
    try {
      const data = await fetchOngoingShift(shift_id);
      if (Array.isArray(data) && data.length > 0) {
        console.log("Ongoing Data:", data[0]);
        // setOngoingData(data[0]);
        console.log("Ongoing data", data[0]);
        getEmployeeDetails(data[0].employee);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeDetails = async (employee_id: string) => {
    try {
      const data = await fetchEmployee(employee_id);
      setEmployeeData(data);
      getEmployeeUserDetails(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeUserDetails = async (uid: string) => {
    try {
      const userData = await fetchUser(uid);
      setEmployee(userData);
    } catch (error) {
      console.error(error);
    }
  };

  //Function to format rating and assurance
  const formatNumber = (value: number) => {
    return value >= 0 ? `+${value}` : `${value}`;
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
      style={tw`flex-1 overflow-hidden  flex-col p-1 items-center justify-center w-full bg-zinc-100 max-w-[480px]`}
      className="flex overflow-hidden flex-col items-start px-3.5 py-4 mx-auto w-full bg-zinc-100 max-w-[480px]"
    >
      {/* header-------------------------------------------------- */}
      <View style={tw`flex self-start`}>
        <Text style={tw`text-2xl font-bold text-start text-stone-900`}>
          Completed Shift Details
        </Text>
      </View>

      {/* body....................................?. */}
      <ScrollView>
        <View style={tw`flex mt-1.5 max-w-full`}>
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
            leftValue={
              "$" + parseFloat(data?.salary_per_time || "0").toFixed(2)
            }
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

          <View style={tw`mt-2`}>
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
                      pathname: "/shifts/ShiftPickerProfile",
                      params: {
                        id: employee?.id,
                        name: employee?.username,
                        phone: employee?.phone,
                        rating: employeeData?.rating,
                        assurance: employeeData?.assurance,
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

          <View
            style={tw`z-10 self-center text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
          >
            <Text
              style={tw`z-10 self-center mt-6 text-xs font-semibold leading-6 text-neutral-400`}
            >
              Your Rating
            </Text>
          </View>

          <View
            style={tw`flex flex-row gap-2.5 items-center justify-center self-center max-w-full w-[193px]`}
          >
            <Image
              source={images.greenstar}
              style={tw`object-contain shrink-0 self-center my-auto w-[31.67px] aspect-square`}
            />

            <Text
              style={tw`my-auto text-xs tracking-tight text-center text-zinc-600`}
            >
              {formatNumber(ratings?.rating ?? 0)} Rating
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShiftDetailsPreview;
