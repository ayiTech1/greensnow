import * as React from "react";
import { View, Text } from "react-native";
import { EmployeeDetailsDisplayProps } from "../types";
import tw from "twrnc";
import { Link } from "expo-router";

export const EmployeeDetailsDisplay: React.FC<EmployeeDetailsDisplayProps> = ({ name }) => {
  return (
    <View style={tw`flex flex-col items-start text-xs mt-3 tracking-tight mt-4 rounded-none max-w-[359px]`}>
     
        <Text style={tw`font-semibold leading-6 text-neutral-400 text-xs tracking-tight`}>Picked up By</Text>
        
        <View style={tw`flex flex-row gap-5 w-full mt-1`}>
        <Text style={tw`text-zinc-600 tracking-tight text-xs text-neutral-500`}>{name}</Text>
        <Text style={tw`text-zinc-600 tracking-tight text-xs text-green-700 underline absolute right-1`}><Link href={"/shifts/ShiftPickerProfile"}>View Profile</Link></Text>
        </View>
     
    </View>
  );
};