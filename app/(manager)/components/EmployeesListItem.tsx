import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import type {
  NotificationDetailsProps,
  UserListItemProps,
} from "../(tabs)/types";

import tw from "twrnc";
import { images } from "@/assets/images";
import { StatsCounter } from "./StatsCounterUserList";
import { EmployeeProps, UserProps } from "./types";
import { fetchEmployeeDetailsByUser, fetchUser } from "@/services/api_test";

const EmployeesListItem: React.FC<{ id: string }> = ({ id }) => {
  const [employee, setEmployee] = useState<EmployeeProps>();
  const [user, setUser] = useState<UserProps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeDetailsForUser(id);
  }, []);

  const loadEmployeeDetailsForUser = async (uid: string) => {
    try {
      const data = await fetchEmployeeDetailsByUser(uid);
      setEmployee(data);
      loadEmployeeDetailsFromUsers(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEmployeeDetailsFromUsers = async (uid: string) => {
    try {
      const data = await fetchUser(uid);
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View></View>;

  return (
    <View
      style={tw`flex flex-col justify-center items-center py-1.5 mt-2 text-2xl tracking-tighter rounded-xl bg-zinc-300 max-w-[356px] w-[340px] text-zinc-800`}
    >
      <View style={tw`flex flex-row items-center`}>
        <Image
          source={images.avatarverified}
          style={tw`object-contain shrink-0 self-stretch my-auto ml-3 mr-3 aspect-square`}
        />
        <View
          style={tw`self-stretch px-1 py-0.5 my-auto min-w-[240px] w-[200px]`}
        >
          <Text
            style={tw`text-xl text-start self-stretch tracking-tighter rounded-xl text-zinc-800 items-center`}
          >
            {user?.username}
          </Text>

          <StatsCounter
            ranking={employee?.assurance ?? 0}
            ratings={employee?.rating ?? 0}
          />
        </View>
        <Image
          source={images.arrowright}
          style={tw`object-contain shrink-0 self-stretch my-auto w-5 aspect-square mr-3`}
        />
      </View>
    </View>
  );
};

export default EmployeesListItem;
