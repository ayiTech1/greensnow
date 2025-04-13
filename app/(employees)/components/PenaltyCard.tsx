import * as React from "react";
import { View, Text, Image } from "react-native";
import tw from 'twrnc';
import { PenaltyCardProps } from "../types";

export const PenaltyCard: React.FC<PenaltyCardProps> = ({ title, penalties }) => {
  return (
    <View style={tw`flex flex-col items-start self-start py-4 pr-16 pl-3 mt-12 tracking-tight w-[330px] rounded-xl border border-rose-600 border-solid`}>
      <View >
        <Text style={tw`font-bold text-xs text-stone-900`}>{title}</Text>
      </View>
      <View style={tw`flex flex-col mt-5 text-center text-zinc-500 w-[83px]`}>
        {penalties.map((penalty, index) => (
          <View key={index} style={tw`flex flex-row gap-0.5 items-center w-full`}>
            <Image
              accessibilityLabel={`Penalty icon for ${penalty.text}`}
              source={penalty.icon }
              style={tw`object-contain shrink-0 self-stretch my-auto w-[20px] h-[20px] aspect-square`}
            />
            <View style={tw`self-stretch my-auto`}>
              <Text style={tw`flex text-center text-zinc-500 w-[83px]`}>{penalty.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default PenaltyCard;