import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { images } from "../../../assets/images";
import { useNavigation } from "@react-navigation/native";
import { LanguageSwitcher } from "./LanguageSwitcher";
import tw from "twrnc";

interface HeaderProps {
  showBackButton?: boolean; // Option to show/hide the back button
  onBackPress?: () => void; // Custom back press handler
  style?: object; // Optional custom styles for the header container
}

export const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  onBackPress,
  style,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress(); // Call custom handler if provided
    } else {
      navigation.goBack(); // Default back navigation
    }
  };

  return (
    <View style = {tw`flex flex-row gap-10 justify-between items-start self-stretch`}>
      {/* Back Button */}
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={tw`p-1`}
          accessibilityRole="button"
          accessibilityLabel="Navigate back"
        >
          <Image
            source={images.backIcon}
            style={styles.icon}
            accessibilityLabel="Back button"
          />
        </TouchableOpacity>
      )}

       <LanguageSwitcher  currentLanguage='EN' icon={require("../../../assets/images/flag-france.png")}/>
    </View>

    
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

export default Header;