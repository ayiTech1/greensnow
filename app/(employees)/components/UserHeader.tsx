import React from "react";
import { View, Image, Text } from "react-native";
import { ProfileProps } from "./types";
import { StatItemProps } from "../types";
import tw from "twrnc";
import { images } from "../../../assets/images";

export const UserHeader: React.FC<ProfileProps> = ({
  avatarUrl,
  username,
  ratings,
  assurance,
}) => {
  const stats = [
    { iconUrl: images.star, count: ratings },
    { iconUrl: images.rating, count: assurance },
  ];

  return (
    <View style={tw`flex flex-col text-center max-w-[362px]`}>
      <View
        style={tw`flex flex-row gap-10 items-start w-full text-xs tracking-tight whitespace-nowrap text-zinc-500`}
      >
        <View style={tw`flex flex-row flex-1 gap-0.5`}>
          <View style={tw`flex flex-row`}>
            <Image
              source={avatarUrl}
              style={tw`object-contain shrink-0 aspect-square w-[50px]`}
            />
            <Image
              source={images.reddot}
              style={tw`shrink-0 aspect-square w-[15px] h-[15px] absolute right-0.5 top-0`}
            />
          </View>
          <View style={tw`flex flex-col self-start mt-3`}>
            {stats.map((stat, index) => (
              <StatItem key={index} icon={stat.iconUrl} count={stat.count} />
            ))}
          </View>
        </View>

        {/* <LanguageSwitcher  currentLanguage='EN' icon={require("../../../assets/images/flag-france.png")}/>  */}
      </View>
      <View style={tw`self-start text-2xl font-bold text-stone-900`}>
        <Text style={tw`self-start text-2xl font-bold text-stone-900`}>
          Hello, {username}
        </Text>
      </View>
    </View>
  );
};

const StatItem: React.FC<StatItemProps> = ({ icon, count }) => {
  return (
    <View style={tw`flex flex-row gap-0.5 items-center w-full`}>
      <Image
        source={icon}
        style={tw`object-contain shrink-0 self-stretch my-auto w-3 aspect-square`}
      />
      <View style={tw`self-stretch my-auto`}>
        <Text>{count}</Text>
      </View>
    </View>
  );
};

export default UserHeader;
