import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { LocationDisplay } from "./components/LocationDisplay";
import { MetricDisplay } from "./components/MetricsDisplay";
import tw from "twrnc";
import { DateTimeDisplay } from "./components/DateTimeDisplay";
import ShiftDetailsBanner from "./components/ShiftDetailsBanner";
import { TotalEarnings } from "./components/TotalEarning";
import { Details } from "./components/ShiftDetailsDescription";
import { RequiredItems } from "./components/ItemsCheckList";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { createShift, fetchEmployer } from "@/services/api_test";
import { EmployerProps } from "./types";
import uuid from "react-native-uuid";

const employerId = "92453a49-e948-4e0a-804c-7dd58995b217";

const CreateShiftDetailsPreview: React.FC = () => {
  const [isSubmitShiftModal, setisSubmitShiftModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employer, setEmployer] = useState<EmployerProps>();
  const {
    shiftType,
    date,
    time,
    endTime,
    hourlyRate,
    numberOfHours,
    numberOfOpenings,
    location,
    description,
    requiredItems,
    notAllowedItems,
  } = useLocalSearchParams<{
    shiftType: string;
    hourlyRate: string;
    date: string;
    time: string;
    endTime: string;
    numberOfHours: string;
    numberOfOpenings: string;
    location: string;
    description: string;
    requiredItems: string;
    notAllowedItems: string;
  }>();

  // calculate total earnings
  const totalEarnings = +hourlyRate * +numberOfHours;

  // Replace with actual authentication token if needed
  const authToken = "your_token_here";

  //Get company name
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEmployer(employerId);
        setEmployer(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateShift = async () => {
    const userId = uuid.v4(); // Generate a new UUID for user

    console.log("Creating shift with user ID:", userId);
    try {
      const newShift = {
        id: userId,
        name: shiftType,
        location: location,
        date: new Date(date),
        background_image_url:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/5d39e68ac8e6f65c8f0802b579ba00d28ef135baad94913e4bf910ed7bc5a4b4?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5",
        company_name: employer?.company_name || "Unknown Company",
        salary_per_time: hourlyRate,
        shift_duration: numberOfHours,
        number_of_openings: numberOfOpenings,
        openings_left: numberOfOpenings,
        location_map: "https://maps.app.goo.gl/XSQovWf5AyajfmKf7",
        start_time: new Date(time),
        end_time: new Date(endTime),
        requirement_items: JSON.parse(requiredItems),
        disallowed_items: JSON.parse(notAllowedItems),
        requirement_description: description,
        status: "PENDING",
        created_at: new Date(),
        updated_at: new Date(),
        employer: employerId, //supply user id here
        total_earning: totalEarnings,
      };

      const response = await createShift(newShift, authToken);

      Alert.alert("Success", "Shift created successfully!");
      router.push("/");
      console.log(response);
    } catch (error: any) {
      if (error.response) {
        console.error("Error Data:", error.response.data); // Log server response
        Alert.alert("Error", JSON.stringify(error.response.data)); // Show error in UI
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  if (loading)
    return (
      <View style={tw`flex-1 items-center bg-zinc-100`}>
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
    >
      <Text style={tw`text-2xl font-bold text-center text-stone-900`}>
        Shift Details
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={tw`flex flex-col items-start self-stretch mt-2.5`}
          className="flex flex-col items-center self-stretch mt-2.5"
        >
          <DateTimeDisplay
            date={moment(date).format("ddd, Do MMM")}
            time={moment(time).format("hh:mm A")}
          />

          <ShiftDetailsBanner
            backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/e9e22974a8cab7de7ade9ef3581d4d7d8c9af88c24f37539b7a88183f9fa7ea5?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
            jobTitle={shiftType}
            companyName={employer?.company_name || "Unknown Company"}
          />

          <MetricDisplay
            leftValue={"$" + parseFloat(hourlyRate).toFixed(2)}
            leftLabel="Hourly rate"
            rightValue={numberOfHours + " HRS"}
            rightLabel="Duration"
          />

          <TotalEarnings totalEarnings={totalEarnings} />

          <LocationDisplay
            address={location}
            mapImageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/bd168c1c64b133f2d4d9e3c84c1312dffacfbdccf2b8317ffcd8ad231338fdbc?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
          />

          <MetricDisplay
            leftValue={moment(time).format("hh:mm A")}
            leftLabel="start time"
            rightValue={moment(endTime).format("hh:mm A")}
            rightLabel="End Time"
          />

          <View style={tw`mt-2 self-start`}>
            <Details description={description} />
          </View>

          {JSON.parse(requiredItems).length !== 0 && (
            <Text
              style={tw`self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
            >
              Required
            </Text>
          )}

          <ScrollView horizontal={true}>
            <View style={tw`flex flex-row self-stretch w-full`}>
              {JSON.parse(requiredItems).map((item: string, index: number) => (
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

          {JSON.parse(notAllowedItems).length !== 0 && (
            <Text
              style={tw`self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
            >
              Not Allowed
            </Text>
          )}

          <ScrollView horizontal={true} contentContainerStyle={tw`items-start`}>
            <View style={tw`flex flex-row self-stretch w-full`}>
              {JSON.parse(notAllowedItems).map(
                (item: string, index: number) => (
                  <RequiredItems
                    key={index}
                    imageUrl={images.shoe}
                    title={item}
                    subtitle="More Info"
                    description="Worker boots to protect the feet and to protect the feet and Worker boots to protect the feet and"
                    isRequired={true}
                    isSelectable={false}
                  />
                )
              )}
            </View>
          </ScrollView>
        </View>
        <View style={tw`self-center`}>
          <ActionButton
            buttonStyle="py-3 px-1"
            isEnabled={true}
            label="Submit For Review"
            onPress={() => {
              setisSubmitShiftModal(true);
            }}
          />
        </View>
      </ScrollView>

      {/* Begin shift modal */}
      <Modal
        visible={isSubmitShiftModal}
        onRequestClose={() => setisSubmitShiftModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex self-center rounded-none max-w-[322px] mt-auto mb-auto overflow-hidden`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-8 w-[322px] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setisSubmitShiftModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={images.closeicon}
                style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
                accessibilityLabel="Close modal"
              />
            </TouchableOpacity>

            <View style={tw`mt-8`}>
              <Text
                style={tw`text-xl text-center font-extrabold tracking-tight leading-6 text-zinc-800`}
              >
                Your Shift Will Be Reviewed{"\n"}And Posted Once It Has{"\n"}
                Been Approved
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center mb-3`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                Proceed to submission?
              </Text>
            </View>

            <Text style={tw`text-sm tracking-tight text-center text-zinc-600`}>
              You will be notified once your shift has been approved.
            </Text>

            <View style={tw`self-center`}>
              <ActionButton
                label="Submit"
                onPress={() => {
                  handleCreateShift();
                  setisSubmitShiftModal(false);
                }}
                isEnabled={true}
                buttonStyle="px-15 py-2.5 mt-7 max-w-full rounded-md w-[193px]"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateShiftDetailsPreview;
