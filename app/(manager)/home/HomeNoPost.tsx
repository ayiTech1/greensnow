import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

import tw from "twrnc";
import UserHeader  from "../components/UserHeader";
import { images } from "@/assets/images";
import { Link } from "expo-router";

const HomeNoPosts: React.FC = () => {
  return (
    <View style={tw`flex-1 overflow-hidden flex-col items-center w-full pt-15 text-center bg-zinc-100 max-w-[480px]`}>
      
          <Image
            source={images.clipboard}
            style = {tw`object-contain max-w-full aspect-[1.03] w-[237px] h-[231px]`}
          />
          <View style = {tw`mt-16 text-2xl font-extrabold tracking-tighter text-stone-900 w-full`}>
            <Text style = {tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}>
              You have not{'\n'}posted a shift yet.
            </Text>
          </View>
          <View style = {tw`mt-4 w-[232px]`}>
        <Text style = {tw`text-xs text-center tracking-tight text-zinc-500`}>
        No appointment shifts have been made by you yet.
        </Text>
      </View>
        
            <View style = {tw`mt-5 text-xs font-bold tracking-tight text-stone-900`} className="mt-5 text-xs font-bold tracking-tight text-stone-900">
                <Text style={tw`text-xs font-bold tracking-tight text-zinc-500`}>You can try <Link href={"/screens/CreateShift"} style={tw`text-stone-900 underline`}>creating a shift</Link></Text>
            </View>
        
    
      
    </View>
  );
};

export default HomeNoPosts;
