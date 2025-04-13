import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import tw from "twrnc";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { itemListProps } from "./types";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
// import { ShiftSearchParams } from './types';

type ShiftSearchParams = {
  shiftType: string;
  date: string;
  time: string;
  endTime: string;
  hourlyRate: string;
  numberOfHours: string;
  numberOfOpenings: string;
};

const CreateShiftContinuedScreen: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [itemsRequired, setRequiredItems] = useState<string[]>([]);
  const [itemsNotAllowed, setNotAllowedItems] = useState<string[]>([]);

  const requiredItems = [
    {
      item: "Worker Boots",
    },
    {
      item: "Goggles",
    },
    {
      item: "Gloves",
    },
    {
      item: "Helmet",
    },
    {
      item: "Working Permit",
    },
    {
      item: "Coat",
    },
  ];

  const notAllowedItems = [
    {
      item: "Mobile Phone",
    },
    {
      item: "Headset",
    },
    {
      item: "Headphones",
    },
    {
      item: "Airpods",
    },
    {
      item: "Gaming console",
    },
  ];

  //handle search params
  const {
    shiftType,
    date,
    time,
    endTime,
    hourlyRate,
    numberOfHours,
    numberOfOpenings,
  } = useLocalSearchParams<ShiftSearchParams>();

  //Functions for adding and removing required Items
  const addRequiredItems = (item: string) => {
    const newItem = item;
    setRequiredItems([...itemsRequired, newItem]);
  };
  const addNotAllowedItems = (item: string) => {
    const newItem = item;
    setNotAllowedItems([...itemsNotAllowed, newItem]);
  };

  const removeRequiredItem = (item: string) => {
    setRequiredItems(itemsRequired.filter((i) => i !== item));
  };

  const removeNotAllowedItem = (item: string) => {
    setNotAllowedItems(itemsNotAllowed.filter((i) => i !== item));
  };

  return (
    <View style={tw`flex-1 p-1 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Create A New Shift</Text>
      <Text style={tw`text-gray-500 mb-6`}>
        Discover millions of gigs and get in touch with gig hirers as seamless
        as it comes
      </Text>
      <ScrollView
        contentContainerStyle={tw`p-2`}
        showsVerticalScrollIndicator={false}
      >
        {/* Location Input */}
        <Text style={tw`text-lg font-medium mb-2`}>Location</Text>
        <TextInput
          style={tw`border rounded-lg bg-white p-4 mb-4`}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        {/* Description Input */}
        <Text style={tw`text-lg font-medium mb-2`}>Description Details</Text>
        <TextInput
          style={tw`border rounded-lg bg-white p-4 mb-4 h-32`}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        {/* Required Items List */}
        <Text style={tw`text-lg font-medium mb-2`}>
          Required Items At Shift
        </Text>
        {requiredItems.map((item, index) => (
          <ItemsList
            key={index}
            item={item.item}
            addItem={addRequiredItems}
            removeItem={removeRequiredItem}
          />
        ))}

        {/* Items Not Allowed List */}
        <Text style={tw`text-lg font-medium mt-4 mb-2`}>
          Items Not Allowed At Shift
        </Text>
        {notAllowedItems.map((item, index) => (
          <ItemsList
            key={index}
            item={item.item}
            addItem={addNotAllowedItems}
            removeItem={removeNotAllowedItem}
          />
        ))}

        {/* Proceed Button */}
        <ActionButton
          buttonStyle="mt-1"
          onPress={() => {
            // Form Validation
            if (!location) {
              Alert.alert("Error", "Please enter a location.");
              return;
            }
            if (!description) {
              Alert.alert("Error", "Please enter a description.");
              return;
            }
            router.push({
              pathname: "./CreateShiftDetailsPreview",
              params: {
                shiftType: shiftType,
                date: date,
                time: time,
                endTime: endTime,
                hourlyRate: hourlyRate,
                numberOfHours: numberOfHours,
                numberOfOpenings: numberOfOpenings,
                location: location,
                description: description,
                requiredItems: JSON.stringify(itemsRequired),
                notAllowedItems: JSON.stringify(itemsNotAllowed),
              },
            });
          }}
          label="Proceed"
          isEnabled={true}
        />

        <Image
          source={images.logowithoutcaption}
          style={tw`absolute bottom-0 left-0`}
        />

        {/* Footer */}
        <View style={tw`mt-20 flex items-center`}>
          <Image source={images.logowithcaption} />
        </View>
      </ScrollView>
    </View>
  );
};

const ItemsList: React.FC<itemListProps> = ({ item, addItem, removeItem }) => {
  const [isSelected, setIsSelected] = useState(false);
  const radioIcon = isSelected ? images.radiochecked : images.radiounchecked;
  return (
    <View style={tw`flex-row items-center mb-2`}>
      <TouchableOpacity
        onPress={() => {
          setIsSelected(!isSelected);
          if (isSelected) removeItem(item);
          else addItem(item);
        }}
        style={tw`flex-row items-center mb-2`}
      >
        <Text style={tw`flex-1`}>{item}</Text>
        <Image source={radioIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default CreateShiftContinuedScreen;
