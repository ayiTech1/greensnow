import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView, ScrollView, LogBox } from 'react-native';
import tw from "twrnc";
import  UserHeader  from './components/UserHeader';
import  JobCard  from './components/JobCard';
import { images } from '@/assets/images';
import HomeNoPost from './HomeNoPost';
import HomeNoneShiftsTaken from './HomeShiftsTaken';
import { router } from 'expo-router';
import { postedShiftsJobCardData, TakenShiftsjobCardData, pendingShiftsJobCardData } from '@/assets/data/Data';
import { JobCardProps } from '../(tabs)/types';


 // Shift Tabs State


const HomePostedShifts: React.FC = () => {

  const [tab, setTab] = useState("posted");
  const [postedShiftsData, setPostedShiftsData] = useState<JobCardProps[]>([]);
  const [shiftsTakenData, setShiftsTakenData] = useState<JobCardProps[]>([]);
  const [pendingShiftsData, setPendingShiftsData] = useState<JobCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    setTimeout(() => {
      setPostedShiftsData(postedShiftsJobCardData); // Using imported JSON data
      setShiftsTakenData(TakenShiftsjobCardData); // Using imported JSON data
      setPendingShiftsData(pendingShiftsJobCardData); // Using imported JSON data
      setLoading(false);
    }, 1000);
  }, []);
  

      return (
        <View style={tw`flex-1 flex-col overflow-hidden flex-col px-1 pt-1 pb-6 mx-auto w-full bg-zinc-100 max-w-[480px] items-center text-center`}>
    
          <View style={tw`flex mt-5 w-full`}>
                <View style={tw`flex flex-row items-start gap-2.5 w-64 max-w-full rounded-none w-full`}>
                
                        <TouchableOpacity onPress={() => setTab("posted")}>
                        <Text style={tw`grow text-base text-stone-900 font-extrabold tracking-tight leading-loose ${tab=="posted" ? `text-green-700 underline` : ``} `}>Posted Shifts</Text>
                        </TouchableOpacity>
                
                        <TouchableOpacity onPress={() => setTab("taken")}>
                        <Text style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose ${tab=="taken" ? `text-green-700 underline` : ``}`}>Shifts Taken</Text>
                        </TouchableOpacity>
    
                        <TouchableOpacity onPress={() => setTab("pending")}>
                        <Text style={tw`grow shrink text-stone-900 text-base font-extrabold tracking-tight leading-loose ${tab=="pending" ? `text-green-700 underline` : ``}`}>Pending Shifts</Text>
                        </TouchableOpacity>
                </View>

                <ScrollView>

                { tab == "posted" ? 
        <SafeAreaView style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}>
        
        {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <SafeAreaView style={tw`w-full`}>
        <FlatList
          data={postedShiftsData}
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
        </SafeAreaView>
      )}
        
        
        </SafeAreaView>
 : tab == "taken" ? 


<SafeAreaView style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}>
        
{loading ? (
<ActivityIndicator size="large" color="blue" />
) : (
<SafeAreaView style={tw`w-full`}>
<FlatList
  data={shiftsTakenData}
  keyExtractor={(item) => item.jobId}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => {}}>
      <JobCard 
jobId = {item.jobId}
date = {item.date}
time = {item.time}
location = {item.location}
position = {item.position}
employee={item.employee}
hourlyRate = {item.hourlyRate}
hours = {item.hours}
totalAmount = {item.totalAmount}
backgroundImage = {item.backgroundImage}
/>
    </TouchableOpacity>
  )}
/>
</SafeAreaView>
)}


</SafeAreaView> : 

<SafeAreaView style={tw`flex-1 flex-col overflow-hidden w-full items-center text-center`}>
        
{loading ? (
<ActivityIndicator size="large" color="blue" />
) : (
<SafeAreaView style={tw`w-full`}>
<FlatList
  data={pendingShiftsData}
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
</SafeAreaView>
)}


</SafeAreaView>

}

        
        </ScrollView>

                
            
                  </View>
    
       
          
        </View>
      );
  
  
};


export default HomePostedShifts;