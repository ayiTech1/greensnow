import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { EmployeeDetailsDisplayProps } from "./types";
import tw from "twrnc";
import { Link, router } from "expo-router";

export const EmployeeDetailsDisplay: React.FC<EmployeeDetailsDisplayProps> = ({ name,  }) => {
  return (
    <View style={tw`flex flex-col items-start mt-3 tracking-tight mt-4 rounded-none max-w-[359px]`}>
     
        <Text style={tw`font-semibold leading-6 text-neutral-400 text-base tracking-tight`}>Shift Picked By</Text>
        
        <View style={tw`flex flex-row justify-between gap-5 w-full mt-1`}>
        <Text style={tw`text-zinc-600 tracking-tight text-sm text-neutral-500`}>{name}</Text>
        <Pressable onPress={() => router.push({
          pathname: "/screens/UserProfileDetails",
          params: {
            
          }
        })} 
        ><Text style={tw`text-zinc-600 tracking-tight text-sm text-green-700 underline`}>View Profile</Text></Pressable>
        </View>
     
    </View>
  );
};