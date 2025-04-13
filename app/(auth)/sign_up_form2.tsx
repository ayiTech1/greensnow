import React from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRegistration } from '@/context/registration';
import { images } from '@/assets/images';
import tw from 'twrnc';
import { appRegisterContinue } from '@/services/auth_service';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
// import Ionicons from "react-native-vector-icons/Ionicons";
import InputField from "@/components/auth/InputField";

interface FormValues {
  homeAddress: string;
  dateOfBirth: Date;
  password: string;
}

const validationSchema = Yup.object().shape({
  homeAddress: Yup.string().required('Home address is required'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date cannot be in the future')
    .required('Date of birth is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Requires at least 1 uppercase letter')
    .matches(/[0-9]/, 'Requires at least 1 number')
    .required('Password is required'),
});

const signupform2 = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId as string;
  
  const { setSocialData } = useRegistration();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);

  const handleSignUp = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = values.dateOfBirth.toISOString().split('T')[0];

      const response = await appRegisterContinue({
        sessionId: sessionId,
        home_address: values.homeAddress,
        date_of_birth: formattedDate,
        password: values.password,
      });

      setSocialData(response);
      console.log('Registration successful:', response.message);

      // Navigate to the OTP confirmation screen
      router.push({
        pathname: '/sign_up_otp',
        params: { sessionId: response.sessionId}, // Pass the sessionId to the next screen
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete registration.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-6 justify-center`}>
      <Formik
        initialValues={{ homeAddress: '', dateOfBirth: new Date(), password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
          <View style={tw`flex-1 justify-center`}>
            <Text style={tw`text-2xl font-bold text-center mb-4`}>Sign Up</Text>
            <Text style={tw`text-gray-600 text-center mb-8 mx-15`}>
              Enter details below to create an account with{" "}
              <Text style={tw`text-gray-700 font-bold`}>Green Snow</Text>
            </Text>

            {/* Home Address Input */}
            <InputField
              label="Home Address"
              placeholder="Enter your home address"
              value={values.homeAddress}
              onChangeText={handleChange('homeAddress')}
              errorMessage={touched.homeAddress && errors.homeAddress ? errors.homeAddress : ''}
              style={tw`w-full`}
            />

            {/* Date of Birth Input */}
            <View style={tw`w-full mb-4`}>
              <Text style={tw`text-black mb-2`}>Date of Birth</Text>
              <TouchableOpacity
                style={tw`border border-gray-500 rounded-lg p-4 pl-10 flex-row justify-between items-center`}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={tw`text-gray-600`}>
                  {values.dateOfBirth.toDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="gray" />
              </TouchableOpacity>
              {touched.dateOfBirth && errors.dateOfBirth && (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                  {String(errors.dateOfBirth)}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={handleChange('password')}
              secureTextEntry
              errorMessage={touched.password && errors.password ? errors.password : ''}
              style={tw`w-full`}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={tw`w-full bg-[#068A2D] rounded-lg p-4 items-center mt-4 ${
                isLoading ? 'opacity-75' : ''
              }`}
              onPress={() => handleSubmit()}
              disabled={isLoading}
            >
              <Text style={tw`text-white text-lg font-bold`}>
                {isLoading ? 'Loading...' : 'Complete Registration'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default signupform2;
