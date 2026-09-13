import React, {
  useEffect,
  useRef,
} from "react";

import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  useTheme,
} from "../../context/ThemeContext";

/* =========================================================
   TUP-ORDERUP COLORS
========================================================= */

const CARDINAL = "#7D1021";
const CARDINAL_LIGHT = "#FBECEF";
const GOLD = "#D8B56A";

const WHITE = "#FFFFFF";
const DARK_BACKGROUND = "#101010";
const DARK_BAR = "#171717";

const INACTIVE_LIGHT = "#92969C";
const INACTIVE_DARK = "#777777";

const BORDER_LIGHT = "#E8E9EB";
const BORDER_DARK = "#2B2B2B";

/* =========================================================
   MAIN TABS
========================================================= */

export default function TabsLayout() {
  /* =======================================================
     GLOBAL THEME
  ======================================================= */

  const {
    darkMode,
  } = useTheme();

  /* =======================================================
     DYNAMIC TAB COLORS
  ======================================================= */

  const tabBarBackground = darkMode
    ? DARK_BAR
    : WHITE;

  const tabBarBorder = darkMode
    ? BORDER_DARK
    : BORDER_LIGHT;

  const inactiveColor = darkMode
    ? INACTIVE_DARK
    : INACTIVE_LIGHT;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        /* =================================================
           REMOVE DEFAULT ANDROID RIPPLE
        ================================================= */

        tabBarButton: ({
          accessibilityLabel,
          accessibilityRole,
          accessibilityState,
          children,
          onLongPress,
          onPress,
          style,
          testID,
        }) => (
          <Pressable
            accessibilityLabel={
              accessibilityLabel
            }
            accessibilityRole={
              accessibilityRole
            }
            accessibilityState={
              accessibilityState
            }
            onLongPress={
              onLongPress
            }
            onPress={onPress}
            style={style}
            testID={testID}
            android_ripple={null}
          >
            {children}
          </Pressable>
        ),

        /* =================================================
           LABELS
        ================================================= */

        tabBarShowLabel: true,

        /* =================================================
           TAB COLORS
        ================================================= */

        tabBarActiveTintColor:
          CARDINAL,

        tabBarInactiveTintColor:
          inactiveColor,

        /* =================================================
           BOTTOM BAR
        ================================================= */

        tabBarStyle: {
          height: 74,

          backgroundColor:
            tabBarBackground,

          borderTopWidth: 1,

          borderTopColor:
            tabBarBorder,

          paddingTop: 5,

          paddingBottom: 7,

          paddingHorizontal: 5,

          elevation: darkMode
            ? 0
            : 10,

          shadowColor:
            "#000000",

          shadowOffset: {
            width: 0,
            height: -3,
          },

          shadowOpacity:
            darkMode
              ? 0
              : 0.055,

          shadowRadius: 8,
        },

        /* =================================================
           LABEL
        ================================================= */

        tabBarLabelStyle: {
          fontSize: 9,

          fontWeight: "700",

          marginTop: 2,
        },

        /* =================================================
           TAB ITEM
        ================================================= */

        tabBarItemStyle: {
          flex: 1,

          paddingVertical: 2,

          marginHorizontal: 2,
        },
      }}
    >
      {/* =====================================================
          HOME
      ===================================================== */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({
            focused,
          }) => (
            <AnimatedTabIcon
              focused={focused}
              darkMode={darkMode}
              activeIcon="home"
              inactiveIcon="home-outline"
            />
          ),
        }}
      />

      {/* =====================================================
          MENU
      ===================================================== */}

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",

          tabBarIcon: ({
            focused,
          }) => (
            <AnimatedTabIcon
              focused={focused}
              darkMode={darkMode}
              activeIcon="restaurant"
              inactiveIcon="restaurant-outline"
            />
          ),
        }}
      />

      {/* =====================================================
          FAVORITES
      ===================================================== */}

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",

          tabBarIcon: ({
            focused,
          }) => (
            <AnimatedTabIcon
              focused={focused}
              darkMode={darkMode}
              activeIcon="heart"
              inactiveIcon="heart-outline"
            />
          ),
        }}
      />

      {/* =====================================================
          ORDERS
      ===================================================== */}

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",

          tabBarIcon: ({
            focused,
          }) => (
            <AnimatedTabIcon
              focused={focused}
              darkMode={darkMode}
              activeIcon="receipt"
              inactiveIcon="receipt-outline"
            />
          ),
        }}
      />

      {/* =====================================================
          SETTINGS
      ===================================================== */}

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",

          tabBarIcon: ({
            focused,
          }) => (
            <AnimatedTabIcon
              focused={focused}
              darkMode={darkMode}
              activeIcon="settings"
              inactiveIcon="settings-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* =========================================================
   ANIMATED TAB ICON
========================================================= */

type AnimatedTabIconProps = {
  focused: boolean;

  darkMode: boolean;

  activeIcon:
    | keyof typeof Ionicons.glyphMap;

  inactiveIcon:
    | keyof typeof Ionicons.glyphMap;
};

function AnimatedTabIcon({
  focused,
  darkMode,
  activeIcon,
  inactiveIcon,
}: AnimatedTabIconProps) {
  /* =======================================================
     SCALE
  ======================================================= */

  const scale = useRef(
    new Animated.Value(
      focused ? 1 : 0.92
    )
  ).current;

  /* =======================================================
     OPACITY
  ======================================================= */

  const opacity = useRef(
    new Animated.Value(
      focused ? 1 : 0.7
    )
  ).current;

  /* =======================================================
     ACTIVE BACKGROUND
  ======================================================= */

  const backgroundOpacity =
    useRef(
      new Animated.Value(
        focused ? 1 : 0
      )
    ).current;

  /* =======================================================
     GOLD INDICATOR
  ======================================================= */

  const indicatorWidth =
    useRef(
      new Animated.Value(
        focused ? 1 : 0
      )
    ).current;

  /* =======================================================
     ANIMATION
  ======================================================= */

  useEffect(() => {
    Animated.parallel([
      /* -----------------------------------------------
         SCALE
      ----------------------------------------------- */

      Animated.spring(scale, {
        toValue: focused
          ? 1
          : 0.92,

        damping: 15,

        stiffness: 190,

        mass: 0.75,

        useNativeDriver: true,
      }),

      /* -----------------------------------------------
         OPACITY
      ----------------------------------------------- */

      Animated.timing(opacity, {
        toValue: focused
          ? 1
          : 0.7,

        duration: 180,

        useNativeDriver: true,
      }),

      /* -----------------------------------------------
         BACKGROUND
      ----------------------------------------------- */

      Animated.timing(
        backgroundOpacity,
        {
          toValue: focused
            ? 1
            : 0,

          duration: 180,

          useNativeDriver: true,
        }
      ),

      /* -----------------------------------------------
         GOLD INDICATOR
      ----------------------------------------------- */

      Animated.spring(
        indicatorWidth,
        {
          toValue: focused
            ? 1
            : 0,

          damping: 14,

          stiffness: 180,

          mass: 0.75,

          useNativeDriver: false,
        }
      ),
    ]).start();
  }, [
    focused,
    scale,
    opacity,
    backgroundOpacity,
    indicatorWidth,
  ]);

  /* =======================================================
     GOLD WIDTH
  ======================================================= */

  const goldWidth =
    indicatorWidth.interpolate({
      inputRange: [0, 1],

      outputRange: [0, 15],
    });

  /* =======================================================
     COLORS
  ======================================================= */

  const iconColor = focused
    ? CARDINAL
    : darkMode
      ? INACTIVE_DARK
      : INACTIVE_LIGHT;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        {
          opacity,

          transform: [
            {
              scale,
            },
          ],
        },
      ]}
    >
      {/* =================================================
          ACTIVE BACKGROUND
      ================================================= */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeBackground,

          {
            opacity:
              backgroundOpacity,

            backgroundColor:
              darkMode
                ? "#2B181D"
                : CARDINAL_LIGHT,
          },
        ]}
      />

      {/* =================================================
          ICON
      ================================================= */}

      <Ionicons
        name={
          focused
            ? activeIcon
            : inactiveIcon
        }
        size={22}
        color={iconColor}
      />

      {/* =================================================
          GOLD INDICATOR
      ================================================= */}

      <Animated.View
        style={[
          styles.goldIndicator,
          {
            width: goldWidth,
          },
        ]}
      />
    </Animated.View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     ICON WRAPPER
  ======================================================= */

  iconWrapper: {
    width: 42,

    height: 32,

    borderRadius: 11,

    alignItems: "center",

    justifyContent: "center",

    position: "relative",

    overflow: "hidden",
  },

  /* =======================================================
     ACTIVE BACKGROUND
  ======================================================= */

  activeBackground: {
    position: "absolute",

    left: 0,

    right: 0,

    top: 0,

    bottom: 0,

    borderRadius: 11,
  },

  /* =======================================================
     GOLD INDICATOR
  ======================================================= */

  goldIndicator: {
    position: "absolute",

    bottom: 1,

    height: 2,

    borderRadius: 2,

    backgroundColor: GOLD,
  },
});