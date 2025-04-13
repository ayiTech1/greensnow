import * as React from "react";
import {
  View,
  Image,
  Text,
} from "react-native";

import tw from "twrnc";

export const ShiftDetailsRequired: React.FC = () => {
  return (
    <View style = {tw`flex flex-col mt-3 max-w-full text-xs font-semibold tracking-tight leading-6 whitespace-nowrap rounded-none text-neutral-400 w-[363px]`}>
          <View style = {tw`self-start`}>
            <Text style = {tw`flex text-xs font-semibold tracking-tight leading-6 whitespace-nowrap text-neutral-400 w-[363px]`}>Required</Text>
          </View>
          {/* <Image
            source={require("../../../app/assets/images/required.png")}
           style = {tw`object-contain shrink-0 mt-2 w-[363px] h-[152px] rounded-none aspect-[2.39]`}
          /> */}
        </View>
  );
};

export default ShiftDetailsRequired;