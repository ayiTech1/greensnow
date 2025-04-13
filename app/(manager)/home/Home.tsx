import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import  UserHeader  from "./components/UserHeader";
import { images } from "@/assets/images";

const Home: React.FC = () => {
  return (
    <View style={tw`flex-1 overflow-hidden flex-col items-center pt-15 w-full text-center bg-zinc-100 max-w-[480px]`}>

      <Image
        source={images.clipboard}
        style = {tw`object-contain max-w-full aspect-[1.03] w-[237px] h-[231px]`}
      />
      <View style = {tw`mt-16 text-2xl font-extrabold tracking-tighter text-stone-900 w-[251px]`}>
        <Text style = {tw`text-2xl font-extrabold text-center tracking-tighter leading-6 text-stone-900`}>
        You are not verified {'\n'} for posting gigs yet
        </Text>
      </View>
      <View style = {tw`mt-4 w-[232px]`}>
        <Text style = {tw`text-xs text-center tracking-tight text-zinc-500`}>
        finish up your registration to make yourself viable for posting gigs. You have completed <Text style = {tw`font-extrabold text-stone-900`}>20%</Text> of your account setup
        </Text>
      </View>
        <TouchableOpacity onPress={()=>{}}>
            <View style = {tw`mt-5 text-xs font-bold tracking-tight text-stone-900`} className="mt-5 text-xs font-bold tracking-tight text-stone-900">
                <Text style={tw`text-xs font-bold tracking-tight text-stone-900 underline`}>Finish account setup</Text>
            </View>
        </TouchableOpacity>
            
      
    </View>
  );
};

export default Home;