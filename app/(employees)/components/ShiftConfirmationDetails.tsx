import * as React from "react";
import { View, Text } from "react-native";
import { ShiftConfirmationDetailsProps } from "./types";
import tw from "twrnc";
import moment from "moment";

export const ShiftConfirmationDetails: React.FC<
  ShiftConfirmationDetailsProps
> = ({ company, date }) => {
  return (
    <View style={tw`mt-10 text-xs tracking-tight text-center text-zinc-500`}>
      <Text style={tw`text-xs tracking-tight text-center text-zinc-500`}>
        <Text style={tw`text-black font-bold`}>{company}</Text> is expecting you
        to report on{" "}
        <Text style={tw`text-black font-bold`}>
          {moment(date).format("dddd, Do MMMM")}
        </Text>{" "}
        at{" "}
        <Text style={tw`text-black font-bold`}>
          {moment(date).format("hh:mm A")}
        </Text>
        .
      </Text>
    </View>
  );
};

export default ShiftConfirmationDetails;