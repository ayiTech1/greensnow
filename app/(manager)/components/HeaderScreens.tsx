import { images } from "@/assets/images";
import { router } from "expo-router";
import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

export function HeaderScreens() {
  return (
    <View style = {tw`flex flex-row mt-2 gap-10 justify-between items-start self-stretch`}>
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={images.backbtn}
          style = {tw`object-contain shrink-0 w-6 aspect-square w-[24px] h-[24px] `}
          className="object-contain shrink-0 w-6 aspect-square"
        />
        </TouchableOpacity>

      </View>
  );
}
