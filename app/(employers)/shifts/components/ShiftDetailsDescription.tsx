import * as React from "react";
import { View, Text } from "react-native";
import { ShiftDetailsDescriptionProps } from "../types";
import tw from "twrnc";

export const Details: React.FC<ShiftDetailsDescriptionProps> = ({ description }) => {
  return (
    <View style={tw`flex flex-col items-start text-xs mt-3 tracking-tight rounded-none max-w-[359px]`}>
     
        <Text style={tw`font-semibold leading-6 text-neutral-400 text-xs tracking-tight`}>Details</Text>
        <Text style={tw`text-zinc-600 tracking-tight text-xs text-neutral-500`}>{description}</Text>
     
    </View>
  );
};