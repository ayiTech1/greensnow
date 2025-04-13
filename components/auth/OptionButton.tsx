// OptionButton.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

interface OptionButtonProps {
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={tw`border border-gray-500 p-4 rounded-lg mx-4 mb-4 flex-row items-center`}
      onPress={onPress}
    >
      <Text style={tw`flex-1 text-gray text-center`}>{text}</Text>
      <View style={tw`ml-2`}>{icon}</View>
    </TouchableOpacity>
  );
};

export default OptionButton;
