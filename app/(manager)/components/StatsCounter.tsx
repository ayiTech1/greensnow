import { images } from "@/assets/images";
import * as React from "react";
import { View, Image, Text } from "react-native";
import tw from "twrnc";

const stats = [
  {
    icon: images.star,
    value: 0,
  },
  {
    icon: images.ranking,
    value: 0,
  },
];

export function StatsCounter() {
  return (
    <View style={tw`flex flex-col self-start mt-3`}>
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
