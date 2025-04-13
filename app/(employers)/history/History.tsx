import React from "react";
import { View, Image, Text, ScrollView } from "react-native";

import tw from "twrnc"
import  UserHeader  from "./components/UserHeader";
import  JobCard  from "./components/JobCard";
import { images } from "@/assets/images";

const History: React.FC = () => {
  return (
    
    <View style={tw`flex-1 flex-col overflow-hidden flex-col items-center pt-10 px-3.5 mx-auto w-full bg-zinc-100 max-w-[480px]`}>
       <UserHeader 
      avatarUrl={images.avatarverified}
      username="Jacob Construction"
      />
      <View style={tw`flex flex-row gap-5 justify-between w-full text-center max-w-[362px] text-stone-900`}>
        <View style={tw`flex flex-col items-start`}>
         
          <View style={tw`self-stretch mt-4 text-xl font-extrabold tracking-tight leading-none`}>
            <Text style={tw`text-xl font-extrabold tracking-tight leading-none`}>Previous shifts</Text>
          </View>
        </View>
      </View>

      {/* Shift card goes here */}
    <View style={tw`flex-1 mt-5 mb-20 w-full`}>
              <ScrollView contentContainerStyle={tw``}>
      <JobCard 
        date = "Tue, 10th Dec"
        time = "12:00 AM"
        location = "Calgary, AB"
        employee = "Evanela Aba Forson"
        position = "General Labor"
        hourlyRate = {17.50}
        hours = {8}
        totalAmount = {140.00}
        backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/5d39e68ac8e6f65c8f0802b579ba00d28ef135baad94913e4bf910ed7bc5a4b4?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
        />

<JobCard 
        date = "Tue, 10th Dec"
        time = "12:00 AM"
        location = "Calgary, AB - 8.2km"
        employee = "Evanela Aba Forson"
        position = "General Labor"
        hourlyRate = {17.50}
        hours = {8}
        totalAmount = {140.00}
        backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/5d39e68ac8e6f65c8f0802b579ba00d28ef135baad94913e4bf910ed7bc5a4b4?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
        />
<JobCard 
        date = "Tue, 10th Dec"
        time = "12:00 AM"
        location = "Calgary, AB - 8.2km"
        employee = "Evanela Aba Forson"
        position = "General Labor"
        hourlyRate = {17.50}
        hours = {8}
        totalAmount = {140.00}
        backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/5d39e68ac8e6f65c8f0802b579ba00d28ef135baad94913e4bf910ed7bc5a4b4?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
        />
<JobCard 
        date = "Tue, 10th Dec"
        time = "12:00 AM"
        location = "Calgary, AB - 8.2km"
        employee = "Evanela Aba Forson"
        position = "General Labor"
        hourlyRate = {17.50}
        hours = {8}
        totalAmount = {140.00}
        backgroundImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/5d39e68ac8e6f65c8f0802b579ba00d28ef135baad94913e4bf910ed7bc5a4b4?placeholderIfAbsent=true&apiKey=40e5f984174e460295df60a5034c4fb5"
        />

</ScrollView>
    </View>
      
      {/* navigation goes here */}
    </View>
 
  );
};

export default History;
