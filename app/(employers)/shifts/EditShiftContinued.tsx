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
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";
import { ActionButton } from "./components/ActionButton";
import { images } from "@/assets/images";
import { router } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { createShift } from "@/services/api_test";
import DateTimePicker from "react-native-modal-datetime-picker";
// import { ShiftSearchParams } from './types';

type CreateShiftScreenProps = {};

interface itemListProps {
  item: string;
  addItem: (item: string) => void;
  requirements: any;
}

type ShiftSearchParams = {
  id: string;
  employer_id: string;
  company_name: string;
  shiftType: string;
  date: string;
  time: string;
  endTime: string;
  hourlyRate: string;
  numberOfHours: string;
  numberOfOpenings: string;
  description: string;
  location: string;
  background_image_url: string;
  requirement_items: string;
  disallowed_items: string;
  rank_id: string;
  rate_id: string;
  status: string;
  created_at: string;
};

const CreateShiftContinuedScreen: React.FC<CreateShiftScreenProps> = () => {
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

  const {
    id,
    employer_id,
    company_name,
    shiftType,
    date,
    time,
    endTime,
    hourlyRate,
    numberOfHours,
    numberOfOpenings,
    description,
    location,
    requirement_items,
    disallowed_items,
    background_image_url,
    created_at,
    rank_id,
    rate_id,
    status,
  } = useLocalSearchParams<ShiftSearchParams>();

  const [shiftlocation, setLocation] = useState<string>(location);
  const [shiftDescription, setDescription] = useState<string>(description);
  const [itemsRequired, setRequiredItems] = useState<string[]>(
    JSON.parse(requirement_items)
  );
  const [itemsNotAllowed, setNotAllowedItems] = useState<string[]>(
    JSON.parse(disallowed_items)
  );

  //Functions for adding and removing required Items
  const addRequiredItems = (item: string) => {
    const newItem = item;
    if (itemsRequired.includes(newItem)) {
      setRequiredItems(itemsRequired.filter((i) => i !== newItem));
    } else {
      setRequiredItems([...itemsRequired, newItem]);
    }
  };
  const addNotAllowedItems = (item: string) => {
    const newItem = item;
    if (itemsNotAllowed.includes(newItem)) {
      setNotAllowedItems(itemsNotAllowed.filter((i) => i !== newItem));
    } else {
      setNotAllowedItems([...itemsNotAllowed, newItem]);
    }
  };

  return (
    <View style={tw`flex-1 p-1 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Edit Shift Details</Text>
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
          value={shiftlocation}
          onChangeText={setLocation}
          placeholder="Enter location"
        />

        {/* Description Input */}
        <Text style={tw`text-lg font-medium mb-2`}>Description Details</Text>
        <TextInput
          style={tw`border rounded-lg bg-white p-4 mb-4 h-32`}
          value={shiftDescription}
          onChangeText={setDescription}
          // placeholder="Enter description"
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
            requirements={requirement_items}
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
            requirements={disallowed_items}
            addItem={addNotAllowedItems}
          />
        ))}

        {/* Proceed Button */}
        <ActionButton
          className="mt-1"
          onPress={() => {
            router.push({
              pathname: "/shifts/EditShiftDetailsPreview",
              params: {
                id: id,
                employer_id: employer_id,
                company_name: company_name,
                shiftType: shiftType,
                date: date,
                time: time,
                endTime: endTime,
                hourlyRate: hourlyRate,
                numberOfHours: numberOfHours,
                numberOfOpenings: numberOfOpenings,
                location: shiftlocation,
                description: shiftDescription,
                background_image_url: background_image_url,
                required_items: JSON.stringify(itemsRequired),
                not_allowed_items: JSON.stringify(itemsNotAllowed),
                rank_id: rank_id,
                rate_id: rate_id,
                status: status,
                created_at: created_at,
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

const ItemsList: React.FC<itemListProps> = ({
  item,
  requirements,
  addItem,
}) => {
  const [isSelected, setIsSelected] = useState(requirements.includes(item));
  const radioIcon = isSelected ? images.radiochecked : images.radiounchecked;
  // if (isSelected) addItem(item);
  // else removeItem(item);
  return (
    <TouchableOpacity
      onPress={() => {
        setIsSelected(!isSelected);
        addItem(item);
      }}
    >
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`flex-1`}>{item}</Text>
        <Image source={radioIcon} />
      </View>
    </TouchableOpacity>
  );
};

export default CreateShiftContinuedScreen;
