import * as React from "react";
import { View, Text } from "react-native";
import { EarningProps } from "../types";

import tw from "twrnc";

export const TotalEarnings: React.FC<EarningProps> = ({ totalEarnings }) => {
  return (
    <View
      style={tw`flex flex-col justify-center items-center mt-3 text-center`}
    >
      <View
        style={tw`text-xl font-extrabold tracking-tight leading-none text-stone-900`}
      >
        <Text
          style={tw`text-xl font-extrabold leading-none text-center text-stone-900`}
        >
          ${Number(totalEarnings || 0).toFixed(2)}
        </Text>
      </View>
      <View
        style={tw`text-xs font-semibold tracking-tight leading-6 text-neutral-400`}
      >
        <Text
          style={tw`text-xs font-bold leading-1 tracking-tight text-neutral-400`}
        >
          Total Earnings
        </Text>
      </View>
    </View>
  );
};
