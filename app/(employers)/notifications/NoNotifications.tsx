import React from "react";
import { View, Image, Text } from "react-native";
import tw from "twrnc";
import UserHeader from "./components/UserHeader";
import { images } from "@/assets/images";


export const NoNotifications: React.FC = () => {
  return (
    <View style={tw`flex-1 overflow-hidden flex-col items-center px-4 pt-10 pb-6 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}>
     
      <Image
        // loading="lazy"
        source={images.clipboard}
        style={tw`object-contain mt-28 max-w-full aspect-[1.03] w-[237px]`}
      />
      <View style={tw`mt-11 text-2xl font-extrabold tracking-tighter leading-8 text-stone-900 w-[251px]`}>
        <Text style={tw`text-2xl font-extrabold text-center tracking-tighter leading-8 text-stone-900`}>You have no new notifications.</Text>
      </View>
    </View>
  );
};
