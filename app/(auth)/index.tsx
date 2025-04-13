// app/(auth)/index.tsx
import { View, Text, Image } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";
import { images } from "@/assets/images";
import PrimaryButton from "@/components/auth/PrimaryButton";

export default function AccountScreen() {
  return (
    <View style={tw`flex-1 bg-zinc-100 px-4 py-6 justify-between`}>
      <Text style={tw`text-2xl text-center font-bold mt-30`}>My Account</Text>

      <View style={tw`items-center mt-20`}>
        <Image
          source={images.account}
          style={tw`w-70 h-50`}
          resizeMode="contain"
        />
      </View>

    
      <View style={tw`w-11/12 mx-auto items-center pb-6`}>
        <PrimaryButton
          title="Sign In"
          onPress={() => router.push("/sign_in")}
          isPrimary={true}
          style={tw`w-full`} 
        />
        <View style={tw`h-4`} />
        <PrimaryButton
          title="Sign Up"
          onPress={() => router.push("/sign_up_role")}
          isPrimary={false}
          style={tw`w-full`} 
        />
      </View>
    </View>
  );
}
