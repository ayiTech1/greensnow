import * as React from "react";
import { View, Image, Text } from "react-native";
import { ShiftDetailsJobCardProps } from "./types";
import tw from "twrnc";
import { images } from "@/assets/images";

// interface JobCardProps {
//   backgroundImage: string;
//   companyName: string;
//   jobTitle: string;
// }

const ShiftDetailsJobCard: React.FC<ShiftDetailsJobCardProps> = ({
  backgroundImage,
  companyName,
  jobTitle,
}) => {
  return (
    <View style={tw`flex flex-col max-w-[364px] w-full`}>
      <View style={tw`flex relative flex-col items-start px-3 pt-14 pb-5 w-full aspect-[2.912] overflow-hidden`}>
        <Image
          source={{ uri: backgroundImage }}
          style={tw`object-cover absolute inset-0 size-full w-[364px] h-[125px]`}
        />

        <View style={tw`flex flex-row relative flex-col max-w-full w-[184px]`}>

          <View style={tw`flex flex-row gap-2 items-center w-full`}>
            <Image
              source={images.client}
              style={tw`object-contain shrink-0 self-stretch my-auto w-4 aspect-square`}
            />
            <View style={tw`self-stretch my-auto`}>
              <Text style={tw`text-sm tracking-tight leading-6 font-semibold text-center text-white`}>{companyName}</Text>
            </View>
          </View>

<View style={tw`flex flex-row gap-2 items-center w-full`}>
<Image
  source={images.position}
  style={tw`object-contain shrink-0 self-stretch my-auto w-4 aspect-square`}
/>
<View style={tw`self-stretch my-auto`}>
  <Text style={tw`text-xl tracking-tight leading-none font-semibold text-center text-white`}>{jobTitle}</Text>
</View>
</View>

        </View>
      </View>
    </View>
  );
};

export default ShiftDetailsJobCard;
