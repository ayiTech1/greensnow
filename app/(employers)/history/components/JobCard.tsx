import * as React from "react";
import { View, Image, Text } from "react-native";
import { JobCardProps } from "./types";
import { JobDetailProps } from "./types";

import tw from "twrnc";
import { images } from "@/assets/images";


const JobCard: React.FC<JobCardProps> = ({
  date,
  time,
  location,
  employee = '',
  position,
  hourlyRate,
  hours,
  totalAmount,
  backgroundImage,
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
      text: position,
    },
    {
      icon: images.approvedwhite,
      text: employee,
    },
  ];

  return (
    <View style={tw`flex flex-col w-full text-sm font-semibold tracking-tight mt-3 leading-6 text-center text-white rounded-none max-w-[362px]`}>
      <View style={tw`flex flex-col justify-center px-2 py-2 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-full h-[210px] shadow-lg`}>
        <View style={tw`flex flex-col px-2.5 py-3 w-full overflow-hidden aspect-[1.778] h-[194px]`}>
          <Image
            source={{ uri: backgroundImage }}
            style={tw`object-contain absolute self-center shrink-0 inset-0 size-full w-[320px] h-[194px]`}
          />
          <View style={tw`flex relative gap-0.3 flex-col items-start max-w-full w-[184px]`}>
            {details.map((detail, index) => (
              <JobDetail key={index} icon={detail.icon} text={detail.text} />
            ))}
          </View>
          <View style={tw`flex flex-row relative items-center self-end absolute bottom-2 right-2`}>
            <View style={tw`self-stretch my-auto`}>
              <Text style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}>${hourlyRate.toFixed(2)}/hr </Text>
            </View>
            <View style={tw`shrink-0 self-stretch my-auto w-0 border border-white border-solid h-[19px]`} />
            <View style={tw`self-stretch my-auto`}>
              <Text style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}> {hours} hrs </Text>
            </View>
            <View style={tw`shrink-0 self-stretch my-auto w-0 border border-white border-solid h-[19px]`} />
            <View style={tw`self-stretch my-auto`}>
              <Text style={tw`text-sm font-semibold tracking-tight leading-6 text-center text-white`}> ${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const JobDetail: React.FC<JobDetailProps> = ({ icon, text }) => {
  const textSize = icon === images.position || icon === images.approvedwhite?
"text-xl" : "text-sm";
  return (
    <View style={tw`flex flex-row gap-2 items-center`}>
      {icon === images.approvedwhite && text === ''?
       <View /> : <View style={tw`flex flex-row gap-2 items-center`}>
       <Image
         source={ icon }
         style={tw`object-contain shrink-0 self-stretch my-auto w-4 aspect-square`}
       />
       <View style={tw`self-stretch my-auto`}>
         <Text style={tw`font-semibold tracking-tight leading-6 text-center text-white ${textSize}`}>{ text }</Text>
       </View>
 
 </View>
}
    </View>
  );
};

export default JobCard;