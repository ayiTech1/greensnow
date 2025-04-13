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
import { ShiftDetailsRequired } from "../components/ShiftDetailsRequired";
import { RequiredItems } from "../components/ItemsCheckList";
import { images } from "@/assets/images";
import { router, useLocalSearchParams } from "expo-router";
import { fetchShift } from "@/services/api_test";
import { ShiftDetailsProps } from "./types";
import moment from "moment";

const AvailableShiftDetails: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<ShiftDetailsProps>();
  const [loading, setLoading] = useState(true);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShift(id);
        setData(data);
        checkIfShiftEnded(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const checkIfShiftEnded = (shiftData: ShiftDetailsProps) => {
    if (!shiftData) return;

    const currentTime = new Date();
    const shiftEndTime = new Date(shiftData.end_time);

    // Check if the shift has ended
    if (shiftEndTime <= currentTime) {
      console.log("Shift has already ended.");
      setIsEnded(true);
    }
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
      style={tw`flex-1 overflow-hidden flex-col items-start mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <View
        style={tw`text-2xl font-bold text-center text-stone-900`}
        className="text-2xl font-bold text-center text-stone-900"
      >
        <Text style={tw`text-2xl font-bold text-center text-stone-900`}>
          Shift Details
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

          <View style={tw`mt-2 mb-5`}>
            <Details description={data?.requirement_description || ""} />
          </View>
          {data?.requirement_items.length > 0 && (
            <Text
              style={tw`self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
            >
              Required
            </Text>
          )}
          <ScrollView horizontal={true}>
            <View style={tw`flex flex-row self-stretch  w-full`}>
              {data?.requirement_items.map((item: string, index: number) => (
                <RequiredItems
                  key={index}
                  imageUrl={images.shoe}
                  title={item}
                  subtitle="More Info"
                  description="Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and"
                  isRequired={true}
                  isSelectable={false}
                />
              ))}
            </View>
          </ScrollView>

          {isEnded ? (
            <View
              style={tw`self-center px-16 py-4 mt-10 w-full text-xl font-semibold tracking-tight rounded-xl bg-stone-300 max-w-[327px]`}
            >
              <Text
                style={tw`text-zinc-500 self-center text-xl font-semibold tracking-tight`}
              >
                Proceed
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={tw`flex flex-col mt-3 max-w-full w-[327px]`}
              accessibilityRole="button"
              accessibilityLabel="Proceed with shift details"
              onPress={() => {
                const path =
                  data?.requirement_items.length > 0
                    ? "/shifts/shift-requirement"
                    : data?.disallowed_items.length > 0
                    ? "/shifts/shift-not-allowed"
                    : "/screens/confirm-shift";
                router.push({
                  pathname: path,
                  params: { id: id },
                });
              }}
            >
              <View style={tw`px-8 py-4 bg-green-700 rounded-xl`}>
                <Text
                  style={tw`text-xl font-semibold tracking-tight text-white text-center`}
                >
                  Proceed
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AvailableShiftDetails;
