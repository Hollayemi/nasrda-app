import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Slot />
      </Provider>
    </SafeAreaProvider>
  );
}