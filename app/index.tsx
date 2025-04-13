import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { images } from "@/assets/images";

if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const { width } = Dimensions.get("window");

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
  
    router.push("/(auth)");
  };

  return (
    <View style={tw`flex-1 bg-gray-100 justify-between pb-10`}>
      {/* Snowflake at Top Left */}
      <View style={tw`absolute top-2 left-0 z-10`}>
        <Image
          source={images.Snowflake}
          style={[tw`w-40 h-30 opacity-50`, { resizeMode: "contain" }]}
        />
      </View>

      {/* Main Content */}
      <View style={tw`flex-1 justify-center items-center px-8 mt-20`}>
        {/* Logo */}
        <View style={tw`mb-8`}>
          <Image
            source={images.Log}
            style={{
              width: width * 0.7,
              height: width * 0.7 * 0.4,
              resizeMode: "contain",
            }}
          />
        </View>

        <Text style={tw`text-lg text-gray-500 mb-4 text-center`}>
          Easy, Convenient, Quick
        </Text>

        <Text style={tw`text-center text-gray-600 text-base mb-8 leading-6`}>
          Discover millions of gigs and connect with hirers seamlessly
        </Text>
      </View>

      {/* Get Started Button */}
      <View style={tw`px-8 pb-10`}>
        <TouchableOpacity
          style={tw`bg-[#068A2D] rounded-lg py-4 justify-center items-center shadow-lg`}
          onPress={handleGetStarted}
        >
          <Text style={tw`text-lg font-bold text-white`}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingPage;
