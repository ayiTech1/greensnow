import * as React from "react";
import { View, Text } from "react-native";
import { ConfirmShiftTimerProps } from "./types";
import tw from "twrnc";
import moment from "moment";

export const ConfirmShiftTimer: React.FC<ConfirmShiftTimerProps> = ({
  shiftDate,
}) => {
  const start = moment(); // Exact current datetime
  const end = moment(shiftDate);

  const duration = moment.duration(end.diff(start));
  const hours = Math.floor(duration.asHours()); // Get total hours
  const minutes = duration.minutes(); // Get remaining minutes
  return (
    <View>
      <View style={tw`mt-8 text-lg font-bold tracking-tight text-center`}>
        <Text style={tw`text-lg font-bold tracking-tight text-center`}>
          {hours} hours {minutes} minutes
        </Text>
      </View>
    </View>
  );
};


export default ConfirmShiftTimer