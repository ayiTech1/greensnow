import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import tw from "twrnc";
import { RatingsMeterProps } from "./types";

const RatingsMeter: React.FC<RatingsMeterProps> = ({ rating }) => {
  const [count, setCount] = useState<number>(rating);


  const data = Array.from({ length: count }, (_, index) => ({
    id: index.toString(),
    value: `Item ${index + 1}`,
  }));

  return (
    <View>
      
      <FlatList
        data={data}
        horizontal={true}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View >
            <View style={tw`flex items-center mt-0.5`}>
                  <FontAwesome name="star" size={20} color="green" />
                  
                </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  item: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
});

export default RatingsMeter;
