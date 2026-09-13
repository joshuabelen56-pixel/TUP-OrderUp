import React from "react";
import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
        contentStyle: {
          backgroundColor: "#F5F5F5",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users" />
      <Stack.Screen name="database" />
      <Stack.Screen name="security" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}