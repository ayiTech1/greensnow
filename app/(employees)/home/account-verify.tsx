import React, { useEffect } from "react";
import { View, Image, Text } from "react-native";
import tw from "twrnc";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { images } from "@/assets/images";

type RootStackParamList = {
  'home-page': undefined;
};

const AccountVerify = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Get the navigation object

  useEffect(() => {
    // Navigate to the next screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate("home-page"); // Replace "NextScreen" with the name of your target screen
    }, 3000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={tw`flex-1 overflow-hidden flex-col items-center px-3 pt-10 pb-6 mx-auto w-full text-center bg-zinc-100 max-w-[480px]`}
    >
      <Image
        source={images.homeImage} // Ensure this path is correct
        style={tw`object-contain mt-20 max-w-full aspect-[1.03] w-[237px] h-[231px]`}
      />
      <View style={tw`mt-16 text-2xl font-extrabold tracking-tighter text-stone-900 w-[251px]`}>
        <Text style={tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}>
          Your account is {'\n'} being verified.
        </Text>
      </View>
      <View style={tw`mt-4 w-[232px]`}>
        <Text style={tw`text-xs text-center tracking-tight text-zinc-500`}>
          Your details are being verified by our team. You will be notified once you are cleared to begin shifts.
        </Text>
      </View>
    </View>
  );
};

export default AccountVerify;
