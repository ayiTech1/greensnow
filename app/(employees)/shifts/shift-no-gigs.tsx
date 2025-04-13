import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { images } from "@/assets/images";

const NoGigsOnDate: React.FC = () => {
  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center pt-15 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <Image
        source={images.clipboard}
        style={tw`object-contain max-w-full aspect-[1.03] w-[237px] h-[231px]`}
      />
      <View style={tw`mt-16 w-[251px]`}>
        <Text
          style={tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}
        >
          You have no gigs{"\n"}available on this{"\n"}date
        </Text>
      </View>
    </View>
  );
};

export default NoGigsOnDate;
