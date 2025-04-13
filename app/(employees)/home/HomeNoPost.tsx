import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

import tw from "twrnc";
// import UserHeader  from "../components/UserHeader";
import { images } from "@/assets/images";
import { Link, router } from "expo-router";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// const HomeNoPosts: React.FC = () => {

type RootStackParamList = {
  "upcoming-shift": undefined;
};

const HomeNoPost: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Get the navigation object

  const handleNavigateToShifts = () => {
    router.push("/(employees)/(tabs)/shift"); // Replace "ShiftsScreen" with the name of your target screen
  };
  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center w-full pt-10 bg-zinc-100 max-w-[480px]`}
    >
      <Image
        source={images.clipboard}
        style={tw`object-contain max-w-full aspect-[1.03] w-[237px] h-[231px]`}
      />
      <View
        style={tw`mt-16 text-2xl font-extrabold tracking-tighter text-stone-900 w-full`}
      >
        <Text
          style={tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}
        >
          You have no{"\n"}upcoming gigs yet
        </Text>
      </View>
      <View style={tw`mt-4 w-[232px]`}>
        <Text style={tw`text-xs text-center tracking-tight text-zinc-500`}>
          No appointment shifts have been made by you yet.
        </Text>
      </View>

      <TouchableOpacity onPress={handleNavigateToShifts} style={tw`mt-5`}>
        <Text style={tw`text-xs tracking-tight text-zinc-500`}>
          You can try{" "}
          <Text
            style={tw`text-xs font-bold tracking-tight text-stone-900 underline`}
          >
            looking for shifts
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeNoPost;
