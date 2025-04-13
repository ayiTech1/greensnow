import * as React from "react";
import { View, Text } from "react-native";
import { MetricDisplayProps } from "../(tabs)/types";

import tw from "twrnc";


export function MetricDisplay({
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
}: MetricDisplayProps) {
  return (
    <View style = {tw`flex flex-col mt-3 w-full font-semibold leading-6 text-center max-w-[364px]`}>
      <View style = {tw`flex flex-row gap-10`}>
        <View style = {tw`flex flex-col flex-1 justify-center items-start`}>
          <View style = {tw`text-sm tracking-tight text-stone-900`}>
            <Text style = {tw`text-sm font-bold text-stone-900`}>{leftValue}</Text>
          </View>
          <View style = {tw`text-xs tracking-tight text-neutral-400`}>
            <Text style = {tw`text-xs font-bold leading-1 text-neutral-400`}>{leftLabel}</Text>
          </View>
        </View>
        <View style = {tw`flex flex-col flex-1 justify-center items-end`}>
          <View style = {tw`text-sm tracking-tight text-stone-900`}>
            <Text style = {tw`text-sm font-bold text-stone-900`}>{rightValue}</Text>
          </View>
          <View style = {tw`text-xs tracking-tight text-neutral-400`}>
            <Text style = {tw`text-xs font-bold leading-1 text-neutral-400`}>{rightLabel}</Text>
          </View>
        </View>
      </View>
      <View style = {tw`shrink-0 mt-1 w-[320px] self-center h-px border border-solid border-stone-300`} />
    </View>
  );
}