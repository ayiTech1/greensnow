import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";
import uuid from "react-native-uuid";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { router, useLocalSearchParams } from "expo-router";
import { createShiftRanking } from "@/services/api_test";

type RateCompletedShiftScreenProps = {};

const RateCompletedShiftScreen: React.FC<
  RateCompletedShiftScreenProps
> = () => {
  const [onTime, setOnTime] = useState<string>("Yes");
  const [conduct, setConduct] = useState<string>("Excellent");
  const [workAgain, setWorkAgain] = useState<string>("Yes");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [completionRating, setCompletionRating] = useState<string>("5");
  const [feedback, setFeedback] = useState<any[]>([]);

  const [isRateCompletedModal, setIsRateCompletedModal] = useState(false);

  const { id } = useLocalSearchParams<{
    id: string;
    employee_id: string;
  }>();

  // Replace with actual authentication token if needed
  const authToken = "your_token_here";

  const handleCreateShiftRanking = async () => {
    const rankId = uuid.v4(); // Generate a new UUID for user

    // Create feedback object directly
    const feedbackData = [
      {
        onTime: onTime,
        conduct: conduct,
        workAgain: workAgain,
        additionalInfo: additionalInfo,
      },
    ];

    console.log("Creating shift with rank id:", rankId);
    console.log("handleCreateShiftRanking -> feedback", feedbackData);

    try {
      const newShiftRank = {
        id: rankId,
        shift_id: id,
        rating: completionRating,
        feedback: feedbackData, // Use directly instead of setFeedback
        created_at: new Date(),
        updated_at: new Date(),
        employer: "92453a49-e948-4e0a-804c-7dd58995b216", //supply user id here
      };

      const response = await createShiftRanking(newShiftRank, authToken);

      Alert.alert("Success", "Ranking created successfully!");
      setIsRateCompletedModal(true);
      console.log(response);
    } catch (error: any) {
      if (error.response) {
        console.error("Error Data:", error.response.data);
        Alert.alert("Error", JSON.stringify(error.response.data));
      } else {
        console.error("Error:", error.message);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  return (
    <View style={tw`flex-1 p-1 bg-gray-100 w-full max-w-[480px] items-center`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Rate Completed Shift</Text>
      <Text style={tw`text-gray-500 mb-6`}>
        Discover millions of gigs and get in touch with gig hirers as seamless
        as it comes
      </Text>
      <ScrollView contentContainerStyle={tw`w-full`}>
        {/* Did The Picker Get On Time? */}
        <Text style={tw`text-lg font-medium mb-2`}>
          Did The Picker Get On Time?
        </Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={onTime}
            onValueChange={(itemValue) => setOnTime(itemValue)}
          >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>

        {/* How Was The Conduct? */}
        <Text style={tw`text-lg font-medium mb-2`}>How Was The Conduct?</Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={conduct}
            onValueChange={(itemValue) => setConduct(itemValue)}
          >
            <Picker.Item label="Excellent" value="Excellent" />
            <Picker.Item label="Good" value="Good" />
            <Picker.Item label="Average" value="Average" />
            <Picker.Item label="Poor" value="Poor" />
          </Picker>
        </View>

        {/* Would You Like To Work With Picker Again? */}
        <Text style={tw`text-lg font-medium mb-2`}>
          Would You Like To Work With Picker Again?
        </Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={workAgain}
            onValueChange={(itemValue) => setWorkAgain(itemValue)}
          >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>

        {/* Any Additional Info? */}
        <Text style={tw`text-lg font-medium mb-2`}>Any Additional Info?</Text>
        <TextInput
          style={tw`border rounded-lg bg-white p-4 mb-4`}
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          placeholder="Enter Additional Info"
        />

        {/* Rate Gig Completion (1-10) */}
        <Text style={tw`text-lg font-medium mb-2`}>
          Rate Gig Completion (1-10)
        </Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={completionRating}
            onValueChange={(itemValue) => setCompletionRating(itemValue)}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
              <Picker.Item
                key={rating}
                label={rating.toString()}
                value={rating.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* Proceed Button */}
        <View style={tw`self-center`}>
          <ActionButton
            className="mt-1"
            onPress={() => handleCreateShiftRanking()}
            label="Proceed"
            isEnabled={true}
          />
        </View>

        <Image
          source={images.logowithoutcaption}
          style={tw`absolute bottom-0 left-0`}
        />

        {/* Footer */}
        <View style={tw`mt-20 flex items-center`}>
          <Image source={images.logowithcaption} />
        </View>
      </ScrollView>

      {/* Rating Completed modal -----------------------------------------------*/}
      <Modal
        visible={isRateCompletedModal}
        onRequestClose={() => setIsRateCompletedModal(false)}
        animationType="fade"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View
          style={tw`flex flex-col self-center rounded-none max-w-[322px] mt-auto mb-auto`}
        >
          <View
            style={tw`flex flex-col items-center px-8 py-5 w-[322px] bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}
          >
            <TouchableOpacity
              onPress={() => {
                setIsRateCompletedModal(false);
                router.push("/");
              }}
              style={tw`self-end w-3.5 aspect-[1.08]`}
            >
              <Image
                source={images.closeicon}
                style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
                accessibilityLabel="Close modal"
              />
            </TouchableOpacity>

            <View
              style={tw`mt-16 text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
            >
              <Text
                style={tw`text-xl font-extrabold tracking-tight leading-6 text-zinc-800`}
              >
                Rating Completed
              </Text>
            </View>

            <View
              style={tw`self-center mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Rating details would be sent to {"\n"}management to access shift
                and {"\n"}improve your experience.{"\n"}Thank you!
              </Text>
            </View>

            <View
              style={tw`self-center mt-7 text-sm tracking-tight text-center`}
            >
              <Text
                style={tw`text-sm tracking-tight text-center text-zinc-600`}
              >
                Good job!
              </Text>
            </View>

            <View style={tw`self-center`}>
              <ActionButton
                label="Continue"
                isEnabled={true}
                onPress={() => {
                  setIsRateCompletedModal(false);
                  router.push("/");
                }}
                className="py-2.5 mt-30 rounded-md w-[193px] px-1"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RateCompletedShiftScreen;
