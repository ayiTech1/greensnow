import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { images } from '@/assets/images';
import { signInOTPForm } from '@/services/auth_service';

const AuthenticationForm = () => {
  const router = useRouter();
  const { sessionId, method } = useLocalSearchParams<{ sessionId: string; method: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceedPress = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
  
    if (!sessionId) {
      Alert.alert('Error', 'Session ID is missing.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await signInOTPForm({ sessionId, code: otp });
  
      // Navigate to the SignInVerified screen with the message and role
      router.push({
        pathname: '/sign_in_verified',
        params: { 
          message: response.message, // Pass the message from the backend
          role: response.role,       // Pass the role from the backend
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = () => {
    Alert.alert('Code Resent', 'A new OTP has been sent to your selected method.');
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Sign In Confirmation</Text>
      <Text style={tw`text-center mb-8 mx-4`}>Enter the code sent to your {method}.</Text>

      <TextInput
        style={tw`border border-gray-500 p-4 rounded-lg mb-4 w-full text-lg text-center`}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        style={tw`bg-[#068A2D] p-4 rounded-lg mb-4 w-full ${loading ? 'opacity-50' : ''}`}
        onPress={handleProceedPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-lg font-bold text-center`}>Proceed</Text>
        )}
      </TouchableOpacity>

      <View style={tw`flex-row`}>
        <Text style={tw`text-black`}>Didn't get the code? </Text>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={tw`text-[#068A2D] underline`}>Resend</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`absolute bottom-0 left-0 right-0 items-center pb-6`}>
        <Image source={images.Log} style={tw`w-[82px] h-[57px]`} />
      </View>
    </View>
  );
};

export default AuthenticationForm;