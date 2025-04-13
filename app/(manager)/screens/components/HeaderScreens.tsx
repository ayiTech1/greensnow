import { images } from "@/assets/images";
import { router } from "expo-router";
import * as React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

export function HeaderScreens() {
  return (
    <View style = {tw`flex flex-row mt-2 mb-3 gap-10 justify-between items-start self-stretch`}>
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={images.backbtn}
          
        />
        </TouchableOpacity>

      </View>
  );
}
