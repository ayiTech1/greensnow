import React from 'react';
import { View, Text, Image } from 'react-native';
import type { NotificationDetailsProps, UserListItemProps } from './types';

import tw from "twrnc";
import { images } from '@/assets/images';
import { StatsCounter } from './StatsCounterUserList';

const EmployersListItem: React.FC<UserListItemProps> = ({ name , ratings, ranking, avatar }) => {
  return (
    <View style={tw`flex flex-col justify-center items-center py-1.5 mt-2 text-2xl tracking-tighter rounded-xl bg-zinc-300 max-w-[356px] w-[340px] text-zinc-800`}>
      <View style={tw`flex flex-row items-center`}>
        <Image
            source={ avatar }
            style={tw`object-contain shrink-0 self-stretch my-auto ml-3 mr-3 aspect-square`}
        />
        <View style={tw`self-stretch px-1 py-0.5 my-auto min-w-[240px] w-[200px]`}>
            <Text style={tw`text-xl text-start self-stretch tracking-tighter rounded-xl text-zinc-800 items-center`}>
            {name}
            </Text>

            <StatsCounter 
            ranking={ranking}
            ratings={ratings}
            />
            
        </View>
        <Image
            source={ images.arrowright }
            style={tw`object-contain shrink-0 self-stretch my-auto w-5 aspect-square mr-3`}
        />
      </View>
    </View>
  );
};

export default EmployersListItem;