import React from "react";

import { Stack } from "expo-router";

import {
  SafeAreaProvider,
} from "react-native-safe-area-context";

import {
  ThemeProvider,
} from "../context/ThemeContext";

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="register"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="tabs"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}