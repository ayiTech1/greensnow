import React from 'react';
import { View, Image, Text } from 'react-native';
import { ProfileProps } from '../(tabs)/types';
import { StatItemProps } from '../(tabs)/types';
import tw from "twrnc";
import LanguageSwitcher  from './LanguageSwitcher';
import { images } from '@/assets/images';

const stats = [
  { iconUrl: images.star, count: 0 },
  { iconUrl: images.ranking, count: 0 }
];


const UserHeader: React.FC<ProfileProps> = ({ avatarUrl, username }) => {
  return (
    <View style={tw`flex flex-col text-center max-w-[362px]`}>
      <View style={tw`flex flex-row gap-10 items-start w-full text-xs tracking-tight whitespace-nowrap text-zinc-500`}>
        <View style={tw`flex flex-row flex-1 gap-0.5`}>
          <Image
            source={ avatarUrl }
            style={tw`object-contain shrink-0 aspect-square w-[50px]`}
          />
          <View style={tw`flex flex-col self-start mt-3`}>
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                icon={stat.iconUrl}
                count={stat.count}
              />
            ))}
          </View>
        </View>
        {/* <View style={tw`flex shrink-0 bg-white h-[29px] shadow-[0px_2px_4px_rgba(0,0,0,0.25)] w-[66px]`} > */}
            <LanguageSwitcher  currentLanguage='EN' icon={images.flag}/>
      </View>
      <View style={tw`self-start text-2xl font-bold text-stone-900`}>
        <Text style={tw`self-start text-2xl font-bold text-stone-900`}>Hello, {username}</Text>
      </View>
    </View>
  );
};


const StatItem: React.FC<StatItemProps> = ({ icon, count }) => {
  return (
    <View style={tw`flex flex-row gap-0.5 items-center w-full`}>
      <Image
        source={ icon }
        style={tw`object-contain shrink-0 self-stretch my-auto w-3 aspect-square`}
      />
      <View style={tw`self-stretch my-auto`}>
        <Text>{count}</Text>
      </View>
    </View>
  );
};

export default UserHeader;