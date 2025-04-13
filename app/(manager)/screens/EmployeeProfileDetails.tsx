import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  LogBox,
  ActivityIndicator,
  FlatList,
} from "react-native";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { images } from "@/assets/images";
import { ActionButton } from "../components/ActionButton";
import { router, useLocalSearchParams } from "expo-router";
import {
  EmployeeProps,
  EmployerDetailsDisplayProps,
  EmployerProps,
  ShiftDetailsProps,
  UserDataProps,
  UserProps,
} from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import RatingsMeter from "./components/RatingsMeter";
import {
  deleteUser,
  fetchEmployeeDetailsByUser,
  fetchEmployerDetailsByUser,
  fetchOngoingShiftsByEmployee,
  fetchShifts,
  fetchShiftsByEmployer,
  fetchUpcomingShiftsByEmployee,
  fetchUser,
  toggleUserSuspension,
  verifyUser,
} from "@/services/api_test";
import VerifyAccountModal from "./components/VerifyAccountModal";
import SuspendAccountModal from "./components/SuspendAccountModal";
import RemoveAccountModal from "./components/RemoveAccountModal";

const ViewProfile = () => {
  //Search params
  const { user_id } = useLocalSearchParams<{
    user_id: string;
  }>();

  const [isSuspendModalVisible, setSuspendModalVisible] = useState(false);
  const [isRemoveModalVisible, setRemoveModalVisible] = useState(false);
  const [isVerifyModalVisible, setVerifyModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [shiftsData, setShiftsData] = useState<ShiftDetailsProps[]>([]);
  const [user, setUserData] = useState<UserProps>();
  const [employee, setEmployee] = useState<EmployeeProps>();
  const [isVerified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployeeDetailsFromUsers(user_id);
    loadEmployeeDetailsForUser(user_id);
  }, [user_id]);

  const getEmployeeDetailsFromUsers = async (uid: string) => {
    try {
      const data = await fetchUser(uid);
      setUserData(data);
      setVerified(data.is_verified);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEmployeeDetailsForUser = async (uid: string) => {
    try {
      const data = await fetchEmployeeDetailsByUser(uid);
      setEmployee(data);
      loadGigsTakenByEmployee(data.id);
    } catch (error) {
      console.error(error);
    }
  };

  const loadGigsTakenByEmployee = async (employee: string) => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [shifts, upcoming, ongoing] = await Promise.all([
        fetchShifts(),
        fetchUpcomingShiftsByEmployee(employee).catch((error) => {
          if (error.response?.status === 404) {
            console.warn("No upcoming shifts found for this employee.");
            return [];
          }
          throw error;
        }),
        fetchOngoingShiftsByEmployee(employee).catch((error) => {
          if (error.response?.status === 404) {
            console.warn("No ongoing shifts found for this employee.");
            return [];
          }
          throw error;
        }),
      ]);

      // Merge shift IDs
      const mergedShiftIds = new Set([
        ...upcoming.map((shift) => shift.shift),
        ...ongoing.map((shift) => shift.shift),
      ]);

      // Filter shifts
      const filteredShifts = shifts.filter((shift) =>
        mergedShiftIds.has(shift.id)
      );

      // setUpcomingShifts(upcoming);
      setShiftsData(filteredShifts);
    } catch (error) {
      console.error("Error loading shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async () => {
    try {
      const data = await verifyUser(user_id);
      setVerifyModalVisible(false);
      setVerified(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const data = await deleteUser(user_id);
      setRemoveModalVisible(false); //close remove account modal
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuspendUser = async () => {
    try {
      const data = await toggleUserSuspension(user_id);
      setSuspendModalVisible(false); //close suspend account modal
      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator style={tw`mt-[90%]`} size="large" color="green" />
      </View>
    );

  return (
    <View style={tw`px-1 py-2 bg-gray-100`}>
      {/* Header */}

      <Text style={tw`self-start text-2xl font-bold text-stone-900`}>
        Employee Profile Details
      </Text>

      <ScrollView style={tw`flex w-full`} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}

        <View
          style={tw`flex bg-gray-100 items-center justify-center mb-6 mt-8`}
        >
          <View style={tw`flex flex-row gap-3 w-full`}>
            <Image
              source={images.avatarverified}
              style={tw`object-contain shrink-0 aspect-square w-[60px] self-center`}
            />

            {/* Rating and Assurance */}
            <View style={tw`flex flex-col`}>
              <View style={tw`flex flex-row gap-0.5 items-center`}>
                <Image
                  source={images.star}
                  style={tw`object-contain shrink-0 aspect-square w-[16px]`}
                />
                <Text>Rating</Text>
              </View>
              <View style={tw`flex-row items-center mt-0.5`}>
                <View style={tw`flex-row items-center mt-0.5`}>
                  <FontAwesome name="star" size={20} color="gray" />
                  <FontAwesome name="star-o" size={20} color="gray" />
                  <FontAwesome name="star-o" size={20} color="gray" />
                  <FontAwesome name="star-o" size={20} color="gray" />
                  <FontAwesome name="star-o" size={20} color="gray" />
                </View>
                <View style={tw`flex absolute`}>
                  <RatingsMeter rating={employee?.rating ?? 0} />
                </View>
              </View>

              <View style={tw`flex flex-row justify-between w-[87%]`}>
                <View style={tw`flex flex-row gap-0.5 items-center`}>
                  <Image
                    source={images.ranking}
                    style={tw`object-contain shrink-0 aspect-square w-[16px] mt-2`}
                  />
                  <Text style={tw`mt-2`}>Assurance</Text>
                </View>
                <Text style={tw`text-sm text-gray-500 mt-2`}>
                  {employee?.assurance}/100
                </Text>
              </View>
              <View style={tw`w-[90%] bg-gray-300 rounded-full h-2 mt-1`}>
                <View
                  style={tw`bg-green-500 h-2 rounded-full w-[${
                    employee?.assurance ?? 0
                  }%]`}
                />
              </View>
            </View>
          </View>

          <Text style={tw`self-start text-2xl font-bold text-stone-900 mt-5`}>
            {user?.first_name} {user?.last_name}
          </Text>
        </View>

        {/* Menu Section */}
        <View style={tw`mb-6 border-b border-t border-gray-200 py-4`}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/PersonalInfo",
                params: {
                  user_id: user_id,
                },
              })
            }
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-center`}>
              <Image source={images.personalinfo} />
              <Text style={tw`text-base text-black`}>Personal Info</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/shifts/ShiftDetailsPosted",
                params: {
                  // id: id,
                },
              })
            }
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-center`}>
              <Image source={images.jobdetails} />
              <Text style={tw`text-base text-black`}>Job Details</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-center`}>
              <Image source={images.help} />
              <Text style={tw`text-base text-black`}>Help</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-center`}>
              <Image source={images.refer} />
              <Text style={tw`text-base text-black`}>
                Refer Someone for $100
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-center`}>
              <Image source={images.legal} />
              <Text style={tw`text-base text-black`}>Legal</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Gigs Taken section----------------------*/}
        <View style={tw`mb-6`}>
          <Text style={tw`text-sm text-gray-400 font-bold mb-2`}>
            {shiftsData.length} Gigs Taken
          </Text>
          {shiftsData.map((gig, index) => (
            <View
              key={index}
              style={tw`flex-row items-center justify-between py-0.5`}
            >
              <Text style={tw`text-base text-black text-sm`}>
                <Text style={tw`font-bold`}>{gig.name}</Text> -{" "}
                {gig.company_name}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/shifts/ShiftDetailsTaken",
                    params: {
                      id: gig.id,
                    },
                  })
                }
              >
                <Text style={tw`text-green-600 font-bold underline`}>
                  View Gig
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Account Verified Section ----------------------------*/}
        {isVerified ? (
          <View style={tw`mb-6 mt-5 items-center`}>
            <Text style={tw`text-2xl font-bold text-stone-900`}>
              Account Verified
            </Text>
            <Text style={tw`text-sm text-gray-500`}>
              Account setup is{" "}
              <Text style={tw`text-stone-900 font-bold`}>100%</Text> complete
            </Text>
          </View>
        ) : (
          <View style={tw`mb-6 mt-5 items-center`}>
            <Text style={tw`text-2xl text-center font-bold text-stone-900`}>
              Account Verification Pending
            </Text>
            <Text style={tw`text-sm text-gray-500`}>
              Account setup is{" "}
              <Text style={tw`text-stone-900 font-bold`}>20%</Text> complete
            </Text>
          </View>
        )}

        {/* Buttons */}
        {/* <View style={tw`flex justify-around`}>
         
         </View> */}

        {/* Buttons */}
        <View style={tw`flex justify-center items-center w-full`}>
          {!isVerified ? (
            <View style={tw`self-center`}>
              <ActionButton
                onPress={() => {
                  setPassword("");
                  setVerifyModalVisible(true);
                }}
                buttonStyle=" w-[97%]"
                isEnabled={true}
                label="Verify Account"
              />
            </View>
          ) : (
            <View style={tw`self-center`}>
              <ActionButton
                onPress={() => {
                  setPassword("");
                  setSuspendModalVisible(true);
                }}
                buttonStyle="w-[97%] bg-stone-300"
                textStyle="text-zinc-500"
                isEnabled={true}
                label="Suspend Account"
              />
            </View>
          )}
          <View style={tw`self-center`}>
            <ActionButton
              onPress={() => {
                setPassword("");
                setRemoveModalVisible(true);
              }}
              buttonStyle="bg-red-500 mt-2 mb-8 w-[97%]"
              isEnabled={true}
              label="Remove Account"
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal section ---------------------------------------------------------------------------------------------------------------------------- */}

      <VerifyAccountModal
        visible={isVerifyModalVisible}
        onClose={() => setVerifyModalVisible(false)}
        user_id={user_id}
        onVerifySuccess={() => setVerified(true)}
      />

      <SuspendAccountModal
        visible={isSuspendModalVisible}
        onClose={() => setSuspendModalVisible(false)}
        user_id={user_id}
        onSuspendSuccess={() => console.log("User Suspended")}
      />

      <RemoveAccountModal
        visible={isRemoveModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        user_id={user_id}
      />
    </View>
  );
};

export default ViewProfile;
