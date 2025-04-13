import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { registerRole } from '@/services/auth';

const SignUpTypeScreen = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'EMPLOYER' | 'EMPLOYEE' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      Alert.alert("Selection Required", "Please select an account type!");
      return;
    }

    setLoading(true);
    try {
      console.log('Registering role:', selectedRole);
      router.push({
  pathname: '/sign_up_method',
  params: { role: selectedRole },
});

    } catch (error: any) {
      console.error('Failed to register role:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      Alert.alert("Error", "Failed to register role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1  bg-zinc-100 p-6 justify-between`}>
      <View>
        <Text style={tw`text-3xl font-bold text-center mt-30`}>Sign Up</Text>
        <Text style={tw`text-center text-gray-500 mx-15`}>
          What kind of account do you want with{" "}
          <Text style={tw`text-[#068A2D]`}>Green Snow</Text>?
        </Text>
      </View>
      <View style={tw`flex-col mb-5`}>
        <TouchableOpacity
          style={[styles.option, selectedRole === "EMPLOYER" && styles.selectedOption]}
          onPress={() => setSelectedRole("EMPLOYER")}
        >
          <View style={tw`flex-row items-center`}>
            <View
              style={[styles.radioCircle, selectedRole === "EMPLOYER" && styles.selectedRadioCircle]}
            />
            <Text style={[
              tw`text-lg ml-4`,
              selectedRole === "EMPLOYER" ? tw`text-[#068A2D]` : tw`text-gray-500`,
            ]}>
              Employer
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, selectedRole === "EMPLOYEE" && styles.selectedOption]}
          onPress={() => setSelectedRole("EMPLOYEE")}
        >
          <View style={tw`flex-row items-center`}>
            <View
              style={[styles.radioCircle, selectedRole === "EMPLOYEE" && styles.selectedRadioCircle]}
            />
            <Text style={[
              tw`text-lg ml-4`,
              selectedRole === "EMPLOYEE" ? tw`text-[#068A2D]` : tw`text-gray-500`,
            ]}>
              Job Seeker
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[tw`bg-[#068A2D] p-4 rounded-lg`, !selectedRole && tw`opacity-50`]}
        onPress={handleContinue}
        disabled={!selectedRole || loading}
      >
        <Text style={tw`text-white text-lg text-center font-bold`}>
          {loading ? 'Processing...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: "#068A2D",
  },
  radioCircle: {
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  selectedRadioCircle: {
    backgroundColor: "#068A2D",
    borderColor: "#068A2D",
  },
});

export default SignUpTypeScreen;