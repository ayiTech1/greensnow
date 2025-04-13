import * as React from "react";
import { View, Image, Text } from "react-native";
import {
  EmployerProps,
  JobCardProps,
  ShiftsTakenJobCardProps,
  UpcomingShiftProps,
  UserProps,
} from "./types";
import { JobDetailProps } from "./types";

import tw from "twrnc";
import { images } from "@/assets/images";
import { useEffect, useState } from "react";
import {
  fetchEmployee,
  fetchEmployer,
  // fetchUpcomingShift,
  fetchUpcomingShiftByShift,
  fetchUpcomingShifts,
  fetchUser,
} from "@/services/api_test";

const ShiftsTakenJobCard: React.FC<ShiftsTakenJobCardProps> = ({
  jobId,
  date,
  time,
  location,
  shiftType,
  employer,
  hourlyRate,
  hours,
  totalAmount,
  backgroundImage,
}) => {
  const [data, setData] = useState<UpcomingShiftProps[]>();
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<UserProps>();
  const [employerData, setEmployerData] = useState<EmployerProps>();

  const details = [
    {
      icon: images.calendarwhite,
      text: date,
    },
    {
      icon: images.clockwhite,
      text: time,
    },
    {
      icon: images.locationpin,
      text: location,
    },
    {
      icon: images.position,
      text: shiftType,
    },
    {
      icon: images.employer,
      text: employerData?.company_name,
    },
    {
      icon: images.approvedwhite,
      text: employeeData?.username,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const upcomingShift = await fetchUpcomingShiftByShift(jobId);
        console.log("upcomingShift", upcomingShift);
        if (Array.isArray(upcomingShift) && upcomingShift.length > 0) {
          const employeeId = upcomingShift[0]?.employee;
          const employerId = upcomingShift[0]?.employer;
          if (employeeId) {
            await getEmployee(employeeId);
          }
          if (employerId) {
            await getEmployer(employerId);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  const getEmployee = async (employee_id: string) => {
    try {
      const employeeData = await fetchEmployee(employee_id);
      await getEmployeeUserDetails(employeeData.user);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployer = async (employer_id: string) => {
    try {
      const employerData = await fetchEmployer(employer_id);
      setEmployerData(employerData);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeUserDetails = async (uid: string) => {
    try {
      const userData = await fetchUser(uid);
      setEmployeeData(userData);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <View></View>;

  return (
    <View
      style={tw`flex flex-col w-full text-sm font-semibold tracking-tight mt-3 leading-6 text-center text-white rounded-none max-w-[362px]`}
    >
      <View
        style={tw`flex flex-col justify-center px-2 py-2 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-[220px] shadow-lg`}
      >
        <View
          style={tw`flex flex-col px-2.5 py-3 w-full overflow-hidden aspect-[1.778] h-[210px]`}
        >
          <Image
            source={{ uri: backgroundImage }}
            style={tw`object-contain absolute self-center shrink-0 inset-0 size-full w-[320px] h-[220px]`}
          />
          <View
            style={tw`flex relative gap-0.3 flex-col items-start max-w-full w-full`}
          >
            {details.map((detail, index) => (
              <JobDetail
                key={index}
                icon={detail.icon}
                text={String(detail.text)}
              />
            ))}
          </View>
          <View
            style={tw`flex flex-row relative items-center self-end absolute bottom-2 right-2`}
          >
            <View style={tw`self-stretch my-auto`}>
              <Text
                style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
              >
                ${hourlyRate?.toFixed(2)}/hr{" "}
              </Text>
            </View>
            <View
              style={tw`shrink-0 self-stretch my-auto w-0 border border-white border-solid h-[19px]`}
            />
            <View style={tw`self-stretch my-auto`}>
              <Text
                style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
              >
                {" "}
                {hours} hrs{" "}
              </Text>
            </View>
            <View
              style={tw`shrink-0 self-stretch my-auto w-0 border border-white border-solid h-[19px]`}
            />
            <View style={tw`self-stretch my-auto`}>
              <Text
                style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
              >
                {" "}
                ${totalAmount?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const JobDetail: React.FC<JobDetailProps> = ({ icon, text }) => {
  return (
    <View style={tw`flex flex-row gap-2 items-center`}>
      <View style={tw`flex flex-row gap-2 items-center`}>
        <Image
          source={icon}
          style={tw`object-contain shrink-0 self-stretch my-auto`}
        />
        <View style={tw`self-stretch my-auto`}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`font-semibold tracking-tight leading-6 text-center text-white text-base`}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ShiftsTakenJobCard;
