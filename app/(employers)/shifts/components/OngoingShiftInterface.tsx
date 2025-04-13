import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  LogBox,
} from "react-native";

import tw from "twrnc";

import { ActionButton } from "./ActionButton";
import { images } from "@/assets/images";
import { router, useLocalSearchParams } from "expo-router";
import { ShiftDetailsProps } from "./types";

const OngoingShiftInterface: React.FC<{
  shift_duration: number;
  shift_id: string;
  onButtonPress: () => void;
}> = ({ shift_duration, shift_id, onButtonPress }) => {
  const [isShiftDurationUpModal, setIsShiftDurationUpModal] = useState(false);
  const [isShiftCompletedModal, setIsShiftCompletedModal] = useState(false);
  const [isShiftCompletionVerifiedModal, setisShiftCompletionVerifiedModal] =
    useState(false);
  const [time, setTime] = useState<number>(
    shift_duration > 0 ? shift_duration : 0
  ); // Time in minutes
  const [formattedTime, setFormattedTime] = useState<string>(
    "00 hours 00 minutes"
  );
  const [isRunning, setIsRunning] = useState(true);

  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(10);
  //const [isRunning, setIsRunning] = useState(true);

  // For Timer Execution-----------------------------------------------------------------------
  useEffect(() => {
    if (time == 0) {
      setIsRunning(false);
    }
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

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col p-1 mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
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
            onPress={() => {
              setIsShiftDurationUpModal(true);
            }}
            isEnabled={true}
            className=""
          />
        </View>
      )}

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
                Shift Duration Is Up
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                <Text style={tw`text-stone-900 font-bold`}>
                  {" "}
                  0 hours 00 minutes{" "}
                </Text>{" "}
                for shift to end.
              </Text>
            </View>

            <View style={tw`self-start mt-7 mb-15`}>
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Once you click 'complete', we will{"\n"}confirm{"\n"}and the
                shift will be marked as complete.
              </Text>
            </View>

            <View style={tw`self-center`}>
              <ActionButton
                label="Complete"
                isEnabled={true}
                onPress={() => {
                  onButtonPress();
                  setIsShiftDurationUpModal(false);
                  setIsShiftCompletedModal(true);
                }}
                className="py-2.5 mt-7 max-w-full rounded-md w-[193px] px-1"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Shift Completed modal -----------------------------------------------*/}
      <Modal
        visible={isShiftCompletedModal}
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
                Shift Completed
              </Text>
            </View>

            <View
              style={tw`self-start mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                You have verified that the shift has been completed
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
                label="Rate Shift"
                isEnabled={true}
                onPress={() => {
                  setisShiftCompletionVerifiedModal(false);
                  router.push({
                    pathname: "/shifts/RateCompletedShift",
                    params: {
                      id: shift_id,
                    },
                  });
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

export default OngoingShiftInterface;
