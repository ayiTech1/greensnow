import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonProps } from "./types";

import tw from "twrnc";

export const ActionButton: React.FC<ButtonProps> = ({
  label,
  isEnabled,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <View style={tw`flex flex-col self-start items-center w-[300px]`}>
      {isEnabled ? (
        <TouchableOpacity
          onPress={onPress}
          style={tw`self-center px-16 py-4 mt-1 w-full rounded-xl max-w-[327px] bg-green-700 ${
            buttonStyle || ""
          }`}
          accessibilityRole="button"
        >
          <Text
            style={tw`text-xl font-semibold tracking-tight text-center text-white text-white ${
              textStyle || ""
            }`}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={tw`self-center px-16 py-4 mt-1 w-full rounded-xl max-w-[327px] bg-stone-300 ${
            buttonStyle || ""
          }`}
        >
          <Text
            style={tw`text-xl font-semibold tracking-tight text-center text-zinc-500 ${
              textStyle || ""
            }`}
          >
            {label}
          </Text>
        </View>
      )}
    </View>
  );
};
