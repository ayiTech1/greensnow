import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  LogBox,
  ActivityIndicator,
  FlatList,
} from "react-native";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";
import { images } from "@/assets/images";
import { ActionButton } from "../components/ActionButton";
import {
  DisplayPersonalInfoProps,
  EmployerDetailsDisplayProps,
  UserDataProps,
  UserProps,
} from "./types";
import { router, useLocalSearchParams } from "expo-router";
import { UserData } from "@/assets/data/Data";
import { fetchUser } from "@/services/api_test";

const UserApproved = () => {
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  const [user, setUser] = useState<UserProps>();
  const [filteredData, setFilteredData] = useState<
    EmployerDetailsDisplayProps[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    loadUserData(user_id);
  }, []);

  const loadUserData = async (user: string) => {
    try {
      const data = await fetchUser(user);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View
        style={tw`flex-1 overflow-hidden flex-col items-center mx-auto w-full bg-zinc-100 max-w-[480px]`}
      >
        <ActivityIndicator style={tw`mt-[90%]`} size="large" color="green" />
      </View>
    );

  return (
    <View style={tw`flex px-4 py-2 bg-gray-100`}>
      {/* Header */}

      <Text style={tw`self-start text-2xl font-bold text-stone-900`}>
        Personal Info
      </Text>

      <ScrollView style={tw`flex w-full`}>
        {/* Flatlist Begins */}

        <View style={tw`flex`}>
          <Text
            style={tw`text-zinc-600 tracking-tight text-sm text-neutral-500 mt-5`}
          >
            Discover millions of gigs and get in touch with gig hirers as
            seamless as it comes. Discover millions of gigs and get in touch
            with gig hirers as seamless as it comes. Discover millions of gigs
            and get in touch w
          </Text>

          {/* Menu Section */}
          <View style={tw`pt-4`}>
            {[
              {
                name: (user?.first_name ?? "") + " " + (user?.last_name ?? ""),
                label: "Name",
                icon: images.contactmuted,
              },
              { name: user?.email, label: "Email", icon: images.emailmuted },
              { name: user?.phone, label: "Phone", icon: images.phonemuted },
              {
                name: user?.home_address,
                label: "Home Address",
                icon: images.homeaddressmuted,
              },
              {
                name: user?.date_of_birth,
                label: "Date Of Birth",
                icon: images.dobmuted,
              },
              {
                name: user?.language,
                label: "Language",
                icon: images.languagemuted,
              },
            ].map((item, index) => (
              <DisplayPersonalInfo key={index} item={item} />
            ))}
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/IdentityVerification",
                params: {
                  // imageStatus : item.imageStatus,
                  // IDCardStatus: item.IDCardStatus,
                  // PassportStatus: item.PassportStatus,
                  // otherCertificateStatus: item.otherCertificateStatus,
                  // userImage: item.urlToImage,
                  // description: item.description
                },
              })
            }
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-start`}>
              <View
                style={tw`flex w-[18px] h-[18px] items-center justify-center mt-1`}
              >
                <Image source={images.identityverificationmuted} />
                {user?.identity_verification === "Pending" && (
                  <Image
                    source={images.reddot}
                    style={tw`absolute top-0 right-0`}
                  />
                )}
              </View>
              <View style={tw`flex flex-col`}>
                <Text style={tw`text-base text-gray-500 font-bold`}>
                  Identity Verification
                </Text>
                <Text style={tw`text-base text-stone-900`}>
                  {user?.identity_verification}
                </Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={tw`flex-row items-center justify-between py-2`}
          >
            <View style={tw`flex flex-row gap-3 items-start`}>
              <View
                style={tw`flex w-[18px] h-[18px] items-center justify-center mt-1`}
              >
                <Image source={images.backgroundcheckmuted} />
                {user?.background_check === "Pending" && (
                  <Image
                    source={images.reddot}
                    style={tw`absolute top-0 right-0`}
                  />
                )}
              </View>
              <View style={tw`flex flex-col`}>
                <Text style={tw`text-base text-gray-500 font-bold`}>
                  Background Check
                </Text>
                <Text style={tw`text-base text-stone-900`}>
                  {user?.background_check}
                </Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={16} color="gray" />
          </TouchableOpacity>

          {/* Footer */}
          <View style={tw`mt-35 mb-5 flex items-center`}>
            <Image source={images.logowithcaption} />
          </View>

          {/* Watermark logo */}
          <Image
            source={images.logowithoutcaption}
            style={tw`absolute bottom-0 left-0`}
          />
        </View>

        {/* description */}
      </ScrollView>
    </View>
  );
};

const DisplayPersonalInfo: React.FC<DisplayPersonalInfoProps> = ({ item }) => {
  return (
    <View style={tw`flex-row items-center justify-between py-2`}>
      <View style={tw`flex flex-row gap-3 items-start`}>
        <Image source={item.icon} style={tw`mt-2`} />
        <View style={tw`flex flex-col`}>
          <Text style={tw`text-sm text-gray-500 font-bold`}>{item.label}</Text>
          <Text style={tw`text-sm text-gray-500`}>{item.name}</Text>
        </View>
      </View>
      <FontAwesome name="chevron-right" size={16} color="gray" />
    </View>
  );
};

export default UserApproved;
