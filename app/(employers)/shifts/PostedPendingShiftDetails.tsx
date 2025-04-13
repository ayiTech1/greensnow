import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  FlatList,
  LogBox,
  Alert,
} from "react-native";
import moment from "moment";
import tw from "twrnc";
import { DateTimeDisplay } from "./components/DateTimeDisplay";
import ShiftDetailsBanner from "./components/ShiftDetailsBanner";
import { MetricDisplay } from "./components/MetricsDisplay";
import { TotalEarnings } from "./components/TotalEarning";
import { LocationDisplay } from "./components/LocationDisplay";
import { Details } from "./components/ShiftDetailsDescription";
import { RatingIndicatorProps, ShiftDetailsProps } from "./types";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { router, useLocalSearchParams } from "expo-router";
import { deleteShift, fetchShifts } from "@/services/api_test";
import OngoingShiftInterface from "./components/OngoingShiftInterface";

const PostedPendingShiftDetails: React.FC = () => {
  const [isCancelShiftModal, setisCancelShiftModal] = useState(false);

  const ratingData = [
    { icon: images.starred, value: "-10" },
    { icon: images.ratingred, value: "-35" },
  ];

  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const [shiftBegin, setShiftBegin] = useState(false);
  const [time, setTime] = useState<number>(60); // Time in minutes
  const [formattedTime, setFormattedTime] = useState<string>("00:00");

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

    // setData(ShiftDetailsData); // Using imported JSON data
    //   setLoading(false);
    const loadData = async () => {
      try {
        const data = await fetchShifts();
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Show the view after 2 seconds
    const timer = setTimeout(() => {
      setIsRunning(false);
    }, 10000);

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  //filter shift by shift ID
  const filteredData = data.filter((shift) => shift.id === id);

  const handleDeleteShift = async () => {
    try {
      const data = await deleteShift(id);
      Alert.alert("Success", "Shift deleted successfully!");
      setisCancelShiftModal(false);
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={tw`flex-1 overflow-hidden items-center justify-center flex-col p-1 mx-auto w-full bg-zinc-100 max-w-[480px]`}
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

      <ScrollView>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={tw`flex`}>
              <DateTimeDisplay
                date={moment(item.date).format("ddd, Do MMM")}
                time={moment(item.start_time).format("hh:mm A")}
              />

              <View
                style={tw`shrink-0 self-center mt-1.5 max-w-full h-px border border-solid border-stone-300 w-[350px]`}
              />

              <ShiftDetailsBanner
                backgroundImage={item.background_image_url}
                jobTitle={item.name}
                companyName={item.company_name}
              />

              <MetricDisplay
                leftValue={"$" + item.salary_per_time}
                leftLabel="Hourly rate"
                rightValue={item.shift_duration + " HRS"}
                rightLabel="Duration"
              />

              <TotalEarnings totalEarnings={+item.total_earning} />

              <LocationDisplay
                address={item.location}
                mapImageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/bd168c1c64b133f2d4d9e3c84c1312dffacfbdccf2b8317ffcd8ad231338fdbc?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
              />

              <MetricDisplay
                leftValue={moment(item.start_time).format("hh:mm A")}
                leftLabel="start time"
                rightValue={moment(item.end_time).format("hh:mm A")}
                rightLabel="End Time"
              />

              <View style={tw`mt-2`}>
                <Details description={item.requirement_description} />
              </View>

              {/* Action Buttons------ */}

              <View>
                <TouchableOpacity
                  style={tw`self-center px-16 py-4 mt-10 w-[90%] text-xl font-semibold tracking-tight rounded-xl bg-yellow-500 max-w-[327px]`}
                  onPress={() =>
                    router.push({
                      pathname: "/shifts/EditShift",
                      params: {
                        id: item.id,
                      },
                    })
                  }
                >
                  <Text
                    style={tw`text-white self-center text-xl font-semibold tracking-tight`}
                  >
                    Edit Shift
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`self-center px-16 py-4 mt-4 w-[90%] text-xl font-semibold tracking-tight rounded-xl bg-rose-600 max-w-[327px]`}
                  onPress={() => setisCancelShiftModal(true)}
                >
                  <Text
                    style={tw`text-white self-center text-xl font-semibold tracking-tight`}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>

      {/* Cancel Shift Modal */}
      <Modal
        visible={isCancelShiftModal}
        onRequestClose={() => setisCancelShiftModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-30 `}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-[322px] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => setisCancelShiftModal(false)}
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
                Are You Sure You{"\n"}Want To Delete?
              </Text>
            </View>

            <View style={tw`text-sm tracking-tight text-center`}>
              <Text
                style={tw`mt-5 text-sm tracking-tight text-center text-zinc-600`}
              >
                <Text style={tw`font-semibold text-stone-900`}>
                  5 hours 13 minutes
                </Text>{" "}
                for shift to start.
              </Text>
            </View>

            <View
              style={tw`self-start mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Your assurance and ratings would drop if you cancel now.
              </Text>
            </View>

            <View
              style={tw`flex flex-row gap-1.5 items-start mt-3.5 text-xs tracking-tight text-center text-rose-600 whitespace-nowrap w-[110px] mb-8`}
            >
              {ratingData.map((rating, index) => (
                <RatingIndicator
                  key={index}
                  icon={rating.icon}
                  value={rating.value}
                />
              ))}
            </View>

            <View style={tw`self-center`}>
              <ActionButton
                label="Delete"
                onPress={() => {
                  handleDeleteShift();
                }}
                isEnabled={true}
                className="px-16 py-2.5 mt-5 max-w-full text-xl font-semibold tracking-tight text-white whitespace-nowrap bg-rose-600 rounded-md w-[193px]"
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

export default PostedPendingShiftDetails;
