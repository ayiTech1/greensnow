import { images } from "@/assets/images";
import { router } from "expo-router";
import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

export function ShiftsHeader() {
  return (
    <View style = {tw`flex self-stretch mt-1 mb-3`}>
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={images.backbtn}
        />
        </TouchableOpacity>

      </View>
  );
}
