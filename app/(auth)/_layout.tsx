// app/(auth)/_layout.tsx
import { Slot, useRouter, useSegments } from "expo-router";
import { View, Image } from "react-native";
import tw from "twrnc";
import { Header } from "@/components/Header";
import { images } from "@/assets/images";
import { RegistrationProvider } from "@/context/registration";

export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const hideFooter = segments[0] === undefined; // Check if we're on the root auth route

  return (
    <RegistrationProvider>
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Shared Header - Hidden on root auth route */}
      {segments.length > 0 && (
        <Header
          showBackButton={true}
          onBackPress={() => router.back()}
          style={tw`absolute top-1 left-1 z-10`}
        />
      )}

      {/* Shared Logo */}
      <View style={tw`absolute top-0 right-0 mt-4 mr-4 z-10`}>
        <Image
          source={images.Logo}
          style={tw`w-30 h-45`}
          accessibilityLabel="Company logo"
        />
      </View>

      {/* Main Content Area with flex-grow to push footer down */}
      <View style={tw`flex-1 pt-20 px-6 pb-6 justify-between`}>
        <Slot />
      </View>

      {/* Footer - Now properly positioned without overriding content */}
      {/* {!hideFooter && (
        <View style={tw`items-center pb-6`}>
          <Image source={images.Log} style={tw`w-[82px] h-[57px]`} />
        </View>
      )} */}
    </View>
    </RegistrationProvider>
  );
}
