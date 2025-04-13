import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  "account-verify": undefined;
};

export const Home: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleFinishSetup = () => {
    navigation.navigate("account-verify"); // Replace "AccountSetup" with the name of your target screen
  };

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center px-3 pb-6 mx-auto w-full bg-zinc-100 max-w-[480px]`}
    >
      <Image
        source={require("@/assets/images/clipboard.png")}
        style={tw`object-contain mt-20 max-w-full aspect-[1.03] w-[237px] h-[231px]`}
      />
      <View
        style={tw`mt-12 text-2xl font-extrabold tracking-tighter text-stone-900 w-[251px]`}
      >
        <Text
          style={tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}
        >
          You are not verified{"\n"}for picking gigs yet
        </Text>
      </View>
      <View style={tw`mt-4`}>
        <Text style={tw`text-xs tracking-tight mx-20 text-zinc-500`}>
          Finish up your registration to make yourself viable for gigs. You have
          completed <Text style={tw`font-extrabold text-black`}>20%</Text> of
          your account setup
        </Text>
      </View>
      <TouchableOpacity style={tw`mt-5`} onPress={handleFinishSetup}>
        <Text
          style={tw`text-xs font-bold tracking-tight text-stone-900 underline`}
        >
          Finish account setup
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
