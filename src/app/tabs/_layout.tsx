import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#C41E3A";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#999999",

        tabBarStyle: {
          height: 72,
          paddingTop: 7,
          paddingBottom: 8,

          backgroundColor: "#FFFFFF",

          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",

          elevation: 10,

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      {/* ========================================= */}
      {/* HOME */}
      {/* ========================================= */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "home"
                  : "home-outline"
              }
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* ========================================= */}
      {/* MENU */}
      {/* ========================================= */}

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "restaurant"
                  : "restaurant-outline"
              }
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* ========================================= */}
      {/* FAVORITES */}
      {/* ========================================= */}

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "heart"
                  : "heart-outline"
              }
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* ========================================= */}
      {/* ORDERS */}
      {/* ========================================= */}

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "receipt"
                  : "receipt-outline"
              }
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* ========================================= */}
      {/* SETTINGS */}
      {/* ========================================= */}

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "settings"
                  : "settings-outline"
              }
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

