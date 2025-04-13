import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LocationDisplay } from "../components/LocationDisplay";
import { MetricDisplay } from "../components/MetricsDisplay";
import tw from "twrnc";
import { DateTimeDisplay } from "../components/DateTimeDisplay";
import { TotalEarnings } from "./components/TotalEarning";
import { Details } from "../components/ShiftDetailsDescription";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
import { ShiftDetailsProps } from "./types";
import { fetchEmployer, fetchShift } from "@/services/api_test";
import moment from "moment";
import ShiftDetailsBanner from "../components/ShiftDetailsBanner";
import { EmployerProps } from "./types";

const ShiftDetailsPreview: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<ShiftDetailsProps>();
  const [employer, setEmployer] = useState<EmployerProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShift(id);
        console.log("shift_id");
        setData(data);
        getEmployerDetails(data.employer);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getEmployerDetails = async (employer_id: string) => {
    try {
      const data = await fetchEmployer(employer_id);
      setEmployer(data);
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
      style={tw`flex-1 overflow-hidden flex-col p-1 items-start w-full bg-zinc-100 max-w-[480px]`}
      className="flex overflow-hidden flex-col items-start px-3.5 py-4 mx-auto w-full bg-zinc-100 max-w-[480px]"
    >
      <Text style={tw`text-2xl font-bold text-center text-stone-900`}>
        Shift Details
      </Text>

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

          <View style={tw`mt-2`}>
            <View
              style={tw`flex flex-col items-start mt-3 tracking-tight mt-4 rounded-none max-w-[359px]`}
            >
              <Text
                style={tw`font-semibold leading-6 text-neutral-400 text-base tracking-tight`}
              >
                Shift Posted By
              </Text>

              <View
                style={tw`flex flex-row justify-between gap-5 w-full mt-1 pb-5`}
              >
                <Text
                  style={tw`text-zinc-600 tracking-tight text-sm text-neutral-500`}
                >
                  {employer?.company_name}
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
        </View>
      </ScrollView>
    </View>
  );
};

export default ShiftDetailsPreview;
