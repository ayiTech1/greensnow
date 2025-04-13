import * as React from "react";
import { View, Image, Text } from "react-native";
import { JobCardProps } from "../(tabs)/types";
import { JobDetailProps } from "../(tabs)/types";

import tw from "twrnc";
import { images } from "@/assets/images";

const JobCard: React.FC<JobCardProps> = ({
  date,
  time,
  location,
  employee = "",
  shiftType,
  hourlyRate,
  hours,
  totalAmount,
  backgroundImage,
  employer,
}) => {
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
      text: employer,
    },
    {
      icon: images.approvedwhite,
      text: employee,
    },
  ];

  return (
    <View
      style={tw`flex w-full text-sm font-semibold tracking-tight mt-8 leading-6 text-center text-white rounded-none max-w-[362px] h-[211px]`}
    >
      <View
        style={tw`flex justify-center px-2 py-3 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full shadow-lg`}
      >
        <View
          style={tw`flex flex-col px-2.5 py-3 w-full overflow-hidden aspect-[1.778] h-[205px]`}
        >
          <Image
            source={{ uri: backgroundImage }}
            style={tw`object-contain absolute self-center shrink-0 inset-0 size-full w-[330px] h-[205px]`}
          />
          <View
            style={tw`flex relative flex-col items-start max-w-full w-full`}
          >
            {details.map((detail, index) => (
              <JobDetail key={index} icon={detail.icon} text={detail.text} />
            ))}
          </View>
          <View
            style={tw`flex flex-row relative items-center self-end absolute bottom-2 right-2`}
          >
            <View style={tw`self-stretch my-auto`}>
              {hourlyRate != null ? (
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  ${parseFloat(hourlyRate).toFixed(2)} /hr{" "}
                </Text>
              ) : (
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  ${hourlyRate}/hr{" "}
                </Text>
              )}
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
              {totalAmount != null ? (
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  {" "}
                  ${parseFloat(totalAmount).toFixed(2)}
                </Text>
              ) : (
                <Text
                  style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}
                >
                  {" "}
                  ${totalAmount}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const JobDetail: React.FC<JobDetailProps> = ({ icon, text }) => {
  const textSize =
    icon === images.position || icon === images.employer
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
              style={tw`font-semibold tracking-tight leading-6 text-center text-white text-base`}
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
