import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import UserHeader from "./components/UserHeader";
import { images } from "@/assets/images";

const HomeBeingVerified: React.FC = () => {
  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center pt-15 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <Image
        source={images.clipboard}
        style={tw`object-contain max-w-full aspect-[1.03] w-[237px] h-[231px]`}
      />
      <View
        style={tw`mt-16 text-2xl font-extrabold tracking-tighter text-stone-900 w-[251px]`}
      >
        <Text
          style={tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}
        >
          Your account is{"\n"}being verified.
        </Text>
      </View>
      <View style={tw`mt-4 w-[232px]`}>
        <Text style={tw`text-xs text-center tracking-tight text-zinc-500`}>
          Your details are being verified by our team. You will be notified once
          you are cleared to begin shifts.
        </Text>
      </View>
    </View>
  );
};

export default HomeBeingVerified;
