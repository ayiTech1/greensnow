import * as React from "react";
import { View, Image, Text, Alert, ActivityIndicator } from "react-native";
// import { ConfirmationMessage } from "./ConfirmationMessage";
import { ShiftConfirmationDetails } from "../components/ShiftConfirmationDetails";
import { ConfirmShiftTimer } from "../components/ConfirmShiftTimer";
// import { ConfirmButton } from "./ConfirmButton";
import tw from "twrnc";
import { ActionButton } from "../components/ActionButton";
import { images } from "@/assets/images";
import { applyForShift, fetchShift } from "@/services/api_test";
import { router, useLocalSearchParams } from "expo-router";
import { ShiftDetailsProps } from "../shifts/types";

const employeeId = "92453a49e9484e0a804c7dd58995b29a";

const ShiftConfirmationScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = React.useState<ShiftDetailsProps>();
  const [loading, setLoading] = React.useState(true);
  // Replace with actual authentication token if needed
  const authToken = "your_token_here";

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

  // const handleShiftApplication = async () => {
  //   const userId = uuid.v4(); // Generate a new UUID for user

  //   console.log("Creating shift with user ID:", userId);
  //   try {
  //     const newShiftApplication = {
  //       id: userId,
  //       shift: id,
  //       employee: employeeId,
  //       status: "PENDING",
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     };

  //     const response = await createShiftApplication(
  //       newShiftApplication,
  //       authToken
  //     );

  //     Alert.alert("Success", "Application created successfully!");
  //     router.push("../(tabs)/shift");
  //     console.log(response);
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.error("Error Data:", error.response.data); // Log server response
  //       Alert.alert("Error", JSON.stringify(error.response.data)); // Show error in UI
  //     } else {
  //       console.error("Error:", error.message);
  //       Alert.alert("Error", "Something went wrong.");
  //     }
  //   }
  // };

  const handleApply = async () => {
    setLoading(true);
    try {
      const response = await applyForShift(id, employeeId);
      Alert.alert("Success", `Application status: ${response.status}`);
      router.push("../(tabs)/shift");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  if (!data)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center pb-20 mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator style={tw`mt-[90%]`} size="large" color="green" />
      </View>
    );
  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center p-5 mx-auto pt-20 w-full bg-zinc-100 max-w-[480px] text-stone-900`}
    >
      <View style={tw`flex w-full mt-auto mb-auto`}>
        <Image
          accessible={true}
          accessibilityLabel="Shift confirmation illustration"
          source={images.completed}
          style={tw`object-contain aspect-[1.36]`}
        />
        <View
          style={tw`mt-16 text-2xl font-extrabold tracking-tighter leading-none text-center`}
        >
          <Text
            style={tw`text-2xl font-extrabold tracking-tighter leading-none text-center`}
          >
            You took the shift!
          </Text>
        </View>
        <ShiftConfirmationDetails
          company={data.company_name}
          date={data?.date ? data.date.toString() : ""}
        />
        <ConfirmShiftTimer shiftDate={data.date} />
        <ActionButton
          onPress={() => handleApply()}
          label="Confirm"
          isEnabled={true}
          className="self-stretch px-16 py-4 whitespace-nowrap"
        />
      </View>
    </View>
  );
};

export default ShiftConfirmationScreen;
