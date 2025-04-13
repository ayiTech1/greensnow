import * as React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { LocationDisplay } from "../components/LocationDisplay";
import { MetricDisplay } from "../components/MetricsDisplay";
import tw from "twrnc";
import { DateTimeDisplay } from "../components/DateTimeDisplay";
import { useRouter } from "expo-router";

import { ShiftDetailsBanner } from "../components/ShiftDetailsBanner";
import { TotalEarnings } from "../components/TotalEarning";
import { Details } from "../components/ShiftDetailsDescription";
import { ShiftDetailsRequired } from "../components/ShiftDetailsRequired";
import { RequiredItems } from "../components/ItemsCheckList";

export const ShiftDetails: React.FC = () => {
  const router = useRouter();

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-start px-3.5 py-10 mx-auto w-full bg-zinc-100 max-w-[480px]`}
      className="flex overflow-hidden flex-col items-start px-3.5 py-4 mx-auto w-full bg-zinc-100 max-w-[480px]"
    >
      <View
        style={tw`text-2xl font-bold text-center text-stone-900`}
        className="text-2xl font-bold text-center text-stone-900"
      >
        <Text style={tw`text-2xl font-bold text-center text-stone-900`}>
          Shift Details
        </Text>
      </View>
      <ScrollView>
        <View
          style={tw`flex flex-col items-center self-stretch mt-2.5`}
          className="flex flex-col items-center self-stretch mt-2.5"
        >
          <DateTimeDisplay date="Tue, 10th Dec" time="12:00 AM" />

          <ShiftDetailsBanner
            backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/e9e22974a8cab7de7ade9ef3581d4d7d8c9af88c24f37539b7a88183f9fa7ea5?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
            jobTitle="General Labor"
            companyName="Transgate Construction"
          />

          <MetricDisplay
            leftValue="$17.50"
            leftLabel="Hourly rate"
            rightValue="8 HRS"
            rightLabel="Duration"
          />

          <TotalEarnings totalEarnings={140} />

          <LocationDisplay
            address="1180 Barlow Trail NE, Calgary, AB T3J, Canada"
            mapImageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/bd168c1c64b133f2d4d9e3c84c1312dffacfbdccf2b8317ffcd8ad231338fdbc?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
          />

          {/* Map View */}
          {/* <View style={tw`flex bg-black w-`}> 
        <Map />
        </View> */}

          <MetricDisplay
            leftValue="12:00AM"
            leftLabel="start time"
            rightValue="8:00AM"
            rightLabel="End Time"
          />

          <Details description="Discover millions of gigs and get in touch with gig hirers as seamless as it comes. Discover millions of gigs and get in touch with gig hirers as seamless as it comes. Discover millions of gigs and get in touch with gig hirers as seamless as it comes. Discover millions of gigs and get in touch with gig hirers as seamless as it comes." />

          <Text
            style={tw`self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
          >
            Required
          </Text>

          <View style={tw`self-stretch w-full`}>
            <RequiredItems
              requiredItems={[
                {
                  imageUrl: require("@/assets/images/shoe.png"),
                  title: "Worker Boot",
                  subtitle: "More info",
                  description:
                    "Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and",
                  isRequired: true,
                  isSelectable: false,
                },
                {
                  imageUrl: require("@/assets/images/shoe.png"),
                  title: "Worker Boot",
                  subtitle: "More info",
                  description:
                    "Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and",
                  isRequired: true,
                  isSelectable: false,
                },
                {
                  imageUrl: require("@/assets/images/shoe.png"),
                  title: "Worker Boot",
                  subtitle: "More info",
                  description:
                    "Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and",
                  isRequired: true,
                  isSelectable: false,
                },
              ]}
            />
          </View>

          <ScrollView horizontal={true}>
            <TouchableOpacity
              style={tw`flex flex-col mt-3 max-w-full w-[327px]`}
              accessibilityRole="button"
              accessibilityLabel="Proceed with shift details"
              onPress={() => router.push("./shift-requirement")}
            >
              <View style={tw`px-8 py-4 bg-green-700 rounded-xl`}>
                <Text
                  style={tw`text-xl font-semibold tracking-tight text-white text-center`}
                >
                  Proceed
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShiftDetails;
