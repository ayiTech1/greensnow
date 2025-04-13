import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  LogBox,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  BackHandler,
} from "react-native";
import tw from "twrnc";
import EmployersListItem from "../components/EmployersListItem";
import { images } from "@/assets/images";
import { router, useFocusEffect } from "expo-router";
import { UserProps } from "./types";
import { ShiftDetailsData, UserData } from "@/assets/data/Data";
import JobCard from "../components/JobCard";
import { fetchEmployerDetailsByUser, fetchUsers } from "@/services/api_test";

const Employers: React.FC = () => {
  const [tab, setTab] = useState("approved");
  const [approved, setApprovedData] = useState<UserProps[]>([]);
  const [pending, setPendingData] = useState<UserProps[]>([]);
  const [requested, setRequestedData] = useState<UserProps[]>([]);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  //Loading from Database -----------------------------------------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const employers = users.filter((user) => user.role === "EMPLOYER");
  const approvedUsers = employers.filter((user) => user.is_verified);
  const pendingUsers = employers.filter((user) => !user.is_verified);

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center w-full bg-zinc-100`}
    >
      {/* Tabs section--------------------------------------------------------------------------------- */}
      <View
        style={tw`flex flex-row items-start gap-2.5 w-64 max-w-full rounded-none w-full mt-8`}
      >
        <TouchableOpacity onPress={() => setTab("approved")}>
          <Text
            style={tw`grow text-base text-stone-900 font-extrabold tracking-tight leading-loose ${
              tab == "approved" ? `text-green-700 underline` : ``
            } `}
          >
            Approved
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("pending")}>
          <Text
            style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose ${
              tab == "pending" ? `text-green-700 underline` : ``
            }`}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("requested")}>
          <Text
            style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose ${
              tab == "requested" ? `text-green-700 underline` : ``
            }`}
          >
            Requested
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content section---------------------------------------------------------------------------------------------------------- */}
      <View style={tw`mt-4`}>
        {tab == "approved" ? (
          <SafeAreaView
            style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
          >
            {loading ? (
              <View style={tw`mt-[50%]`}>
                <ActivityIndicator size="large" color="blue" />
              </View>
            ) : (
              <SafeAreaView style={tw`w-full`}>
                <FlatList
                  data={approvedUsers}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/screens/EmployerProfileDetails",
                          params: {
                            user_id: item.id,
                          },
                        })
                      }
                    >
                      <EmployersListItem id={item.id} />
                    </TouchableOpacity>
                  )}
                />
              </SafeAreaView>
            )}
          </SafeAreaView>
        ) : tab == "pending" ? (
          <SafeAreaView
            style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
          >
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <SafeAreaView style={tw`w-full`}>
                <FlatList
                  data={pendingUsers}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/screens/EmployerProfileDetails",
                          params: {
                            user_id: item.id,
                          },
                        })
                      }
                    >
                      <EmployersListItem id={item.id} />
                    </TouchableOpacity>
                  )}
                />
              </SafeAreaView>
            )}
          </SafeAreaView>
        ) : (
          // Pending Shifts Display ------------------------------------------------------------

          <SafeAreaView
            style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}
          >
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <SafeAreaView style={tw`w-full`}>
                <FlatList
                  data={requested}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/screens/EmployerProfileDetails",
                          params: {
                            user_id: item.id,
                          },
                        })
                      }
                    >
                      <EmployersListItem id={item.id} />
                    </TouchableOpacity>
                  )}
                />
              </SafeAreaView>
            )}
          </SafeAreaView>
        )}
      </View>
    </View>
  );
};

export default Employers;
