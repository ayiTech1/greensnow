import * as React from "react";
import { View, Text } from "react-native";
import { CountdownTimerProps } from "../(tabs)/types";
import tw from 'twrnc';

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  hours,
  minutes
  }) => {
  return (
    <View>
    <View style={tw`mt-8 text-lg font-bold tracking-tight text-center`}>
      <Text style={tw`text-lg font-bold tracking-tight text-center`}>
        {hours} hours {minutes} minutes
      </Text>
    </View>
    <View style={tw`self-center w-[271px]`}>
    <Text style={tw`self-center text-sm tracking-tight text-center text-zinc-600 w-[271px]`}>for shift to end.</Text>
  </View>
  </View>
  );
}
