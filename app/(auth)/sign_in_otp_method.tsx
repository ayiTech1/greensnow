import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import OptionButton from '@/components/auth/OptionButton';
import { images } from '@/assets/images';
import { selectOTPDeliveryMethod } from '@/services/auth_service';

const SignInOTPMethod = () => {
  const router = useRouter();
  const { email, sessionId } = useLocalSearchParams<{ email: string; sessionId: string }>();
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = async (option: string) => {
    if (!sessionId) {
      Alert.alert('Error', 'Session ID is missing.');
      return;
    }

    setLoading(true);
    try {
      await selectOTPDeliveryMethod({ method: option, sessionId });
      Alert.alert('Success', `OTP sent via ${option}.`, [
        {
          text: 'OK',
          onPress: () => router.push({
            pathname: '/sign_in_otp_form',
            params: { email, option, sessionId },
          }),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { text: 'Confirm With Phone Number', icon: <FontAwesome name="phone" size={24} color="green" />, method: 'phone' },
    { text: 'Continue With Email', icon: <MaterialIcons name="email" size={24} color="green" />, method: 'email' },
    { text: 'Continue With Authenticator', icon: <MaterialIcons name="lock" size={24} color="green" />, method: 'authenticator' },
  ];

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Sign In Confirmation</Text>
      <Text style={tw`text-center mx-14 mb-10`}>
        As an added security feature, we want to verify it is really you. Choose your preferred option below.
      </Text>

      {options.map((option, index) => (
        <OptionButton
          key={index}
          text={option.text}
          icon={option.icon}
          onPress={() => handleOptionSelect(option.method)}
          disabled={loading} // Pass the loading state as disabled
        />
      ))}

      <View style={tw`absolute bottom-0 left-0 right-0 items-center pb-6`}>
        <Image source={images.Log} style={tw`w-[82px] h-[57px]`} />
      </View>
    </View>
  );
};

export default SignInOTPMethod;