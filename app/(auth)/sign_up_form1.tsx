import React, { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRegistration } from '@/context/registration';
import { useRouter, useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { View, Text, TouchableOpacity, Alert } from "react-native";
import InputField from "@/components/auth/InputField";
import { appRegister } from '@/services/auth_service';

interface FormValues {
  username: string;
  phone: string;
  email: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'), // Validate 10-digit numbers
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Ensure the phone number is exactly 10 digits
  if (cleaned.length !== 10) {
    throw new Error('Phone number must be 10 digits long.');
  }
  return cleaned; // Return the 10-digit number as-is
};

const SignUpFormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Retrieve session ID from params
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const { setBasicInfo } = useRegistration();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values: FormValues) => {
    setLoading(true);
    try {
      // Clean the phone number to ensure it contains only digits
      const cleanedPhone = formatPhoneNumber(values.phone);

      console.log('Session ID before API call:', sessionId); // Debugging
      const response = await appRegister({
        sessionId: sessionId as string,
        ...values,
        phone: cleanedPhone, // Use the cleaned phone number
      });
      setBasicInfo(response);

      // Pass the sessionId to the next screen
      router.push({
        pathname: '/sign_up_form2',
        params: { sessionId: response.sessionId, phone: response.phone}, // Ensure the response contains the sessionId
        
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-6 `}>
      <Formik
        initialValues={{ username: '', phone: '', email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-2xl font-bold text-black mb-1 text-center`}>
              Sign Up
            </Text>
            <Text style={tw`text-gray-600 text-center mb-8 mx-15`}>
              Enter details below to create an account with{" "}
              <Text style={tw`text-gray-700 font-bold`}>Green Snow</Text>
            </Text>

            <View style={tw`w-full max-w-[300px] mx-auto`}>
              <InputField
                label="Username"
                placeholder="Enter your username"
                value={values.username}
                onChangeText={handleChange('username')}
                errorMessage={touched.username && errors.username ? errors.username : ''}
                style={tw`w-full`}
              />

              <InputField
                label="Phone"
                placeholder="Enter your phone number"
                value={values.phone}
                onChangeText={handleChange('phone')}
                keyboardType="phone-pad"
                errorMessage={touched.phone && errors.phone ? errors.phone : ''}
                style={tw`w-full`}
              />

              <InputField
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
                errorMessage={touched.email && errors.email ? errors.email : ''}
                style={tw`w-full`}
              />

              <TouchableOpacity
                style={tw`w-full bg-[#068A2D] rounded-lg p-4 items-center mt-3`}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                <Text style={tw`text-white text-lg font-bold`}>
                  {loading ? 'Processing...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignUpFormScreen;