import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Import useRouter for navigation
import { PenaltyCard } from "../components/PenaltyCard";
import { RequiredItems } from "../components/ItemsCheckList";
import tw from "twrnc";
import { fetchShift } from "@/services/api_test";
import { ShiftDetailsProps } from "./types";
import { images } from "@/assets/images";

const penaltyData = {
  title: "Showing up unprepared",
  penalties: [
    {
      icon: require("@/assets/images/star.png"),
      text: "-40 Rating",
    },
    {
      icon: require("@/assets/images/rating.png"),
      text: "-35 Rank",
    },
  ],
};

const ShiftRequirement = () => {
  const router = useRouter(); // Use router for navigation
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allItemsSelected, setAllItemsSelected] = useState(false); // To track if all items are selected
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<ShiftDetailsProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShift(id);
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleItemSelect = (itemTitle: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemTitle)) {
        return prev.filter((item) => item !== itemTitle);
      } else {
        return [...prev, itemTitle];
      }
    });
  };

  // Check if all required items are selected
  useEffect(() => {
    const checkAllItemsSelected = data?.requirement_items.every(
      (item: string) => selectedItems.includes(item)
    );
    setAllItemsSelected(checkAllItemsSelected); // Update the state for all items selected
  }, [selectedItems]); // Re-run the check whenever selectedItems changes

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
      style={tw`flex-1 overflow-hidden flex-col mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <View style={tw`self-start`}>
        <Text
          style={tw`self-start text-2xl font-bold text-center text-stone-900`}
        >
          Requirements
        </Text>
      </View>
      <ScrollView>
        <View style={tw`mt-7`}>
          <Text style={tw`mt-7 text-xs tracking-tight text-zinc-600`}>
            Failure to bring the required items or to meet the requirements will
            result in you being <Text style={tw`font-bold`}>sent home</Text>.
            This will lead to the loss of Rank and Rating points and may result
            in the <Text style={tw`font-bold`}>suspension</Text> or{" "}
            <Text style={tw`font-bold`}>deactivation</Text> of your account.
          </Text>
        </View>

        <PenaltyCard
          title={penaltyData.title}
          penalties={penaltyData.penalties}
        />

        <View style={tw`mt-12`}>
          <Text style={tw`text-sm font-semibold tracking-tight text-zinc-600`}>
            Confirm you have the required gear by tapping the cards below:
          </Text>
        </View>

        <View style={tw`self-start mt-3.5`}>
          <Text style={tw`flex text-start text-zinc-500 w-[83px]`}>
            Required
          </Text>
        </View>

        {/* Render required items */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={tw`flex flex-row self-stretch  w-full`}>
            {data?.requirement_items.map((item: string, index: number) => (
              <RequiredItems
                key={index}
                imageUrl={images.shoe}
                title={item}
                subtitle="More Info"
                description="Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and"
                isRequired={true}
                isSelectable={true}
                onTap={handleItemSelect}
              />
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => {
            if (allItemsSelected) {
              data?.disallowed_items.length > 0
                ? router.push({
                    pathname: "./shift-not-allowed",
                    params: { id: id },
                  })
                : router.push({
                    pathname: "/screens/confirm-shift",
                    params: { id: id },
                  });
            }
          }}
          style={tw`self-center px-16 py-4 mt-16 w-full rounded-xl max-w-[327px] ${
            allItemsSelected ? "bg-green-700" : "bg-gray-400"
          }`}
          accessibilityRole="button"
          disabled={!allItemsSelected}
        >
          <Text
            style={tw`text-xl font-semibold tracking-tight text-center text-white `}
          >
            Continue
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <View style={tw`flex flex-col self-center items-center w-[327px]`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`self-center px-16 py-4 mt-5 w-full rounded-xl max-w-[327px] border border-green-700`}
            accessibilityRole="button"
          >
            <Text style={tw`text-xl font-semibold tracking-tight text-center`}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ShiftRequirement;
