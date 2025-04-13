import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { router } from "expo-router";

const ShiftsCompleted: React.FC = () => {
  return (
    <View style={tw`flex-1 justify-center items-center bg-zinc-100`}>
      {/* Icon section */}
      <View style={tw`flex-row justify-center mb-8`}>
        <View style={tw`relative`}>
          <Image source={images.completed} />
        </View>
      </View>

      {/* Shift submission message */}
      <Text style={tw`text-2xl font-bold text-center text-stone-900 leading-1`}>
        Your shift has been{"\n"}submitted.
      </Text>
      <Text
        style={tw`text-zinc-600 text-center tracking-tight text-xs text-neutral-500 mt-3`}
      >
        You will be notified once your shift has{"\n"}been approved.
      </Text>

      <View style={tw`self-center mt-20`}>
        <ActionButton
          onPress={() => router.push("/")}
          label="Continue"
          isEnabled={true}
        />
      </View>
    </View>
  );
};

export default ShiftsCompleted;
