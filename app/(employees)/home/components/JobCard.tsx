import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import { JobCardProps, ShiftDetailsProps } from "../types";
import { JobDetailProps } from "../types";

import tw from "twrnc";
import { images } from "@/assets/images";
import { router } from "expo-router";

const JobCard = ({
  job,
  employee = "",
  route,
}: {
  job: ShiftDetailsProps;
  employee?: string;
  route: string;
}) => {
  const details = [
    {
      icon: images.calendarwhite,
      text: moment(job.date.toString()).format("ddd, Do MMM"),
    },
    {
      icon: images.clockwhite,
      text: moment(job.start_time.toString()).format("hh:mm A"),
    },
    {
      icon: images.locationpin,
      text: job.location,
    },
    {
      icon: images.position,
      text: job.name,
    },
    {
      icon: images.approvedwhite,
      text: employee,
    },
  ];

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: route as any,
          params: { id: job.id },
        })
      }
    >
      <View
        style={tw`flex flex-col w-full text-sm font-semibold tracking-tight mt-3 leading-6 items-center text-white rounded-none max-w-[362px]`}
      >
        <View
          style={tw`flex flex-col justify-center px-2 py-2 w-[95%] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] h-[210px] shadow-lg`}
        >
          <View
            style={tw`flex flex-col px-2.5 py-3 w-full overflow-hidden aspect-[1.778] h-[194px]`}
          >
            <Image
              source={{ uri: job.background_image_url }}
              style={tw`object-contain absolute self-center shrink-0 inset-0 size-full w-[320px] h-[194px]`}
            />
            <View
              style={tw`flex relative gap-0.3 flex-col items-start max-w-full w-[90%]`}
            >
              {details.map((detail, index) => (
                <JobDetail key={index} icon={detail.icon} text={detail.text} />
              ))}
            </View>
            <View
              style={tw`flex flex-row relative items-center self-end absolute bottom-2 right-2`}
            >
              <View style={tw`self-stretch my-auto mx-1`}>
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  ${parseFloat(job.salary_per_time)?.toFixed(2)}/hr
                </Text>
              </View>
              <View
                style={tw`shrink-0 self-stretch my-auto w-0 border border-white border-solid h-[19px]`}
              />
              <View style={tw`self-stretch my-auto mx-1`}>
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  {job.shift_duration} hrs
                </Text>
              </View>
              <View
                style={tw`shrink-0 self-stretch my-auto w-0 border border-white border-solid h-[19px]`}
              />
              <View style={tw`self-stretch my-auto mx-1`}>
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  $
                  {job.total_earning
                    ? Number(job.total_earning).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const JobDetail: React.FC<JobDetailProps> = ({ icon, text }) => {
  const textSize =
    icon === images.position || icon === images.approvedwhite
      ? "text-xl"
      : "text-sm";
  return (
    <View style={tw`flex flex-row gap-2 items-center`}>
      {icon === images.approvedwhite && text === "" ? (
        <View />
      ) : (
        <View style={tw`flex flex-row gap-2 items-center`}>
          <Image
            source={icon}
            style={tw`object-contain shrink-0 self-stretch my-auto w-4 aspect-square`}
          />
          <View style={tw`self-stretch my-auto`}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`font-semibold tracking-tight leading-6 text-center text-white ${textSize}`}
            >
              {text}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default JobCard;
