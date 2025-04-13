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
  LogBox,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import tw from "twrnc";
import { DateTimeDisplay } from "../components/DateTimeDisplay";
import { ShiftDetailsBanner } from "../components/ShiftDetailsBanner";
import { MetricDisplay } from "../components/MetricsDisplay";
import { TotalEarnings } from "../components/TotalEarning";
import { LocationDisplay } from "../components/LocationDisplay";
import { Details } from "../components/ShiftDetailsDescription";
import { ButtonProps, RatingIndicatorProps } from "../types";
import { ActionButton } from "../components/ActionButton";
import { useLocalSearchParams } from "expo-router";
import { ShiftDetailsProps } from "./types";
import { images } from "@/assets/images";
import { fetchShift } from "@/services/api_test";

export const OnGoingShiftDetails: React.FC = () => {
  const [isCancelShiftModal, setisCancelShiftModal] = useState(false);
  const [isBeginShiftModal, setisBeginShiftModal] = useState(false);
  const [isAwaitingConfirmationModal, setisAwaitingConfirmationModal] =
    useState(false);
  const [isShiftDurationUpModal, setIsShiftDurationUpModal] = useState(false);
  const [isShiftCompletedModal, setIsShiftCompletedModal] = useState(false);
  const [shiftCompletedAwaitingModal, setShiftCompletedAwaitingModal] =
    useState(false);

  const ratingData = [
    { icon: require("@/assets/images/star_red_icon.png"), value: "-10" },
    { icon: require("@/assets/images/rating_red_icon.png"), value: "-35" },
  ];

  const [isShiftCompletionVerifiedModal, setisShiftCompletionVerifiedModal] =
    useState(false);
  const [time, setTime] = useState<number>(0); // Time in minutes
  const [formattedTime, setFormattedTime] = useState<string>(
    "00 hours 00 minutes"
  );
  const [isRunning, setIsRunning] = useState(true);

  // For Data loading and Filtering
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<ShiftDetailsProps>();
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShift(id);
        setData(data);
        // set clock to remaining time
        checkTimeLeft(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // For Timer Execution-----------------------------------------------------------------------
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        //stop timer when it hits 0
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      }); // decrease time by 1 minute
    }, 60000); // Update every minute (60000ms = 1 minute)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Convert total minutes into hours and minutes
    const hours = Math.floor(time / 60); // Get the full hours
    const minutes = time % 60; // Get the remaining minutes

    // Format time as HH:MM
    setFormattedTime(
      `${String(hours).padStart(2, "0")} hours ${String(minutes).padStart(
        2,
        "0"
      )} minutes`
    );
  }, [time]);

  const checkTimeLeft = (data: ShiftDetailsProps) => {
    const currentTime = new Date();
    let timeLeft = moment(data.end_time).diff(moment(currentTime), "minutes");
    if (timeLeft > 0) {
      setTime(timeLeft);
    } else {
      setTime(0); //reset timer to 0 if shift ended
      setIsRunning(false); //set to false to enable `complete shift` button
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
      style={tw`flex-1 overflow-hidden flex-col pb-9 mx-auto w-full bg-zinc-100 max-w-[480px]`}
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

          {/* Timer interface section--------------------*/}
          {/* Timer----------------------- */}
          <View style={tw`mt-8 text-lg font-bold tracking-tight text-center`}>
            <View style={tw`justify-center items-center`}>
              <Text style={tw`text-lg font-bold tracking-tight text-center`}>
                {formattedTime}
              </Text>
            </View>
          </View>

          <View style={tw`self-center w-[271px]`}>
            <Text
              style={tw`self-center text-sm tracking-tight text-center text-zinc-600 w-[271px]`}
            >
              for shift to end.
            </Text>
          </View>

          {/* <View style={tw`self-center px-16 py-4 mt-9 w-full rounded-xl bg-stone-300 max-w-[327px]`}>
          <Text style={tw`text-xl text-center font-semibold tracking-tight bg-stone-300 text-zinc-500`}>Complete Shift</Text>
        </View> */}

          {/* Action Button For main body    */}
          {isRunning ? (
            <View
              style={tw`self-center px-16 py-4 mt-10 w-[300px] text-xl font-semibold tracking-tight rounded-xl bg-stone-300 max-w-[327px]`}
            >
              <Text
                style={tw`text-zinc-500 self-center text-xl font-semibold tracking-tight`}
              >
                Complete Shift
              </Text>
            </View>
          ) : (
            <View style={tw`self-center`}>
              <ActionButton
                label="Complete Shift"
                onPress={() => setIsShiftDurationUpModal(true)}
                isEnabled={true}
                className=""
              />
            </View>
          )}
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
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-30`}
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
                5 hours 13 minutes for shift to start.
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
              onPress={() => setisCancelShiftModal(false)}
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
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-30`}
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
                style={tw`text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
              >
                Make sure you at the job site
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                8 hours 00 minutes for shift to end.
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
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-50`}
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
                8 hours 00 minutes for shift to end.
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

      {/* Shift duration up modal */}
      <Modal
        visible={isShiftDurationUpModal}
        onRequestClose={() => setIsShiftDurationUpModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-[322px] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setIsShiftDurationUpModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={images.closeicon}
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
                Your Shift Duration Is Up
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                <Text style={tw`text-stone-900 font-bold`}>
                  0 hours 00 minutes{" "}
                </Text>
                for shift to end.
              </Text>
            </View>

            <View style={tw`self-start mt-7 mb-2`}>
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Once you complete, we will await{"\n"}confirmation{"\n"}
                from your employer to verify that you are done with your work.
              </Text>
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600 mt-2`}
              >
                Shifts will be counted as completed once the employer verifies
                this.
              </Text>
            </View>

            <View style={tw`self-center`}>
              <ActionButton
                label="Complete"
                isEnabled={true}
                onPress={() => {
                  setIsShiftDurationUpModal(false);
                  setShiftCompletedAwaitingModal(true);
                }}
                className="py-2.5 mt-7 max-w-full rounded-md w-[193px] px-1"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Shift Completed Awaiting modal -----------------------------------------------*/}
      <Modal
        visible={shiftCompletedAwaitingModal}
        onRequestClose={() => setIsShiftCompletedModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-[322px] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setShiftCompletedAwaitingModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={images.closeicon}
                style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
                accessibilityLabel="Close modal"
              />
            </TouchableOpacity>

            <View style={tw`mt-16`}>
              <Text
                style={tw`text-xl font-extrabold tracking-tight leading-6 text-zinc-800 text-center`}
              >
                Awaiting Confirmation To Complete Your Shift
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                <Text style={tw`text-stone-900 font-bold`}>
                  0 hours 00 minutes
                </Text>
                for shift to end.
              </Text>
            </View>

            <View style={tw`self-start mt-7 mb-10`}>
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Shift will be counted as completed once the employer verifies
                this.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Shift Completion Verified modal -----------------------------------------------*/}
      <Modal
        visible={isShiftCompletionVerifiedModal}
        onRequestClose={() => setisShiftCompletionVerifiedModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-[322px] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setIsShiftCompletedModal(false)}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={images.closeicon}
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
                Shift Completion Verified
              </Text>
            </View>

            <View
              style={tw`self-start mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Employer has verified that you have completed your shift.
              </Text>
            </View>

            <View
              style={tw`self-center mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Good job!
              </Text>
            </View>

            <View style={tw`self-center`}>
              <ActionButton
                label="Continue"
                isEnabled={true}
                onPress={() => {
                  setisShiftCompletionVerifiedModal(false);
                }}
                className="py-2.5 mt-30 rounded-md w-[193px] px-1"
              />
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

export default OnGoingShiftDetails;
