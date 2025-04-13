import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ButtonProps } from '../(tabs)/types';

import tw from "twrnc";

export const ActionButton: React.FC<ButtonProps> = ({ label, isEnabled, onPress, className }) => {
  const buttonStyle = isEnabled
    ?  "bg-green-700"
    : "bg-stone-300 text-zinc-500";

    const textColor = isEnabled
    ?  "text-white"
    : "text-zinc-500";

  return (
    <View style = {tw`flex flex-col self-start items-center w-[300px]`}>
    <TouchableOpacity 
      onPress={onPress}
      style={tw`self-center px-16 py-4 mt-1 w-full rounded-xl max-w-[327px] ${buttonStyle} ${className} ${textColor}`}
      accessibilityRole="button"
    >
      <Text style={tw`text-xl font-semibold tracking-tight text-center text-white ${textColor}`}>
        {label}
      </Text>
    </TouchableOpacity>
    </View>
  );
};