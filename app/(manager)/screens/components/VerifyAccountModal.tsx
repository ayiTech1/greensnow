import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import tw from "twrnc";
import { images } from "@/assets/images";
import { ActionButton } from "./ActionButton";
import { verifyUser } from "@/services/api_test";
import { VerifyAccountModalProps } from "./types";

const VerifyAccountModal: React.FC<VerifyAccountModalProps> = ({
  visible,
  onClose,
  user_id,
  onVerifySuccess,
}) => {
  const [password, setPassword] = useState("");

  const handleVerifyUser = async () => {
    try {
      await verifyUser(user_id);
      onClose();
      onVerifySuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
    >
      <View
        style={tw`bg-white w-11/12 p-6 rounded-xl shadow-lg items-center self-center mt-auto mb-auto`}
      >
        <TouchableOpacity
          onPress={onClose}
          style={tw`self-end w-3.5 aspect-[1.08]`}
        >
          <Image
            source={images.closeicon}
            style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={tw`self-start text-2xl font-bold text-stone-900 mt-6`}>
          Are You Sure You Want To Verify Account?
        </Text>
        {/* Description */}
        <Text style={tw`text-gray-600 text-center mt-5 mb-6`}>
          Account will be able to pick up or{"\n"}create shifts till you suspend
          or remove.{"\n"}
          {"\n"}Enter your password to confirm verification.
        </Text>
        <View style={tw`text-gray-600 self-start mt-3 mb-1`}>
          <Text style={tw`text-gray-600`}>Password</Text>
        </View>

        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-6 w-full`}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        {/* Verify button */}
        <View style={tw``}>
          {password === "1234" ? (
            <ActionButton
              buttonStyle="w-[193px] p-3"
              isEnabled={true}
              label="Verify"
              onPress={() => {
                handleVerifyUser();
              }}
            />
          ) : (
            <ActionButton
              buttonStyle="w-[193px] p-3"
              isEnabled={false}
              label="Verify"
              onPress={() => null}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default VerifyAccountModal;
