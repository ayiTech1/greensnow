import { images } from "@/assets/images";
import * as React from "react";
import { View, Image, Text } from "react-native";
import tw from "twrnc";

export function ShiftsHeader() {
  return (
    <View style = {tw`flex flex-row gap-10 justify-between items-start self-stretch`}>
        <Image
          source={images.backbtn}
          style = {tw`object-contain shrink-0 w-6 aspect-square w-[24px] h-[24px]`}
          className="object-contain shrink-0 w-6 aspect-square"
        />

      </View>
  );
}
