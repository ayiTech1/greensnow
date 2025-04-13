import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import tw from "twrnc";

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  isPrimary?: boolean; 
  testID?: string; 
  disabled?: boolean;
  style?: any;
  
  
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title,  onPress, isPrimary = true, testID,  disabled }) => {
  return (
    <TouchableOpacity
      style={[
        tw`w-full rounded-lg py-4 justify-center items-center`,
        isPrimary ? styles.primary : styles.secondary,
      ]}
      onPress={onPress}
      testID={testID}
      activeOpacity={0.7}
      
    >
      <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: "#068A2D",
  },
  secondary: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#068A2D",
  },
  primaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryText: {
    color: "#068A2D",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrimaryButton;
