import * as React from "react";
import { View, Image, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { RequiredItemsListProp, RequiredItemsProps } from "../(tabs)/types";
import { useState } from "react";

import tw from "twrnc";
import { images } from "@/assets/images";


export const RequiredItems: React.FC<RequiredItemsListProp> = ({
  requiredItems,
  }) => {
  return (
    <ScrollView horizontal={true}>
    <View style={tw`flex-1 flex-row gap-3.5 rounded-none max-w-[363px] mr-8 mt-2`}>
      {requiredItems.map((item, index) => (
        <CardItem key={index} imageUrl={item.imageUrl} title = {item.title} subtitle={item.subtitle} description={item.description} isRequired={item.isRequired} isSelectable={item.isSelectable}/>
      ))}
    </View>
    </ScrollView>
  );
}


const CardItem: React.FC<RequiredItemsProps> = ({ imageUrl, title, subtitle, description, isRequired, isSelectable }) => {

    const [ isSelected, setIsSelected] = useState(false);
    const [ isModalOpen, setIsModalOpen] = useState(false);

    const radioIcon = isSelected ?
    images.radiochecked :
    images.radiounchecked;

    const borderColor = isRequired ?
    "border-zinc-300" :
    "border-rose-600";


  return (
    
    <View style={tw`flex flex-col px-2.5 items-center pt-px mt-1 pb-8 w-[112px] h-[152px] rounded-xl border ${borderColor} border-solid`}>
        <TouchableOpacity onPress={() => setIsSelected(!isSelected) }>
        {isSelectable ? <Image
        source={radioIcon}
        style={tw`self-end absolute mt-4 right-3`}
        /> : <View></View>}
        <Image
        source={imageUrl}
        style={tw`w-[97px] h-[97px]`}
        />
        <Text style={tw`font-semibold text-sm text-center`}>{title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsModalOpen(true)}>
        <Text style={tw`flex text-center text-zinc-500 underline`}>{subtitle}</Text>
        </TouchableOpacity>


{/* Modalcomponent */}
<Modal 
        visible={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)}
        animationType='fade'
        presentationStyle='pageSheet'
        transparent={true}
      >
        <View style={tw`flex flex-col self-center rounded-xl max-w-[322px] mt-50 border border-rose-300`}>
          <View style={tw`flex flex-col items-center px-8 py-5 w-full bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.25)]`}>
          <TouchableOpacity 
      onPress={() => setIsModalOpen(false) }
      style={tw`self-end w-3.5 aspect-[1.08]`}
      >
            <Image
              source={images.closeicon}
              style={tw`object-contain self-end w-3.5 aspect-[1.08]`}
              accessibilityLabel="Close modal"
            />
            </TouchableOpacity>
            
            <Image
          accessibilityLabel={title}
          source={ imageUrl }
          style={tw`object-contain self-center mt-4 max-w-full aspect-square w-[167px] h-[167px]`}
        />
        <View style={tw`self-center mt-7`}>
          <Text style={tw`text-xl font-extrabold tracking-tight leading-none text-zinc-800`}>{title}</Text>
        </View>
        <View style={tw`self-start mt-7 mb-7`}>
          <Text style={tw`text-sm font-semibold tracking-tight text-center text-zinc-600`}>{description}</Text>
        </View>
            
            
          </View>
      </View>
    </Modal>



    </View>
    
  );
}