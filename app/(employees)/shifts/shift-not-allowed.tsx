import * as React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { ActionButton } from "../components/ActionButton";
import { ShiftsHeader } from "../components/ShiftsHeader";
import { RequiredItems } from "../components/ItemsCheckList";
import { images } from "@/assets/images";
import { fetchShift } from "@/services/api_test";
import { useLocalSearchParams } from "expo-router";
import { ShiftDetailsProps } from "./types";
import { router } from "expo-router";

const ShiftsNotAllowed: React.FC = () => {
  const buttons = [
    {
      text: "Continue",
      customStyle: "bg-stone-300 text-zinc-500",
      marginTop: "mt-72",
    },
    {
      text: "Cancel",
      customStyle: "border border-green-700 border-solid text-stone-900",
      marginTop: "mt-4",
    },
  ];

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [allItemsSelected, setAllItemsSelected] = React.useState(false); // To track if all items are selected
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = React.useState<ShiftDetailsProps>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  React.useEffect(() => {
    const checkAllItemsSelected = data?.disallowed_items.every((item: string) =>
      selectedItems.includes(item)
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
      style={tw`flex-1 overflow-hidden items-start flex-col mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <View
        style={tw`self-start text-2xl font-bold text-center text-stone-900`}
      >
        <Text
          style={tw`self-start text-2xl font-bold text-center text-stone-900`}
        >
          Not allowed
        </Text>
      </View>

      <View style={tw`mt-7 w-full`}>
        <Text style={tw`text-xs tracking-tight text-zinc-600`}>
          The following items are not allowed either on the work site or while
          or while working due safety concerns and regulations.
        </Text>
      </View>
      <View style={tw`mt-3 w-full`}>
        <Text style={tw`text-xs tracking-tight text-zinc-600`}>
          If you do not meet these requirements, you may be sent home and will
          lose Rating and Rank.
        </Text>
      </View>
      <View
        style={tw`self-start mt-4 text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
      >
        <Text
          style={tw`self-start text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
        >
          Not Allowed
        </Text>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={tw`flex flex-row h-45 self-stretch  w-full`}>
          {data?.disallowed_items.map((item: string, index: number) => (
            <RequiredItems
              key={index}
              imageUrl={images.shoe}
              title={item}
              subtitle="More Info"
              description="Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and"
              isRequired={false}
              isSelectable={true}
              onTap={handleItemSelect}
            />
          ))}
        </View>
      </ScrollView>

      <View style={tw`flex flex-col items-center w-full absolute bottom-0`}>
        {allItemsSelected ? (
          <ActionButton
            label="Continue"
            isEnabled={true}
            onPress={() =>
              router.push({
                pathname: "/screens/confirm-shift",
                params: { id: id },
              })
            }
            className=""
          />
        ) : (
          <ActionButton
            label="Continue"
            isEnabled={false}
            onPress={() => {}}
            className="bg-stone-300 text-zinc-500"
          />
        )}

        <View style={tw`flex flex-col self-center items-center w-[300px]`}>
          <TouchableOpacity
            onPress={() => {}}
            style={tw`self-center px-16 py-4 mt-5 w-full rounded-xl max-w-[327px] border border-green-700`}
            accessibilityRole="button"
          >
            <Text style={tw`text-xl font-semibold tracking-tight text-center`}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ShiftsNotAllowed;
