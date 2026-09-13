import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

/* =========================================================
   TUP / TUPC COLORS
========================================================= */

const TUP_RED = "#8B1E2D";
const TUP_DARK_RED = "#641522";
const TUP_GOLD = "#C8A96B";

const LIGHT_BG = "#F4F5F7";
const DARK_BG = "#0D1117";

const LIGHT_CARD = "#FFFFFF";
const DARK_CARD = "#161C24";

const LIGHT_TEXT = "#252A34";
const DARK_TEXT = "#FFFFFF";

const LIGHT_MUTED = "#6B7280";
const DARK_MUTED = "#A5ADB8";

const LIGHT_BORDER = "#E1E4E8";
const DARK_BORDER = "#29313C";

/* =========================================================
   ADMIN SETTINGS
========================================================= */

export default function AdminSettings() {
  const { darkMode } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  /* =======================================================
     THEME
  ======================================================= */

  const bg = darkMode ? DARK_BG : LIGHT_BG;
  const card = darkMode ? DARK_CARD : LIGHT_CARD;
  const text = darkMode ? DARK_TEXT : LIGHT_TEXT;
  const muted = darkMode ? DARK_MUTED : LIGHT_MUTED;
  const border = darkMode ? DARK_BORDER : LIGHT_BORDER;

  const iconBackground = darkMode
    ? "#24151A"
    : "#F8EDEF";

  /* =======================================================
     ALERT
  ======================================================= */

  const showInfo = (title: string) => {
    Alert.alert(
      title,
      "This setting is ready to be connected to the TUP-OrderUP backend configuration."
    );
  };

  /* =======================================================
     MAINTENANCE MODE
  ======================================================= */

  const toggleMaintenance = (value: boolean) => {
    if (value) {
      Alert.alert(
        "Enable Maintenance Mode",
        "Maintenance Mode will restrict normal application access. Do you want to continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enable",
            style: "destructive",
            onPress: () => setMaintenance(true),
          },
        ]
      );
    } else {
      setMaintenance(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: bg,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={
          darkMode
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={
          darkMode
            ? TUP_DARK_RED
            : TUP_RED
        }
      />

      <View style={styles.container}>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <View
          style={[
            styles.header,
            {
              backgroundColor: darkMode
                ? TUP_DARK_RED
                : TUP_RED,
            },
          ]}
        >
          <View style={styles.headerContent}>

            <View style={{ flex: 1 }}>

              <Text style={styles.institution}>
                TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES
              </Text>

              <Text style={styles.headerTitle}>
                Settings
              </Text>

              <Text style={styles.headerSubtitle}>
                Application administration and system preferences
              </Text>

            </View>

            <View style={styles.headerIcon}>
              <Ionicons
                name="settings"
                size={26}
                color={TUP_GOLD}
              />
            </View>

          </View>
        </View>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* ===================================================
              GENERAL
          =================================================== */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            General
          </Text>

          <SettingSwitch
            icon="notifications-outline"
            title="Admin Notifications"
            description="Receive important administrative notifications."
            value={notifications}
            onValueChange={setNotifications}
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            iconBackground={iconBackground}
          />

          <SettingSwitch
            icon="construct-outline"
            title="Maintenance Mode"
            description="Temporarily restrict application access."
            value={maintenance}
            onValueChange={toggleMaintenance}
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            iconBackground={iconBackground}
            warning={maintenance}
          />

          {/* ===================================================
              ADMINISTRATION
          =================================================== */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            Administration
          </Text>

          <SettingItem
            icon="people-outline"
            title="User Management"
            description="Manage user accounts, roles, and access."
            onPress={() =>
              router.replace("/admin/users")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            iconBackground={iconBackground}
          />

          <SettingItem
            icon="server-outline"
            title="Database"
            description="View database information and connection status."
            onPress={() =>
              router.replace("/admin/database")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            iconBackground={iconBackground}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            title="Security"
            description="Review security and administrative access controls."
            onPress={() =>
              router.replace("/admin/security")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            iconBackground={iconBackground}
          />

          {/* ===================================================
              SYSTEM
          =================================================== */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            System
          </Text>

          <SettingItem
            icon="information-circle-outline"
            title="System Information"
            description="View application and system information."
            onPress={() =>
              showInfo("System Information")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            iconBackground={iconBackground}
          />

          <SettingItem
            icon="options-outline"
            title="System Configuration"
            description="Manage application configuration and preferences."
            onPress={() =>
              showInfo("System Configuration")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            iconBackground={iconBackground}
          />

          {/* ===================================================
              ABOUT
          =================================================== */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            About
          </Text>

          <View
            style={[
              styles.aboutCard,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >

            <View style={styles.aboutLogo}>
              <Text style={styles.aboutLogoText}>
                TUP
              </Text>
            </View>

            <View style={{ flex: 1 }}>

              <Text
                style={[
                  styles.aboutTitle,
                  {
                    color: text,
                  },
                ]}
              >
                TUP-OrderUP
              </Text>

              <Text
                style={[
                  styles.aboutDescription,
                  {
                    color: muted,
                  },
                ]}
              >
                Administrative Management System
              </Text>

              <Text style={styles.version}>
                Version 1.0.0
              </Text>

            </View>

          </View>

          <View style={{ height: 105 }} />

        </ScrollView>

        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <AdminBottomNav
          active="settings"
          darkMode={darkMode}
        />

      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   SETTING SWITCH
========================================================= */

function SettingSwitch({
  icon,
  title,
  description,
  value,
  onValueChange,
  card,
  border,
  text,
  muted,
  darkMode,
  iconBackground,
  warning = false,
}: {
  icon: IoniconName;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  card: string;
  border: string;
  text: string;
  muted: string;
  darkMode: boolean;
  iconBackground: string;
  warning?: boolean;
}) {
  return (
    <View
      style={[
        styles.settingCard,
        {
          backgroundColor: card,
          borderColor: warning
            ? TUP_RED
            : border,
        },
      ]}
    >

      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={TUP_RED}
        />
      </View>

      <View style={{ flex: 1 }}>

        <Text
          style={[
            styles.settingTitle,
            {
              color: text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingDescription,
            {
              color: muted,
            },
          ]}
        >
          {description}
        </Text>

      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: darkMode
            ? "#374151"
            : "#D1D5DB",
          true: TUP_RED,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={
          darkMode
            ? "#374151"
            : "#D1D5DB"
        }
      />

    </View>
  );
}

/* =========================================================
   SETTING ITEM
========================================================= */

function SettingItem({
  icon,
  title,
  description,
  onPress,
  card,
  border,
  text,
  muted,
  iconBackground,
}: {
  icon: IoniconName;
  title: string;
  description: string;
  onPress: () => void;
  card: string;
  border: string;
  text: string;
  muted: string;
  iconBackground: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.settingCard,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >

      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={TUP_RED}
        />
      </View>

      <View style={{ flex: 1 }}>

        <Text
          style={[
            styles.settingTitle,
            {
              color: text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingDescription,
            {
              color: muted,
            },
          ]}
        >
          {description}
        </Text>

      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={muted}
      />

    </TouchableOpacity>
  );
}

/* =========================================================
   ADMIN BOTTOM NAVIGATION
   EXACTLY 5 TABS
========================================================= */

function AdminBottomNav({
  active,
  darkMode,
}: {
  active: string;
  darkMode: boolean;
}) {
  const bg = darkMode
    ? DARK_CARD
    : LIGHT_CARD;

  const border = darkMode
    ? DARK_BORDER
    : LIGHT_BORDER;

  const inactive = darkMode
    ? "#8B95A3"
    : "#737B87";

  const tabs = [
    [
      "overview",
      "Overview",
      "grid-outline",
      "grid",
      "/admin/dashboard",
    ],
    [
      "users",
      "Users",
      "people-outline",
      "people",
      "/admin/users",
    ],
    [
      "database",
      "Database",
      "server-outline",
      "server",
      "/admin/database",
    ],
    [
      "security",
      "Security",
      "shield-checkmark-outline",
      "shield-checkmark",
      "/admin/security",
    ],
    [
      "settings",
      "Settings",
      "settings-outline",
      "settings",
      "/admin/settings",
    ],
  ] as const;

  return (
    <View
      style={[
        styles.bottomNav,
        {
          backgroundColor: bg,
          borderTopColor: border,
        },
      ]}
    >

      {tabs.map(
        ([
          key,
          label,
          icon,
          activeIcon,
          route,
        ]) => {
          const isActive =
            active === key;

          return (
            <TouchableOpacity
              key={key}
              style={styles.navItem}
              activeOpacity={0.75}
              onPress={() => {
                if (!isActive) {
                  router.replace(
                    route as any
                  );
                }
              }}
            >

              {/* ==========================================
                  RED ACTIVE INDICATOR
                  nasa pinakataas ng active tab
              ========================================== */}

              {isActive && (
                <View
                  style={
                    styles.navActiveIndicator
                  }
                />
              )}

              <View
                style={[
                  styles.navIconContainer,
                  isActive &&
                    styles.navIconActive,
                ]}
              >
                <Ionicons
                  name={
                    (isActive
                      ? activeIcon
                      : icon) as any
                  }
                  size={20}
                  color={
                    isActive
                      ? TUP_RED
                      : inactive
                  }
                />
              </View>

              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive
                      ? TUP_RED
                      : inactive,
                    fontWeight:
                      isActive
                        ? "800"
                        : "500",
                  },
                ]}
              >
                {label}
              </Text>

            </TouchableOpacity>
          );
        }
      )}

    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    minHeight: 126,
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 18,
    justifyContent: "center",
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  institution: {
    color: "#F7F1E6",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    lineHeight: 13,
    maxWidth: 300,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 5,
  },

  headerSubtitle: {
    color: "#E8D7D9",
    fontSize: 11.5,
    marginTop: 4,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor:
      "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor:
      "rgba(200,169,107,0.45)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    paddingHorizontal: 18,
    paddingTop: 17,
    paddingBottom: 30,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 10,
  },

  /* =======================================================
     SETTING CARD
  ======================================================= */

  settingCard: {
    minHeight: 78,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  settingIcon: {
    width: 43,
    height: 43,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  settingTitle: {
    fontSize: 13.5,
    fontWeight: "800",
  },

  settingDescription: {
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 3,
    paddingRight: 5,
  },

  /* =======================================================
     ABOUT
  ======================================================= */

  aboutCard: {
    minHeight: 86,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  aboutLogo: {
    width: 52,
    height: 52,
    borderRadius: 13,
    backgroundColor: TUP_RED,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  aboutLogoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  aboutTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  aboutDescription: {
    fontSize: 10.5,
    marginTop: 3,
  },

  version: {
    color: TUP_RED,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 5,
  },

  /* =======================================================
     BOTTOM NAVIGATION
  ======================================================= */

  bottomNav: {
    height: 73,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  navItem: {
    width: "20%",
    height: 73,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  /* =======================================================
     RED LINE ABOVE ACTIVE ICON
  ======================================================= */

  navActiveIndicator: {
    position: "absolute",
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: TUP_RED,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  navIconContainer: {
    width: 35,
    height: 29,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  navIconActive: {
    backgroundColor: "#F8EDEF",
  },

  navLabel: {
    fontSize: 9,
    marginTop: 3,
  },
});
