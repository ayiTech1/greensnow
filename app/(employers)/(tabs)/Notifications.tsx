import React, { useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import NotificationsAvailable from "../notifications/NotificationsAvailable";
import { NoNotifications } from "../notifications/NoNotifications";
import { useFocusEffect } from "expo-router";

const Notifications: React.FC = () => {
  const [seconds, setSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const [view, setView] = useState("empty");

  useFocusEffect(() => {
    const onBackPress = () => true; // Returning true disables going back
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  });

  useEffect(() => {
    if (seconds > 4) {
      setView("empty");
    } else {
      setView("available");
    }

    let timer2: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      timer2 = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer2);
  }, [isRunning, seconds]);

  switch (view) {
    case "empty":
      return <NoNotifications />;
    case "available":
      return <NotificationsAvailable />;
    default:
      return <View />;
  }
};

export default Notifications;
