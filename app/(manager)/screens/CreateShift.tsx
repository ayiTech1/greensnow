import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "twrnc";
import { ActionButton } from "./components/ActionButton";
import { router } from "expo-router";
import moment from "moment";

type CreateShiftScreenProps = {};

const CreateShiftScreen: React.FC<CreateShiftScreenProps> = () => {
  const [shiftType, setShiftType] = useState<string>("General Labor");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [numberOfHours, setNumberOfHours] = useState<string>("6");
  const [numberOfOpenings, setNumberOfOpenings] = useState<string>("2");

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <View style={tw`flex-1 bg-zinc-100 p-1 -full`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Create A New Shift</Text>
      <Text style={tw`text-gray-500 mb-6`}>
        Discover millions of gigs and get in touch with gig hirers as seamless
        as it comes
      </Text>

      <ScrollView
        contentContainerStyle={tw`p-2.5`}
        showsVerticalScrollIndicator={false}
      >
        {/* Shift Type Picker */}
        <Text style={tw`text-lg font-medium mb-2`}>Shift Type</Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={shiftType}
            onValueChange={(itemValue) => setShiftType(itemValue)}
          >
            <Picker.Item label="General Labor" value="General Labor" />
            <Picker.Item label="Snow Shoveling" value="Snow Shoveling" />
            <Picker.Item label="Office Work" value="Office Work" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Date Picker */}
        <Text style={tw`text-lg font-medium mb-2`}>Date</Text>
        <TouchableOpacity
          style={tw`border rounded-lg bg-white p-4 mb-4`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker */}
        <Text style={tw`text-lg font-medium mb-2`}>Starting Time</Text>
        <TouchableOpacity
          style={tw`border rounded-lg bg-white p-4 mb-4`}
          onPress={() => setShowTimePicker(true)}
        >
          <Text>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {/* Hourly Rate Input */}
        <Text style={tw`text-lg font-medium mb-2`}>Hourly Rate ($)</Text>
        <TextInput
          style={tw`border rounded-lg bg-white p-4 mb-4`}
          keyboardType="numeric"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          placeholder="Enter hourly rate"
        />

        {/* Number of Hours Picker */}
        <Text style={tw`text-lg font-medium mb-2`}>Number Of Hours</Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={numberOfHours}
            onValueChange={(itemValue) => setNumberOfHours(itemValue)}
          >
            {[...Array(12).keys()].map((hour) => (
              <Picker.Item
                label={`${hour + 1}`}
                value={`${hour + 1}`}
                key={hour}
              />
            ))}
          </Picker>
        </View>

        {/* Number of Openings Picker */}
        <Text style={tw`text-lg font-medium mb-2`}>Number Of Openings</Text>
        <View style={tw`border rounded-lg bg-white mb-6`}>
          <Picker
            selectedValue={numberOfOpenings}
            onValueChange={(itemValue) => setNumberOfOpenings(itemValue)}
          >
            {[...Array(10).keys()].map((opening) => (
              <Picker.Item
                label={`${opening + 1}`}
                value={`${opening + 1}`}
                key={opening}
              />
            ))}
          </Picker>
        </View>

        {/* Proceed Button */}
        <ActionButton
          buttonStyle="mt-1"
          onPress={() => {
            // Form Validation

            if (
              !hourlyRate ||
              isNaN(Number(hourlyRate)) ||
              Number(hourlyRate) <= 0
            ) {
              Alert.alert("Error", "Please enter a valid hourly rate.");
              return;
            }
            // calculate end time for shift
            const endTime = new Date(time);
            endTime.setHours(endTime.getHours() + +numberOfHours);

            router.push({
              pathname: "./CreateShiftContinued",
              params: {
                shiftType,
                date: date.toString(),
                time: time.toString(),
                endTime: endTime.toString(),
                hourlyRate,
                numberOfHours,
                numberOfOpenings,
              },
            });
          }}
          label="Proceed"
          isEnabled={true}
        />
      </ScrollView>
    </View>
  );
};

export default CreateShiftScreen;
