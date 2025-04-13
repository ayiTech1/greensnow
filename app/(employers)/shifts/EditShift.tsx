import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import tw from "twrnc";
import { ActionButton } from "./components/ActionButton";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { fetchShift, fetchShifts } from "@/services/api_test";
import { ShiftDetailsPromiseProps, ShiftDetailsProps } from "./types";

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

  const [data, setData] = useState<ShiftDetailsPromiseProps>();
  // const [filteredData, setFilteredData] = useState<ShiftDetailsProps[]>([]);
  const [loading, setLoading] = useState(true);

  type SearchProps = {
    id: string;
    name: string;
    location: string;
    shiftdate: string;
    background_image_url: string;
    company_name: string;
    salary_per_time: string;
    shift_duration: string;
    location_map: string;
    destination: string;
    start_time: string;
    end_time: string;
    requirement_items: string;
    requirement_description: string;
    rank_id: string;
    rate_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    employer: string;
    total_earning: string;
  };

  const { id } = useLocalSearchParams<SearchProps>();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && data) setData({ ...data, date: selectedDate });
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && data) setData({ ...data, start_time: selectedTime });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShift(id);
        setData({
          ...data,
          date: new Date(data.date),
          start_time: new Date(data.start_time),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <View style={tw`flex-1 bg-zinc-100 p-1 -full`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Edit Shift Details</Text>
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
            selectedValue={data?.name}
            onValueChange={(itemValue) =>
              setData({ ...data, name: itemValue } as ShiftDetailsPromiseProps)
            }
          >
            <Picker.Item label="General Labor" value="General Labor" />
            <Picker.Item label="Snow shoveling" value="Snow shoveling" />
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
          <Text>
            {data?.date ? data.date.toLocaleDateString() : "Select a date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={data?.date || new Date()}
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
            {(data?.start_time ?? new Date()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={data?.start_time || new Date()}
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
          value={data?.salary_per_time}
          onChangeText={(itemValue) =>
            setData({
              ...data,
              salary_per_time: itemValue,
            } as ShiftDetailsPromiseProps)
          }
          placeholder="Enter hourly rate"
        />

        {/* Number of Hours Picker */}
        <Text style={tw`text-lg font-medium mb-2`}>Number Of Hours</Text>
        <View style={tw`border rounded-lg bg-white mb-4`}>
          <Picker
            selectedValue={String(data?.shift_duration)}
            onValueChange={(itemValue) =>
              setData({
                ...data,
                shift_duration: itemValue,
              } as ShiftDetailsPromiseProps)
            }
            accessibilityLabel="Number of Hours"
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
          className="mt-1"
          onPress={() => {
            const endTime = new Date(time);
            endTime.setHours(
              endTime.getHours() +
                (data?.shift_duration ? +data.shift_duration : 0)
            );

            router.push({
              pathname: "/shifts/EditShiftContinued",
              params: {
                id: data?.id,
                employer_id: data?.employer,
                company_name: data?.company_name,
                shiftType: data?.name,
                date: data?.date ? data.date.toString() : undefined,
                time: data?.start_time ? data.start_time.toString() : undefined,
                endTime: endTime.toString(),
                hourlyRate: data?.salary_per_time,
                numberOfHours: data?.shift_duration,
                numberOfOpenings: numberOfOpenings,
                description: data?.requirement_description,
                location: data?.location,
                background_image_url: data?.background_image_url,
                requirement_items: JSON.stringify(data?.requirement_items),
                disallowed_items: JSON.stringify(data?.disallowed_items),
                status: data?.status,
                created_at: data?.created_at?.toString(),
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
