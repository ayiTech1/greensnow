import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { images } from '@/assets/images';

const SignInVerified = () => {
  const router = useRouter();
  const { message, role } = useLocalSearchParams<{ message: string; role: string }>();

  // Log the role for debugging
  console.log('Role from URL:', role);

  const handleProceed = () => {
    const normalizedRole = role?.toUpperCase(); // Normalize role to uppercase
    console.log('Normalized Role:', normalizedRole); // Log normalized role

    // Redirect based on role
    // if (normalizedRole === 'EMPLOYER') {
    //   router.push('/(employers)/(tabs)');
    // } else if (normalizedRole === 'EMPLOYEE') {
    //   router.push('/(employees)/(tabs)');
    // } else {
    //   router.push('/(manager)/(tabs)'); // Default case
    // }
  };

  // Dynamic button text
  const buttonText = role
    ? `Proceed to ${role.charAt(0).toUpperCase() + role.slice(1)} Section`
    : 'Proceed to Manager Section';

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold mt-25`}>{message}</Text>
      <View style={tw`items-center mb-2`}>
        <View style={tw`p-4 mt-2`}>
          <Image source={images.verifield} style={tw`w-[283px] h-[331px]`} />
        </View>
      </View>

      <TouchableOpacity
        style={tw`bg-[#068A2D] p-4 rounded-lg mb-4 w-full`}
        onPress={handleProceed}
      >
        <Text style={tw`text-white font-bold text-lg text-center`}>
          {buttonText}
        </Text>
      </TouchableOpacity>

      <View style={tw`mt-4`}>
        <Image source={images.Log} style={tw`w-[82px] h-[57px]`} />
      </View>
    </View>
  );
};

export default SignInVerified;