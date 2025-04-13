import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { CalendarBarProps, WeekDayProps } from "./types";
import { DayProps } from "./types";
import tw from "twrnc";

interface DayItem {
  day: string;
  date: number;
  isoDate: string;
  isToday: boolean;
  isPast: boolean;
}

const CalendarBar: React.FC<CalendarBarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday

  // Generate the next 30 days
  const days: DayItem[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0), // First letter of the day
      date: date.getDate(),
      isoDate: date.toISOString().split("T")[0], // Convert to ISO format (YYYY-MM-DD)
      isToday: date.toDateString() === today.toDateString(),
      isPast: date < today && date.toDateString() !== today.toDateString(),
    };
  });

  return (
    <View
      style={tw`flex flex-col text-base font-semibold tracking-tight leading-loose text-center whitespace-nowrap rounded-xl overflow-hidden h-[457px] text-neutral-400`}
    >
      <ScrollView>
        <View
          style={tw`flex flex-col justify-center items-center px-2 py-6 w-full rounded-xl bg-stone-900`}
        >
          <View style={tw`flex flex-col justify-center items-center`}>
            {/* {weekData.days.map((day, index) => (
              <DayItem
                key={index}
                day={day.day}
                date={day.date}
                color={day.color}
              />
            ))} */}
            {days.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  item.isPast ? null : onDateSelect(item.isoDate);
                }}
              >
                <View style={tw`items-center py-1`}>
                  <Text
                    style={tw`${
                      item.isToday
                        ? "text-green-500"
                        : item.isPast
                        ? "text-red-500"
                        : item.isoDate === selectedDate
                        ? "text-blue-500"
                        : "text-gray-400"
                    } text-lg font-bold`}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={tw`${
                      item.isToday
                        ? "text-green-500"
                        : item.isPast
                        ? "text-red-500"
                        : item.isoDate === selectedDate
                        ? "text-blue-500"
                        : "text-gray-400"
                    } text-base`}
                  >
                    {item.date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export const DayItem: React.FC<DayProps> = ({ day, date, color }) => {
  return (
    <View style={tw`flex flex-col mt-2 w-full`}>
      <View>
        <Text
          style={tw`text-base font-semibold tracking-tight text-center whitespace-nowrap rounded-none text-neutral-400 ${
            color ? `text-${color}` : ""
          }`}
        >
          {day}
        </Text>
      </View>
      <View style={tw`self-center`}>
        <Text
          style={tw`text-base font-semibold tracking-tight text-center whitespace-nowrap rounded-none text-neutral-400 ${
            color ? `text-${color}` : ""
          }`}
        >
          {date}
        </Text>
      </View>
    </View>
  );
};

export default CalendarBar;
