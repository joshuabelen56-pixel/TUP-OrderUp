import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

type AdminTab =
  | "overview"
  | "users"
  | "database"
  | "security"
  | "settings";

interface AdminBottomNavProps {
  active: AdminTab;
}

const COLORS = {
  cardinal: "#8F1029",
  gold: "#D8B56A",

  lightBackground: "#FFFFFF",
  lightBorder: "#E7E8EC",
  lightText: "#8A8E98",
  lightActiveBg: "#F9EDF0",

  darkBackground: "#181A1F",
  darkBorder: "#2A2D34",
  darkText: "#969BA5",
  darkActiveBg: "#32151D",
};

const TABS = [
  {
    key: "overview" as AdminTab,
    label: "Overview",
    icon: "grid-outline" as keyof typeof Ionicons.glyphMap,
    activeIcon: "grid" as keyof typeof Ionicons.glyphMap,
    route: "/admin/dashboard",
  },
  {
    key: "users" as AdminTab,
    label: "Users",
    icon: "people-outline" as keyof typeof Ionicons.glyphMap,
    activeIcon: "people" as keyof typeof Ionicons.glyphMap,
    route: "/admin/users",
  },
  {
    key: "database" as AdminTab,
    label: "Database",
    icon: "server-outline" as keyof typeof Ionicons.glyphMap,
    activeIcon: "server" as keyof typeof Ionicons.glyphMap,
    route: "/admin/database",
  },
  {
    key: "security" as AdminTab,
    label: "Security",
    icon: "shield-checkmark-outline" as keyof typeof Ionicons.glyphMap,
    activeIcon: "shield-checkmark" as keyof typeof Ionicons.glyphMap,
    route: "/admin/security",
  },
  {
    key: "settings" as AdminTab,
    label: "Settings",
    icon: "settings-outline" as keyof typeof Ionicons.glyphMap,
    activeIcon: "settings" as keyof typeof Ionicons.glyphMap,
    route: "/admin/settings",
  },
];

export default function AdminBottomNav({
  active,
}: AdminBottomNavProps) {
  const { darkMode } = useTheme();

  const backgroundColor = darkMode
    ? COLORS.darkBackground
    : COLORS.lightBackground;

  const borderColor = darkMode
    ? COLORS.darkBorder
    : COLORS.lightBorder;

  const inactiveColor = darkMode
    ? COLORS.darkText
    : COLORS.lightText;

  const activeBackground = darkMode
    ? COLORS.darkActiveBg
    : COLORS.lightActiveBg;

  const handleNavigation = (
    route: string,
    key: AdminTab
  ) => {
    if (key === active) {
      return;
    }

    router.replace(route as any);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor,
          borderTopColor: borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.topAccent,
          {
            backgroundColor: darkMode
              ? COLORS.gold
              : COLORS.cardinal,
          },
        ]}
      />

      <View style={styles.nav}>
        {TABS.map((tab) => {
          const isActive = active === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() =>
                handleNavigation(tab.route, tab.key)
              }
            >
              <View
                style={[
                  styles.iconBox,
                  isActive && {
                    backgroundColor: activeBackground,
                  },
                ]}
              >
                <Ionicons
                  name={
                    isActive
                      ? tab.activeIcon
                      : tab.icon
                  }
                  size={21}
                  color={
                    isActive
                      ? COLORS.cardinal
                      : inactiveColor
                  }
                />
              </View>

              <Text
                style={[
                  styles.label,
                  {
                    color: isActive
                      ? COLORS.cardinal
                      : inactiveColor,
                  },
                  isActive && styles.activeLabel,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>

              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    {
                      backgroundColor: darkMode
                        ? COLORS.gold
                        : COLORS.cardinal,
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    height: Platform.OS === "ios" ? 88 : 76,

    borderTopWidth: 1,

    zIndex: 9999,
    elevation: 18,

    shadowOffset: {
      width: 0,
      height: -3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowColor: "#000",
  },

  topAccent: {
    position: "absolute",

    top: 0,

    left: width * 0.34,
    right: width * 0.34,

    height: 2,

    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  nav: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 7,
    paddingTop: 4,

    paddingBottom:
      Platform.OS === "ios" ? 9 : 4,
  },

  tab: {
    flex: 1,

    height: 68,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",

    borderRadius: 14,
  },

  iconBox: {
    width: 42,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,

    marginBottom: 2,
  },

  label: {
    fontSize: 10,

    fontWeight: "600",

    letterSpacing: 0.1,

    textAlign: "center",

    includeFontPadding: false,

    maxWidth: 72,
  },

  activeLabel: {
    fontWeight: "800",
  },

  activeIndicator: {
    position: "absolute",

    bottom: 0,

    width: 24,
    height: 3,

    borderRadius: 4,
  },
});