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
  ActivityIndicator,
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
import {
  EmployeeProps,
  RatingIndicatorProps,
  ShiftDetailsProps,
  UpcomingShiftProps,
  UserProps,
} from "./types";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { router, useLocalSearchParams } from "expo-router";
import {
  completeOngoingShifts,
  fetchEmployee,
  fetchOngoingShift,
  fetchShift,
  fetchUser,
  startOngoingShift,
} from "@/services/api_test";
import OngoingShiftInterface from "./components/OngoingShiftInterface";

const UpComingShiftDetails: React.FC = () => {
  const [isCancelShiftModal, setisCancelShiftModal] = useState(false);

  const ratingData = [
    { icon: images.starred, value: "-10" },
    { icon: images.ratingred, value: "-35" },
  ];

  const { id, employee_id } = useLocalSearchParams<{
    id: string;
    employee_id: string;
    upcoming_id: string;
  }>();

  const [data, setData] = useState<ShiftDetailsProps>();
  const [upcomingdata, setUpcomingData] = useState<UpcomingShiftProps>();
  const [userdata, setUserData] = useState<UserProps>();
  const [employeeData, setEmployeeData] = useState<EmployeeProps>();
  const [loading, setLoading] = useState(true);
  const [isTimeForShift, setisTimeForShift] = useState(false);
  const [isOngoingShift, setisOngoingShift] = useState(false);
  const [time, setTime] = useState<number>(60); // Time in minutes
  const [formattedTime, setFormattedTime] = useState<string>("00:00");
  // Replace with actual authentication token if needed

  useEffect(() => {
    if (data && data.end_time) {
      checkShift();
    } else {
      console.warn("Waiting for shift data...");
    }
  }, [data]);

  useEffect(() => {
    // Load shift data
    const loadData = async () => {
      try {
        const fetchedData = await fetchShift(id);
        setData(fetchedData);

        const currentTime = new Date();
        const shiftEndTime = new Date(fetchedData.end_time); // Convert to Date object
        let timeLeft = moment(shiftEndTime).diff(
          moment(currentTime),
          "minutes"
        );

        setTime(shiftEndTime > currentTime ? timeLeft : 0); // Convert duration to minutes
        handleBeginShift(fetchedData); // Ensure shift data is available
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
    getEmployee(employee_id);
  }, []); // Empty dependency array ensures it runs only once

  const handleBeginShift = (shiftData: ShiftDetailsProps) => {
    if (!shiftData) return;

    const currentTime = new Date();
    const shiftEndTime = new Date(shiftData.end_time);
    const shiftStartTime = new Date(shiftData.start_time);

    console.log("currentTime", currentTime);
    console.log("shiftEndTime", shiftEndTime);
    console.log("shiftStartTime", shiftStartTime);

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

  //check if shift is ongoing
  const checkShift = async () => {
    try {
      const shiftdata = await fetchOngoingShift(id);

      // Ensure shiftdata is valid
      if (!shiftdata || !Array.isArray(shiftdata) || shiftdata.length === 0) {
        // console.error("Error: shiftdata is invalid or empty", shiftdata);
        // Alert.alert("Error", "No ongoing shift data found.");
        return;
      }

      let currentTime = new Date();

      if (!data?.end_time) {
        console.error("Error: Shift end time is missing", data);
        Alert.alert("Error", "Shift end time not available.");
        return;
      }

      let timeLeft = moment(data.end_time).diff(moment(currentTime), "minutes");

      setTime(timeLeft);
      setisOngoingShift(true);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOngoingShift = async () => {
    setLoading(true);
    try {
      const response = await startOngoingShift(id);
      Alert.alert("Success", response.message);
      setisOngoingShift(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  // const handleCreateOngoingShift = async () => {
  //   const ongoingShiftId = uuid.v4(); // Generate a new UUID for user

  //   let endTime = new Date();
  //   endTime.setHours(
  //     endTime.getHours() + (data?.shift_duration ? +data.shift_duration : 0)
  //   );

  //   try {
  //     const newOngoingShiftData = {
  //       id: ongoingShiftId,
  //       actual_start_time: new Date(),
  //       actual_end_time: endTime,
  //       shift_progress: "IN_PROGRESS",
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //       employee: employeeData?.id || "",
  //       shift: id,
  //       employer: "92453a49-e948-4e0a-804c-7dd58995b21b", //supply employee id here
  //     };

  //     const response = await createOngoingShift(newOngoingShiftData, authToken);

  //     Alert.alert("Success", "Ongoing created successfully!");
  //     setisOngoingShift(true);
  //     console.log(response);
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.error("Error Data:", error.response.data);
  //       Alert.alert("Error", JSON.stringify(error.response.data));
  //     } else {
  //       console.error("Error:", error.message);
  //       Alert.alert("Error", "Something went wrong.");
  //     }
  //   }
  // };

  const handleCompleteShifts = async () => {
    setLoading(true);
    try {
      const response = await completeOngoingShifts(id);
      Alert.alert("Success", response.message);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  // const handleUpdateOngoingShift = async () => {
  //   const ongoingData = await fetchOngoingShift(id);

  //   // Debugging to catch errors early
  //   if (
  //     !ongoingData ||
  //     !Array.isArray(ongoingData) ||
  //     ongoingData.length === 0
  //   ) {
  //     Alert.alert("Error", "No ongoing shift data found.");
  //     return;
  //   }

  //   const ongoingShift = ongoingData[0]; // Now safe to access

  //   let endTime = new Date();
  //   endTime.setHours(
  //     endTime.getHours() + (data?.shift_duration ? +data.shift_duration : 0)
  //   );

  //   try {
  //     const ongoingShiftData = {
  //       id: ongoingShift.id,
  //       actual_start_time: ongoingShift.actual_start_time,
  //       actual_end_time: endTime, // Ensure this is correct
  //       shift_progress: "COMPLETED",
  //       created_at: ongoingShift.created_at,
  //       updated_at: new Date(),
  //       employee: ongoingShift.employee,
  //       shift: id,
  //       employer: ongoingShift.employer, // Verify this is correct
  //     };

  //     const response = await updateOngoingShift(
  //       ongoingShiftData,
  //       ongoingShift.id,
  //       authToken
  //     );

  //     Alert.alert("Success", "Ongoing shift updated successfully!");
  //     setisOngoingShift(true);
  //     console.log("Update response:", response);
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.error("Error Data:", error.response.data);
  //       Alert.alert("Error", JSON.stringify(error.response.data));
  //     } else {
  //       console.error("Error:", error.message);
  //       Alert.alert("Error", "Something went wrong.");
  //     }
  //   }
  // };

  //get employee data
  const getEmployee = async (id: string) => {
    try {
      const data = await fetchEmployee(id);
      setEmployeeData(data);
      if (data.user) {
        getUser(data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDeleteUpcomingShift = async (id: string) => {
  //   try {
  //     const data = await deleteUpcomingShift(id);

  //     Alert.alert("Sucess", "Upcoming deleted successfully");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleDeleteShift = async () => {
    try {
      setisCancelShiftModal(false);
      router.push("/");
      Alert.alert("Sucess", "Shift deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  //get user data
  const getUser = async (id: string) => {
    try {
      const data = await fetchUser(id);
      setUserData(data);
    } catch (error) {
      console.error(error);
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
      {loading && (
        <View style={tw`w-full h-full flex justify-center items-center`}>
          <ActivityIndicator size="large" color="green" />
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {data && (
          <View style={tw`flex`}>
            <DateTimeDisplay
              date={moment(data.date).format("ddd, Do MMM")}
              time={moment(data.start_time).format("hh:mm A")}
            />

            <View
              style={tw`shrink-0 self-center mt-1.5 max-w-full h-px border border-solid border-stone-300 w-[350px]`}
            />

            <ShiftDetailsBanner
              backgroundImage={data.background_image_url}
              jobTitle={data.name}
              companyName={data.company_name}
            />

            <MetricDisplay
              leftValue={"$" + data.salary_per_time}
              leftLabel="Hourly rate"
              rightValue={data.shift_duration + " HRS"}
              rightLabel="Duration"
            />

            <TotalEarnings totalEarnings={+data.total_earning} />

            <LocationDisplay
              address={data.location}
              mapImageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/bd168c1c64b133f2d4d9e3c84c1312dffacfbdccf2b8317ffcd8ad231338fdbc?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
            />

            <MetricDisplay
              leftValue={moment(data.start_time).format("hh:mm A")}
              leftLabel="start time"
              rightValue={moment(data.end_time).format("hh:mm A")}
              rightLabel="End Time"
            />

            <View style={tw`mt-2`}>
              <Details description={data.requirement_description} />
            </View>

            {/* View employee profile */}
            <View style={tw`mt-2 mb-8`}>
              <View
                style={tw`flex flex-col items-start mt-3 tracking-tight mt-4 rounded-none max-w-[359px]`}
              >
                <Text
                  style={tw`font-semibold leading-6 text-neutral-400 text-base tracking-tight`}
                >
                  Shift Picked By
                </Text>

                <View
                  style={tw`flex flex-row justify-between gap-5 w-full mt-1`}
                >
                  <Text
                    style={tw`text-zinc-600 tracking-tight text-sm text-neutral-500`}
                  >
                    {userdata?.first_name} {userdata?.last_name}
                  </Text>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/shifts/ShiftPickerProfile",
                        params: {
                          id: userdata?.id,
                          name: `${userdata?.first_name ?? ""} ${
                            userdata?.last_name ?? ""
                          }`,
                          phone: userdata?.phone,
                          rating: employeeData?.rating,
                          assurance: employeeData?.assurance,
                        },
                      })
                    }
                  >
                    <Text
                      style={tw`text-zinc-600 tracking-tight text-sm text-green-700 underline`}
                    >
                      View Profile
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Action Buttons------ */}
            {/* Begin Shift and Cancel Button Section*/}
            {!isOngoingShift && (
              <View>
                {!isTimeForShift ? (
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
                      // handleCreateOngoingShift();
                      // handleDeleteUpcomingShift(upcoming_id);
                      handleStartOngoingShift();
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
                  onPress={() => setisCancelShiftModal(true)}
                >
                  <Text
                    style={tw`text-white self-center text-xl font-semibold tracking-tight`}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Timer and Complete Shift buttons */}
            {isOngoingShift && (
              <View style={tw`flex items-center w-[327px]`}>
                <OngoingShiftInterface
                  shift_duration={time}
                  shift_id={id}
                  onButtonPress={handleCompleteShifts}
                />
              </View>
            )}
          </View>
        )}
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
                Are you sure you{"\n"}want to cancel?
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
                label="Cancel"
                onPress={() => handleDeleteShift()}
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

export default UpComingShiftDetails;
