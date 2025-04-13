import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
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
import { createShift, fetchEmployer, updateShift } from "@/services/api_test";
import { EmployerProps } from "./types";

const ShiftDetailsPreview: React.FC = () => {
  const [isSubmitShiftModal, setisSubmitShiftModal] = useState(false);
  const [employer, setEmployer] = useState<EmployerProps>();
  const {
    id,
    employer_id,
    company_name,
    shiftType,
    date,
    time,
    endTime,
    hourlyRate,
    numberOfHours,
    numberOfOpenings,
    location,
    description,
    background_image_url,
    required_items,
    not_allowed_items,
    status,
    created_at,
  } = useLocalSearchParams<{
    id: string;
    employer_id: string;
    shiftType: string;
    hourlyRate: string;
    date: string;
    time: string;
    endTime: string;
    numberOfHours: string;
    numberOfOpenings: string;
    location: string;
    description: string;
    background_image_url: string;
    required_items: string;
    not_allowed_items: string;
    rank_id: string;
    rate_id: string;
    status: string;
    created_at: string;
    company_name: string;
  }>();

  // calculate total earnings
  const totalEarnings = +hourlyRate * +numberOfHours;

  // Replace with actual authentication token if needed
  const authToken = "your_token_here";

  const handleCreateShift = async () => {
    try {
      const newShift = {
        id: id,
        name: shiftType,
        location: location,
        date: new Date(date),
        background_image_url: background_image_url,
        company_name: company_name,
        salary_per_time: hourlyRate,
        shift_duration: numberOfHours,
        number_of_openings: numberOfOpenings,
        openings_left: numberOfOpenings,
        location_map: "https://maps.app.goo.gl/XSQovWf5AyajfmKf7",
        start_time: new Date(time),
        end_time: new Date(endTime),
        requirement_items: JSON.parse(required_items),
        disallowed_items: JSON.parse(not_allowed_items),
        requirement_description: description,
        status: "PENDING",
        created_at: new Date(created_at),
        updated_at: new Date(),
        employer: employer_id,
        total_earning: totalEarnings,
      };

      const response = await updateShift(newShift, id, authToken);

      Alert.alert("Success", "Shift updated successfully!");
      router.push("../screens/confirm-shift");
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

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col p-1 items-start w-full bg-zinc-100 max-w-[480px]`}
      className="flex overflow-hidden flex-col items-start px-3.5 py-4 mx-auto w-full bg-zinc-100 max-w-[480px]"
    >
      <Text style={tw`text-2xl font-bold text-center text-stone-900`}>
        Shift Details
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={tw`flex flex-col items-center self-stretch mt-2.5`}
          className="flex flex-col items-center self-stretch mt-2.5"
        >
          <DateTimeDisplay
            date={moment(date).format("ddd, Do MMM")}
            time={moment(time).format("hh:mm A")}
          />

          <ShiftDetailsBanner
            backgroundImage={background_image_url}
            jobTitle={shiftType}
            companyName="Transgate Construction"
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
          {JSON.parse(required_items).length !== 0 && (
            <Text
              style={tw`self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
            >
              Required
            </Text>
          )}

          <View style={tw`self-stretch w-full`}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={tw`items-start`}
              showsHorizontalScrollIndicator={false}
            >
              <View style={tw`flex flex-row  w-full`}>
                {JSON.parse(required_items).map(
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
            {JSON.parse(not_allowed_items).length !== 0 && (
              <Text
                style={tw`self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
              >
                Not Allowed
              </Text>
            )}

            <ScrollView
              horizontal={true}
              contentContainerStyle={tw`items-start`}
              showsHorizontalScrollIndicator={false}
            >
              <View style={tw`flex flex-row  w-full`}>
                {JSON.parse(not_allowed_items).map(
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
              className="py-3 px-1"
              isEnabled={true}
              label="Submit For Review"
              onPress={() => {
                setisSubmitShiftModal(true);
              }}
            />
          </View>
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
                className="px-15 py-2.5 mt-7 max-w-full rounded-md w-[193px]"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShiftDetailsPreview;
