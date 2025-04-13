import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import { images } from '@/assets/images';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOtp, resendOtp } from '@/services/auth_service';

// Helper function to safely extract the error message
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred. Please try again.';
};

const SignUpConfirmScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  console.log('All Params:', params);

  // Retrieve phone and sessionId from params
  const phone = (Array.isArray(params.phone) ? params.phone[0] : params.phone) as string;
  const sessionId = (Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId) as string;

  console.log('Phone:', phone);
  console.log('Session ID:', sessionId || 'Session ID is missing');

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedPress = async () => {
    if (!code) {
      setErrorMessage('Please enter the code.');
      return;
    }

    if (!sessionId) {
      Alert.alert('Error', 'Session ID is missing.');
      return;
    }

    try {
      setIsLoading(true);
      const { success, data } = await verifyOtp(phone, code, sessionId);

      if (success) {
        Alert.alert('Success', 'OTP verified successfully!');
        router.push({
          pathname: '/sign_up_verified',
          params: {
            sessionId,
            phone,
            username: params.username, // Pass username
            email: params.email, // Pass email
            homeAddress: params.homeAddress, // Pass home address
            dateOfBirth: params.dateOfBirth, // Pass date of birth
            role: params.role, // Pass role
            password: params.password, // Pass password
          },
        });
      } else {
        setErrorMessage(getErrorMessage(data) || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!sessionId) {
      Alert.alert('Error', 'Session ID is missing.');
      return;
    }

    try {
      setIsLoading(true);
      const { success, data } = await resendOtp(phone, sessionId);

      if (success) {
        Alert.alert('Success', 'OTP has been resent.');
      } else {
        Alert.alert('Error', getErrorMessage(data) || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
      console.error('Error resending OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Enter Code</Text>
      <Text style={tw`text-center mb-8 mx-4`}>Enter the code sent to your number.</Text>

      {/* Code Input */}
      <Text style={tw`text-left w-full mb-2`}>Code</Text>
      <TextInput
        style={tw`border border-gray-500 p-4 rounded-lg mb-4 w-full`}
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        placeholder="Enter verification code"
      />

      {/* Error Message */}
      {errorMessage ? <Text style={tw`text-red-500 text-sm mb-4`}>{errorMessage}</Text> : null}

      {/* Proceed Button */}
      <TouchableOpacity
        style={tw`bg-[#068A2D] p-4 rounded-lg mb-4 w-full ${isLoading ? 'opacity-50' : ''}`}
        onPress={handleProceedPress}
        disabled={isLoading}
      >
        <Text style={tw`text-white text-lg font-bold text-center`}>
          {isLoading ? 'Verifying...' : 'Proceed'}
        </Text>
      </TouchableOpacity>

      {/* Resend Code Link */}
      <View style={tw`flex-row`}>
        <Text style={tw`text-black`}>Didn't get the code? </Text>
        <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
          <Text style={tw`text-[#068A2D] underline`}>Resend</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={tw`absolute bottom-0 left-0 right-0 items-center pb-6`}>
        <Image source={images.Log} style={tw`w-[82px] h-[57px]`} />
      </View>
    </View>
  );
};

export default SignUpConfirmScreen;