// InputField.tsx
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import tw from 'twrnc';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad' | 'ascii-capable' | 'numbers-and-punctuation' | 'name-phone-pad' | 'visible-password';
  errorMessage?: string;
  accessibilityLabel?: string;
  style?: any; // This will allow passing custom styles, including width
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  errorMessage,
  accessibilityLabel,
  style, // Accept style prop
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Dynamically change the border color based on focus and error state
  const borderColor = isFocused
    ? 'black' // Focused state
    : errorMessage
    ? 'red' // Error state
    : 'gray'; // Default state

  return (
    <View style={tw`mb-3`}>
      <Text style={tw`text-lg mb-2`}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={[tw`border p-4 rounded-lg text-base`, { borderColor }, style]} // Ensure style is applied here
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel}
      />
      {errorMessage && <Text style={tw`text-red-500 text-sm mt-1`}>{errorMessage}</Text>}
    </View>
  );
};

export default InputField;
