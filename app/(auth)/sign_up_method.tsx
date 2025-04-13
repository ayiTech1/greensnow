import React from 'react';
import { View, Text, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useRegistration } from '@/context/registration';
import { images } from '@/assets/images';
import tw from 'twrnc';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { socialAuth } from '@/services/auth_service';

WebBrowser.maybeCompleteAuthSession();

const SignUpSocial = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId as string;
  const { setSocialData } = useRegistration();
  const [isLoading, setIsLoading] = React.useState(false);

  // 👇 Replace with your actual Google OAuth client IDs (from Google Cloud Console)
  const [request, response, promptAsync] = Google.useAuthRequest({
    // clientId: 'YOUR_EXPO_CLIENT_ID', // For development (Expo Go)
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // iOS production
    androidClientId: '720250000285-3fg17o53fat0rqi11u5vdnb8up18kl83.apps.googleusercontent.com', // Android production
    // webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Optional (for server-side validation)
  });

  // 👇 Get Google ID Token (for backend validation)
  const getGoogleToken = async () => {
    const result = await promptAsync();
    if (result?.type === 'success') {
      return result.authentication?.idToken; // Send ID token (not access token) to backend
    }
    return null;
  };

  // 👇 Apple Sign-In (unchanged)
  const getAppleToken = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      return credential.identityToken;
    } catch (e) {
      return null;
    }
  };

  // 👇 Handle Google/Apple Auth
  const handleSocialAuth = async (signup_method: 'google' | 'apple' | 'app') => {
    setIsLoading(true);
    try {
      let token = '';

      if (signup_method === 'google') {
        const googleToken = await getGoogleToken();
        if (!googleToken) throw new Error('Google authentication failed');
        token = googleToken;
      } else if (signup_method === 'apple') {
        const appleToken = await getAppleToken();
        if (!appleToken) throw new Error('Apple authentication failed');
        token = appleToken;
      } else if (signup_method === 'app') {
        const response = await socialAuth({ signup_method, token: '', sessionId });
        setSocialData(response);
        router.push({ pathname: '/sign_up_form1', params: { sessionId } });
        return;
      }

      // Send token to backend
      const response = await socialAuth({ signup_method, token, sessionId });
      setSocialData(response);
      router.push({ pathname: '/sign_up_form1', params: { sessionId } });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 p-6 justify-center`}>
      <Text style={tw`text-2xl font-bold text-center mb-4`}>Sign Up</Text>
      <Text style={tw`text-gray-600 text-center mb-8 mx-15`}>
        Enter details below to create an account with{" "}
        <Text style={tw`text-gray-700 font-bold`}>Green Snow</Text>
      </Text>

      <TouchableOpacity
        style={tw`flex-row items-center border border-gray-500 p-4 rounded-lg mb-3 justify-center`}
        onPress={() => handleSocialAuth('google')}
        disabled={isLoading}
      >
        <Text style={tw`text-black text-lg mr-2`}>Continue With Google</Text>
        <Image
          source={images.googleIcon}
          style={tw`w-6 h-6 ml-2`}
          accessibilityLabel="Sign up with Google"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center border border-gray-500 p-4 rounded-lg mb-3 justify-center`}
        onPress={() => handleSocialAuth('apple')}
        disabled={isLoading}
      >
        <Text style={tw`text-black text-lg mr-2`}>Continue With Apple</Text>
        <Image
          source={images.appleIcon}
          style={tw`w-6 h-6 ml-2`}
          accessibilityLabel="Sign up with Apple"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-[#068A2D] p-4 rounded-lg mt-3`}
        onPress={() => handleSocialAuth('app')}
        disabled={isLoading}
      >
        <Text style={tw`text-white text-lg text-center`}>
          {isLoading ? 'Loading...' : 'Continue With App'}
        </Text>
      </TouchableOpacity>

      <Text style={tw`text-sm text-center mt-6`}>
        By signing in you agree to our{" "}
        <Text
          style={tw`text-[#068A2D]`}
          onPress={() => Linking.openURL('https://www.example.com/terms')}
        >
          Terms and Privacy Policy
        </Text>
      </Text>

      <View style={tw`absolute bottom-0 left-0 right-0 items-center pb-6`}>
        <Image source={images.Log} style={tw`w-[82px] h-[57px]`} />
      </View>
    </View>
  );
};

export default SignUpSocial;