import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LocationDisplay } from "../components/LocationDisplay";
import { MetricDisplay } from "../components/MetricsDisplay";
import tw from "twrnc";
import { DateTimeDisplay } from "../components/DateTimeDisplay";
import { ShiftsHeader } from "../components/ShiftsHeader";
import { ShiftDetailsBanner } from "../components/ShiftDetailsBanner";
import { TotalEarnings } from "../components/TotalEarning";
import { Details } from "../components/ShiftDetailsDescription";
import { fetchShift, fetchShiftRatings } from "@/services/api_test";
import { useLocalSearchParams } from "expo-router";
import { ShiftDetailsProps, ShiftRatingsProps } from "./types";
import { images } from "@/assets/images";
import moment from "moment";

const CompletedShiftDetails = () => {
  const gainedBadges = [
    { iconUri: images.star, text: "+40 Rating" },
    { iconUri: images.rating, text: "+35 Rank" },
  ];

  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<ShiftDetailsProps>();
  const [ratings, setRatings] = useState<ShiftRatingsProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

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
        }
      } catch (error) {
        console.error("Error fetching shift details or ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  //Function to format rating and assurance
  const formatNumber = (value: number) => {
    return value >= 0 ? `+${value}` : `${value}`;
  };

  if (loading)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator style={tw`my-auto`} size="large" color="green" />
      </View>
    );

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-start mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <View style={tw`text-2xl font-bold text-center mt-2.5 text-stone-900`}>
        <Text style={tw`text-2xl font-bold text-center text-stone-900`}>
          Completed Shift Details
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
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
          <View
            style={tw`z-10 self-center mt-6 text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
          >
            <Text
              style={tw`z-10 self-center mt-6 text-xs font-semibold leading-6 text-neutral-400`}
            >
              Gained
            </Text>
          </View>

          <View
            style={tw`flex flex-row gap-2.5 items-center self-center max-w-full text-xs tracking-tight text-center text-zinc-600 w-[193px] pb-9`}
          >
            <View
              style={tw`flex flex-row gap-0.5 items-center self-stretch my-auto`}
            >
              <Image
                source={images.greenstar}
                style={tw`object-contain shrink-0 self-stretch my-auto w-10 aspect-square`}
              />
              <View style={tw`self-stretch my-auto`}>
                <Text
                  style={tw`self-stretch my-auto text-xs tracking-tight text-center text-zinc-600`}
                >
                  {formatNumber(ratings?.rating ?? 0)} Rating
                </Text>
              </View>
            </View>

            <View
              style={tw`flex flex-row gap-0.5 items-center self-stretch my-auto`}
            >
              <Image
                source={images.greenapproval}
                style={tw`object-contain shrink-0 self-stretch my-auto w-10 aspect-square`}
              />
              <View style={tw`self-stretch my-auto`}>
                <Text
                  style={tw`self-stretch my-auto text-xs tracking-tight text-center text-zinc-600`}
                >
                  {formatNumber(ratings?.rating ?? 0)} Rank
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompletedShiftDetails;
