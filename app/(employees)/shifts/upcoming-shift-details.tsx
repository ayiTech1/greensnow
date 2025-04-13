import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import tw from "twrnc";

import { DateTimeDisplay } from "../components/DateTimeDisplay";
import { ShiftDetailsBanner } from "../components/ShiftDetailsBanner";
import { MetricDisplay } from "../components/MetricsDisplay";
import { TotalEarnings } from "../components/TotalEarning";
import { LocationDisplay } from "../components/LocationDisplay";
import { Details } from "../components/ShiftDetailsDescription";
import { ButtonProps, RatingIndicatorProps } from "../components/types";
import { ActionButton } from "../components/ActionButton";
import {
  deleteUpcomingShift,
  fetchShift,
  fetchUpcomingShiftsByEmployee,
} from "@/services/api_test";
import { router, useLocalSearchParams } from "expo-router";
import { ShiftDetailsProps } from "./types";
import moment from "moment";

const employeeId = "92453a49-e948-4e0a-804c-7dd58995b29b"; //Supply employee ID

export const UpComingShiftDetails: React.FC = () => {
  const [isCancelShiftModal, setisCancelShiftModal] = useState(false);
  const [isBeginShiftModal, setisBeginShiftModal] = useState(false);
  const [isAwaitingConfirmationModal, setisAwaitingConfirmationModal] =
    useState(false);

  const ratingData = [
    { icon: require("@/assets/images/star_red_icon.png"), value: "-10" },
    { icon: require("@/assets/images/rating_red_icon.png"), value: "-35" },
  ];

  const { id, upcoming_id } = useLocalSearchParams<{
    id: string;
    upcoming_id: string;
  }>();
  const [data, setData] = useState<ShiftDetailsProps>();
  const [loading, setLoading] = useState(true);
  const [isTImeForShift, setisTimeForShift] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShift(id);
        setData(data);
        //Check if the shift should start
        handleBeginShift(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBeginShift = (shiftData: ShiftDetailsProps) => {
    if (!shiftData) return;

    const currentTime = new Date();
    const shiftEndTime = new Date(shiftData.end_time);
    const shiftStartTime = new Date(shiftData.start_time);

    // Check if the shift has ended
    if (shiftEndTime <= currentTime) {
      console.log("Shift has already ended.");
      return;
    }

    // Check if the shift should start
    if (shiftStartTime <= currentTime) {
      console.log("Shift is starting now!");
      setisTimeForShift(true);
    }
  };

  const getTimeLeft = (time: Date) => {
    // Using JavaScript Date Object
    const currentTime = new Date();
    const targetTime = new Date(time);

    if (targetTime <= currentTime) {
      // If the end time has already passed
      setHoursLeft(0);
      setMinutesLeft(0);
      return;
    }

    const momentDiff = moment(targetTime).diff(moment(currentTime), "minutes");
    const momentHours = Math.floor(momentDiff / 60);
    const momentMinutes = momentDiff % 60;

    setHoursLeft(momentHours);
    setMinutesLeft(momentMinutes);
  };

  const handleDeleteUpcomingShift = async () => {
    try {
      const upcomingShiftDetails = await fetchUpcomingShiftsByEmployee(
        employeeId
      );
      await deleteUpcomingShift(upcomingShiftDetails[0].id);
      Alert.alert("Success", "Shift deleted successfully!");
      setisCancelShiftModal(false);
      router.replace("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      style={tw`flex-1 overflow-hidden items-center justify-center flex-col pb-9 mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <View style={tw`flex flex-row gap-10 self-center text-stone-900`}>
        <View style={tw`flex flex-col w-full items-start`}>
          <View style={tw`self-stretch text-2xl font-bold`}>
            <Text
              style={tw`self-stretch mt-2.5 text-2xl font-bold text-start text-stone-900`}
            >
              Shift Details
            </Text>
          </View>
        </View>
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

          {/* Begin shift Button */}
          {!isTImeForShift ? (
            <View
              style={tw`self-center px-16 py-4 mt-10 w-full text-xl font-semibold tracking-tight rounded-xl bg-stone-300 max-w-[327px]`}
            >
              <Text
                style={tw`text-zinc-500 self-center text-xl font-semibold tracking-tight`}
              >
                Begin Shift
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={tw`self-center px-16 py-4 mt-10 w-full text-xl font-semibold tracking-tight rounded-xl bg-green-700 max-w-[327px]`}
              onPress={() => {
                getTimeLeft(data?.end_time || new Date());
                setisBeginShiftModal(true);
              }}
            >
              <Text
                style={tw`text-white self-center text-xl font-semibold tracking-tight`}
              >
                Begin Shift
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={tw`self-center px-16 py-4 mt-4 w-full text-xl font-semibold tracking-tight rounded-xl bg-rose-600 max-w-[327px]`}
            onPress={() => {
              getTimeLeft(data?.start_time || new Date());
              setisCancelShiftModal(true);
            }}
          >
            <Text
              style={tw`text-white self-center text-xl font-semibold tracking-tight`}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modalcomponent */}
      <Modal
        visible={isCancelShiftModal}
        onRequestClose={() => setisCancelShiftModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto w-[90%]`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setisCancelShiftModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={require("@/assets/images/close_icon.png")}
                style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
                accessibilityLabel="Close modal"
              />
            </TouchableOpacity>

            <View
              style={tw`mt-16 text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
            >
              <Text
                style={tw`text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
              >
                Are you sure you{"\n"}want to cancel?
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                {hoursLeft} hours {minutesLeft} minutes for shift to start.
              </Text>
            </View>

            <View
              style={tw`self-start mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Your assurance and ratings would drop if you cancel now. Severe
                consequences if you do not show up
              </Text>
            </View>

            <View
              style={tw`flex flex-row gap-1.5 items-start mt-3.5 text-xs tracking-tight text-center text-rose-600 whitespace-nowrap w-[110px]`}
            >
              {ratingData.map((rating, index) => (
                <RatingIndicator
                  key={index}
                  icon={rating.icon}
                  value={rating.value}
                />
              ))}
            </View>

            <View style={tw`mt-6 text-xs tracking-tight text-center`}>
              <Text style={tw`mt-6 text-xs tracking-tight text-center`}>
                You will not be able to take this shift again
              </Text>
            </View>

            <ActionButton
              label="Cancel"
              onPress={() => handleDeleteUpcomingShift()}
              isEnabled={true}
              className="px-16 py-2.5 mt-5 max-w-full text-xl font-semibold tracking-tight text-white whitespace-nowrap bg-rose-600 rounded-md w-[193px]"
            />
          </View>
        </View>
      </Modal>

      {/* Begin shift modal */}
      <Modal
        visible={isBeginShiftModal}
        onRequestClose={() => setisBeginShiftModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto w-full`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setisBeginShiftModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={require("@/assets/images/close_icon.png")}
                style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
                accessibilityLabel="Close modal"
              />
            </TouchableOpacity>

            <View
              style={tw`mt-16 text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
            >
              <Text
                style={tw`text-xl font-extrabold tracking-tight leading-6 text-zinc-800 text-center`}
              >
                Make sure you at the job site
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                {hoursLeft} hours {minutesLeft} minutes for shift to end.
              </Text>
            </View>

            <View
              style={tw`self-start mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Once you begin, we will await confirmation from your employer to
                verify that you are on site and ready to work.
              </Text>
            </View>

            <View style={tw`mt-6 text-xs tracking-tight text-center`}>
              <Text style={tw`mt-6 text-xs tracking-tight text-center`}>
                Shift countdown will begin after employer confirms shift start.
              </Text>
            </View>

            <ActionButton
              label="Begin"
              onPress={() => {
                getTimeLeft(data?.end_time || new Date());
                setisBeginShiftModal(false);
                setisAwaitingConfirmationModal(true);
              }}
              isEnabled={true}
              className="px-16 py-2.5 mt-7 max-w-full rounded-md w-[193px]"
            />
          </View>
        </View>
      </Modal>

      {/* awating shift confirmation modal ----------------------------------------------------------------------------*/}
      <Modal
        visible={isAwaitingConfirmationModal}
        onRequestClose={() => setisAwaitingConfirmationModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto w-full`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setisAwaitingConfirmationModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={require("@/assets/images/close_icon.png")}
                style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
                accessibilityLabel="Close modal"
              />
            </TouchableOpacity>

            <View
              style={tw`mt-16 text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
            >
              <Text
                style={tw`text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
              >
                Awaiting Confirmation To Begin Your Shift
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                {hoursLeft} hours {minutesLeft} minutes for shift to end.
              </Text>
            </View>

            <View style={tw`mt-6 text-xs tracking-tight text-center`}>
              <Text style={tw`mt-6 text-xs tracking-tight text-center`}>
                Shift countdown will begin after employer confirms shift start.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const RatingIndicator: React.FC<RatingIndicatorProps> = ({ icon, value }) => {
  return (
    <View style={tw`flex flex-row flex-1 shrink gap-0.5 items-center basis-0`}>
      <Image
        source={icon}
        style={tw`object-contain shrink-0 self-stretch my-auto w-5 aspect-square`}
        accessibilityLabel={`Rating indicator showing ${value}`}
      />
      <View style={tw`self-stretch my-auto`}>
        <Text
          style={tw`text-xs tracking-tight text-center text-rose-600 whitespace-nowrap`}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export default UpComingShiftDetails;
