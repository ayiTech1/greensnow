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
import { ActionButton } from "../components/ActionButton";
import { deleteUser } from "@/services/api_test";
import { router } from "expo-router";
import { RemoveAccountModalProps } from "./types";

const RemoveAccountModal: React.FC<RemoveAccountModalProps> = ({
  visible,
  onClose,
  user_id,
}) => {
  const [password, setPassword] = useState("");

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user_id);
      onClose();
      setPassword("");
      router.replace("/");
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
        <Text style={tw`text-center text-2xl font-bold text-stone-900 mt-6`}>
          Are You Sure You Want To Delete Account?
        </Text>

        {/* Description */}
        <Text style={tw`text-gray-600 text-center mt-5`}>
          Account data would be removed from database.{"\n"}Enter your password
          to confirm deletion.
        </Text>

        <View style={tw`text-gray-600 self-start mt-3 mb-1`}>
          <Text style={tw`text-gray-600 mt-5`}>Password</Text>
        </View>

        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-6 w-full`}
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <View style={tw``}>
          {password === "1234" ? (
            <ActionButton
              buttonStyle="w-[193px] p-3 bg-red-500"
              isEnabled={true}
              label="Delete"
              onPress={() => handleDeleteUser()}
            />
          ) : (
            <ActionButton
              buttonStyle="w-[193px] p-3"
              isEnabled={false}
              label="Delete"
              onPress={() => null}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RemoveAccountModal;
