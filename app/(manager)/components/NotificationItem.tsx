import React from 'react';
import { View, Text, Image } from 'react-native';
import type { NotificationDetailsProps } from '../(tabs)/types';

import tw from "twrnc";
import { images } from '@/assets/images';

const NotificationItem: React.FC<NotificationDetailsProps> = ({ title , message, iconUrl }) => {
  return (
    <View style={tw`flex flex-col justify-center items-center py-1.5 mt-2 text-2xl tracking-tighter rounded-xl bg-zinc-300 max-w-[356px] text-zinc-800`}>
      <View style={tw`flex flex-row justify-between items-center w-full`}>
        <Image
            source={ iconUrl }
            style={tw`object-contain shrink-0 self-stretch my-auto ml-3 mr-3 aspect-square absolute top-2.5`}
        />
        <View style={tw`self-stretch px-1 py-0.5 my-auto min-w-[240px] w-[260px] ml-10`}>
            <Text style={tw`text-xl text-start self-stretch tracking-tighter rounded-xl text-zinc-800 items-center`}>
            {title}
            </Text>
            <Text style={tw`text-xs text-start self-stretch tracking-tighter rounded-xl text-zinc-800`}>
            {message}
            </Text>
        </View>
        <Image
            source={ images.arrowright }
            style={tw`object-contain shrink-0 self-stretch my-auto w-5 aspect-square mr-3`}
        />
      </View>
    </View>
  );
};

export default NotificationItem;