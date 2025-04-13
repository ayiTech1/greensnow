import * as React from "react";
import { View, Image, Text } from "react-native";

import tw from "twrnc";
import { DateTimeProps } from "../(tabs)/types";
import { images } from "@/assets/images";


export const DateTimeDisplay: React.FC<DateTimeProps> = ({
date,
time
}) => {
  return (
    <View style = {tw`flex flex-col mt-3 w-full font-semibold leading-6 text-center max-w-[364px]`}>
      <View style = {tw`flex flex-row gap-5 justify-between w-[300px] self-center max-w-[326px]`}>
              <View style={tw`flex flex-row gap-2 items-center`}>
                <Image
                  source={images.calendar}
                style = {tw`object-contain shrink-0 self-stretch my-auto w-[16px] h-[16px] aspect-square`}
                />
                <View style = {tw`self-stretch my-auto`}>
                  <Text style = {tw`font-semibold leading-6 text-center`}>{date}</Text>
                </View>
              </View>
              <View style = {tw`flex flex-row gap-2 items-center`}>
                <Image
                  source={images.clock}
                style = {tw`object-contain shrink-0 self-stretch my-auto w-[16px] h-[16px] aspect-square`}
                />
                <View style = {tw`self-stretch my-auto`}>
                  <Text style = {tw`font-semibold leading-6 text-center`}>{time}</Text>
                </View>
              </View>
            </View>
            <View style = {tw`shrink-0 self-center mt-1 mb-3 w-[320px] h-px border border-solid border-stone-300`} />
    </View>
  );
};
