import { images } from '@/assets/images';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { ActionButton } from '../components/ActionButton';
import { useLocalSearchParams } from 'expo-router';

const UserImageApproved: React.FC = () => {

  const {  userImage, description  } = useLocalSearchParams<{userImage: string, description: string }>();
  const { id } = useLocalSearchParams<{id: string}>();
  const [approved, setApproval] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(true);

       
    


  return (
    <View style={tw`flex-1 pt-10 bg-gray-100 p-1 items-center`}>

      {/* Header */}
      <Text style={tw`self-start text-2xl font-bold text-stone-900`}>User Image</Text>

<ScrollView contentContainerStyle={tw`items-center`}>
      {/* Description */}
      <Text style={tw`text-gray-600 mt-5 mb-7`}>
        {description}
      </Text>

      {/* User Image */}
    
      <Image
        source={images.userimage} // Replace with actual image URL
        style={tw`object-contain h-[341px] mb-15`}
      />
      
      {/* Action Buttons */}
{showActionButtons ? 
      //Not approved buttons
      <View style={tw`flex justify-around`}>
         <ActionButton 
         onPress={() => {
          setApproval(true);
          setShowActionButtons(false);
        }}
         className='w-[327px]'
         isEnabled = {true}
         label='Approve'
         />
         <ActionButton 
         onPress={() => {
          setApproval(false);
          setShowActionButtons(false);
        }}
         className='bg-red-500 mt-2 w-[327px] mb-9'
         isEnabled = {true}
         label='Disapprove'
         />
        </View> :

      //Approval status
      <View style={tw`flex justify-around`}>
          <View style = {tw`flex flex-col self-start px-16 py-4 mt-1 w-full rounded-xl max-w-[327px] items-center w-[300px] bg-stone-300`}>
          {approved ?
              <Text style={tw`text-xl font-semibold tracking-tight text-center text-zinc-400`}>
                Approved
              </Text> :
              <Text style={tw`text-xl font-semibold tracking-tight text-center text-zinc-400`}>
              Disapproved
            </Text>
}
    
    </View>
        </View> 
        
        


}
      

      {/* Footer */}
      <Image 
      source={images.logowithoutcaption} 
      style={tw`absolute bottom-0 left-0`}
     />

      {/* Footer */}
      <View style={tw`mt-35 mb-5 flex items-center`}>
       <Image source={images.logowithcaption} />
      </View>
      </ScrollView>

    </View>
  );
};

export default UserImageApproved;
