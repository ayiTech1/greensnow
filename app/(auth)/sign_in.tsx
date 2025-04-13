import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { images } from '@/assets/images';
import InputField from '@/components/auth/InputField';
import PrimaryButton from '@/components/auth/PrimaryButton';
import { login } from '@/services/auth_service';

const AuthenticationLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignInWithGoogle = () => {
    Alert.alert('Google Sign-In', 'Google sign-in feature is not implemented yet.');
  };

  const handleSignInWithApple = () => {
    Alert.alert('Apple Sign-In', 'Apple sign-in feature is not implemented yet.');
  };

  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await login({ email, password });
      router.push({
        pathname: '/sign_in_otp_method',
        params: { sessionId: response.sessionId, email },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-zinc-100 px-4 py-6`}>
      <Text style={tw`text-2xl text-center font-bold mt-5`}>Sign In</Text>
      <Text style={tw`text-center mx-14 mb-4`}>
        Enter your credentials to have access to your account.
      </Text>

      <InputField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <PrimaryButton
        title={loading ? 'Logging In...' : 'Login'}
        onPress={handleLogin}
        isPrimary={true}
        disabled={loading}
        testID="login-button"
      />

      <View style={tw`flex-row items-center my-4`}>
        <View style={tw`flex-1 border-t border-gray-400`} />
        <Text style={tw`mx-4 text-sm text-center`}>Or</Text>
        <View style={tw`flex-1 border-t border-gray-400`} />
      </View>

      <TouchableOpacity
        style={tw`flex-row items-center border border-gray-500 p-4 rounded-lg mb-2 justify-center`}
        onPress={handleSignInWithGoogle}
      >
        <Text style={tw`text-black text-lg mr-2`}>Continue With Google</Text>
        <Image source={images.googleIcon} style={tw`w-6 h-6 ml-2`} />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center border border-gray-500 p-4 rounded-lg mb-2 justify-center`}
        onPress={handleSignInWithApple}
      >
        <Text style={tw`text-black text-lg mr-2`}>Continue With Apple</Text>
        <Image source={images.appleIcon} style={tw`w-6 h-6 ml-2`} />
      </TouchableOpacity>

      <Text style={tw`text-sm text-center mt-2`}>
        By signing in you agree to our{' '}
        <Text style={tw`text-[#068A2D]`}>Terms and Privacy Policy</Text>
      </Text>
      <Text style={tw`text-sm text-center mt-2`}>
        Having Issues? <Text style={tw`text-[#068A2D]`}>Contact Us</Text>
      </Text>
    </View>
  );
};

export default AuthenticationLogin;