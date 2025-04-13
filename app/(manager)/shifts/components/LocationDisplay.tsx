import React from "react";
import MapView from 'react-native-maps';
import { View, Text, Image } from "react-native";
import type { LocationProps } from "../(tabs)/types";
import tw from 'twrnc';

export function LocationDisplay({ address, mapImageUrl }: LocationProps) {
  return (
    <View style = {tw`flex flex-col self-stretch mt-3 w-full text-xs font-semibold tracking-tight leading-6 text-neutral-400`}>
      <View>
        <Text style = {tw`self-stretch mt-3 w-full text-sm font-semibold tracking-tight leading-6 text-neutral-400`}>Location</Text>
      </View>
      
      <MapView style={tw`w-full h-[162px]`}
       showsUserLocation
       showsMyLocationButton
       />
    
      <View>
        <Text style = {tw`self-stretch w-full text-sm font-semibold tracking-tight leading-6 text-neutral-400`}>{address}</Text>
      </View>
    </View>
  );
}
