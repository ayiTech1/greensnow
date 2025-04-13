import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { images } from '@/assets/images';
import { verifyAccount } from '@/services/auth_service';

const SignUpCreatedScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract all user data from params
  const sessionId = (Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId) as string;
  const phone = (Array.isArray(params.phone) ? params.phone[0] : params.phone) as string;
  const username = (Array.isArray(params.username) ? params.username[0] : params.username) as string;
  const email = (Array.isArray(params.email) ? params.email[0] : params.email) as string;
  const homeAddress = (Array.isArray(params.homeAddress) ? params.homeAddress[0] : params.homeAddress) as string;
  const dateOfBirth = (Array.isArray(params.dateOfBirth) ? params.dateOfBirth[0] : params.dateOfBirth) as string;
  const role = (Array.isArray(params.role) ? params.role[0] : params.role) as string;
  const password = (Array.isArray(params.password) ? params.password[0] : params.password) as string;

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Session ID:', sessionId); // Debugging log

    const submitData = async () => {
      try {
        if (!sessionId) {
          throw new Error('Session ID is missing.');
        }

        // Prepare user data
        const userData = {
          username,
          email,
          phone,
          homeAddress,
          dateOfBirth,
          role,
          password,
        };

        // Call the backend to verify the account and create the user
         const response = await verifyAccount({ session_id: sessionId, userData });
        console.log('Backend Response:', response); // Debugging log

        // Set the success message from the backend
        setMessage(response.message || 'Account created successfully!');
      } catch (error) {
        console.error('Error:', error); // Debugging log

        // Handle the error safely
        if (error instanceof Error) {
          setMessage(error.message || 'Account verification failed. Please try again.');
        } else {
          setMessage('Account verification failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Automatically submit data when the screen loads
    submitData();
  }, [sessionId]);

  const handleProceedToLogin = () => {
    router.push({
      pathname: '/sign_in',
    });
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gray-100 p-4`}>
      {loading ? (
        <ActivityIndicator size="large" color="#068A2D" />
      ) : (
        <>
          <Text style={tw`text-2xl font-bold mt-25`}>{message}</Text>
          <View style={tw`items-center mb-2`}>
            <View style={tw`p-4 mt-2`}>
              <Image
                source={images.completeAccount}
                style={tw`w-[283px] h-[331px]`}
                accessibilityLabel="Account successfully created illustration"
              />
            </View>
          </View>

          <TouchableOpacity
            style={tw`bg-[#068A2D] p-4 rounded-lg mb-4 w-full`}
            onPress={handleProceedToLogin}
            accessibilityLabel="Proceed to login button"
          >
            <Text style={tw`text-white font-bold text-lg text-center`}>Proceed To Login</Text>
          </TouchableOpacity>

          <View style={tw`mt-4`}>
            <Image
              source={images.Log}
              style={tw`w-[82px] h-[57px]`}
              accessibilityLabel="Footer logo"
            />
          </View>
        </>
      )}
    </View>
  );
};

export default SignUpCreatedScreen;