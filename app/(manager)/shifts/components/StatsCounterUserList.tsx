import { images } from "@/assets/images";
import * as React from "react";
import { View, Image, Text } from "react-native";
import tw from "twrnc";
import { StatsCounterProps } from "../(tabs)/types";



export const StatsCounter: React.FC<StatsCounterProps> = ({
  ranking,
  ratings
}) => {

  const stats = [
    {
      icon: images.star,
      value: ratings,
    },
    {
      icon: images.ranking,
      value: ranking,
    },
  ];

  return (
    <View style={tw`flex flex-row self-start mt-3 w-[50px]`}>
      {stats.map((stat, index) => (
        <View key={index} style={tw`flex flex-row gap-0.5 items-center w-full`}>
          <Image
            source={
               stat.icon
            }
            style={tw`object-contain shrink-0 self-stretch my-auto w-3 aspect-square`}
          />
          <View style={tw`self-stretch my-auto`}>
            <Text>{stat.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}


