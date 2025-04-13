import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import tw from "twrnc";
import  UserHeader  from './components/UserHeader';
import  JobCard  from './components/JobCard';
import { images } from '@/assets/images';
import { pendingShiftsJobCardData } from '@/assets/data/Data';
import { JobCardProps } from '../(tabs)/types';



const HomePendingShifts: React.FC = () => {
  const [data, setData] = useState<JobCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(pendingShiftsJobCardData); // Using imported JSON data
      setLoading(false);
    }, 1000);
  }, []);
  
  return (
    <View style={tw`flex-1 flex-col overflow-hidden flex-col px-4 pt-10 pb-6 mx-auto w-full bg-zinc-100 max-w-[480px] items-center text-center`}>
     <UserHeader 
      avatarUrl={images.avatarverified}
      username="Jacob Construction"
      />

      <View style={tw`flex mt-5 w-full`}>
            <View style={tw`flex flex-row items-start gap-2.5 w-64 max-w-full rounded-none w-full`}>
            
                    <TouchableOpacity >
                    <Text style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose`}>Posted Shifts</Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity>
                    <Text style={tw`grow text-stone-900 text-base font-extrabold tracking-tight leading-loose`}>Shifts Taken</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                    <Text style={tw`grow shrink text-green-700  text-base font-extrabold tracking-tight leading-loose underline`}>Pending Shifts</Text>
                    </TouchableOpacity>
            </View>
        
        <View style={tw`flex flex-col mt-3 w-full`}>
        
   <SafeAreaView style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}>

  {loading  ? (
  <ActivityIndicator style={tw`mt-[50%]`} size="large" color="blue" />
) : (
  <FlatList style={tw`w-full`}
    data={data}
    keyExtractor={(item) => item.jobId}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => {}}>
        <JobCard 
  jobId = {item.jobId}
  date = {item.date}
  time = {item.time}
  location = {item.location}
  position = {item.position}
  hourlyRate = {item.hourlyRate}
  hours = {item.hours}
  totalAmount = {item.totalAmount}
  backgroundImage = {item.backgroundImage}
  />
      </TouchableOpacity>
    )}
  />
)}
  
  </SafeAreaView>

        </View>
      </View>

   
      
    </View>
  );
};

export default HomePendingShifts;