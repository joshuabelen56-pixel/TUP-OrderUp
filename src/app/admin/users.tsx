import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

/* =========================================================
   TUP / TUPC COLORS
========================================================= */

const CARDINAL = "#8B1E2D";
const DARK_CARDINAL = "#641522";
const GOLD = "#C8A96B";
const SUCCESS = "#278548";

export default function AdminUsers() {
  const { darkMode } = useTheme();

  const bg = darkMode ? "#0D1117" : "#F4F5F7";
  const card = darkMode ? "#161C24" : "#FFFFFF";
  const text = darkMode ? "#FFFFFF" : "#252A34";
  const muted = darkMode ? "#A5ADB8" : "#6B7280";
  const border = darkMode ? "#29313C" : "#E1E4E8";

  /* =======================================================
     ACTION HANDLER
  ======================================================= */

  const handleAction = (title: string) => {
    Alert.alert(
      title,
      `${title} is ready to be connected to the TUP-OrderUP user management API.`
    );
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
        barStyle="light-content"
        backgroundColor={
          darkMode
            ? DARK_CARDINAL
            : CARDINAL
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
                ? DARK_CARDINAL
                : CARDINAL,
            },
          ]}
        >

          <View style={styles.brandRow}>

            <View style={styles.logoBox}>
              <Ionicons
                name="shield"
                size={23}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.institution}>
                TUP
              </Text>

              <Text style={styles.institutionSub}>
                ADMINISTRATION PORTAL
              </Text>
            </View>

          </View>

          <View style={styles.headerBottom}>

            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>
                MASTER ADMIN
              </Text>

              <Text style={styles.title}>
                Users
              </Text>

              <Text style={styles.subtitle}>
                Registered accounts and access management
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Ionicons
                name="people"
                size={25}
                color={CARDINAL}
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
              USER SUMMARY
          =================================================== */}

          <View
            style={[
              styles.summary,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >

            <View
              style={[
                styles.summaryIcon,
                {
                  backgroundColor: darkMode
                    ? "#24151A"
                    : "#F8ECEE",
                },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={25}
                color={CARDINAL}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.summaryLabel,
                  {
                    color: muted,
                  },
                ]}
              >
                Total Registered Users
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  {
                    color: text,
                  },
                ]}
              >
                —
              </Text>
            </View>

            <View style={styles.systemBadge}>
              <Text style={styles.systemBadgeText}>
                ACCOUNTS
              </Text>
            </View>

          </View>

          {/* ===================================================
              ACCOUNT MANAGEMENT
          =================================================== */}

          <Text
            style={[
              styles.section,
              {
                color: text,
              },
            ]}
          >
            Account Management
          </Text>

          <AdminAction
            icon="person-add-outline"
            title="Add User"
            description="Create and register a new user account."
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() =>
              handleAction("Add User")
            }
          />

          <AdminAction
            icon="people-outline"
            title="User Directory"
            description="View registered users and account information."
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() =>
              handleAction("User Directory")
            }
          />

          <AdminAction
            icon="shield-outline"
            title="Roles & Permissions"
            description="Review user roles and administrative permissions."
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() =>
              handleAction("Roles & Permissions")
            }
          />

          <AdminAction
            icon="person-remove-outline"
            title="Account Status"
            description="Manage active and restricted accounts."
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() =>
              handleAction("Account Status")
            }
          />

          {/* ===================================================
              ADMINISTRATION
          =================================================== */}

          <Text
            style={[
              styles.section,
              {
                color: text,
              },
            ]}
          >
            Administration
          </Text>

          <View
            style={[
              styles.notice,
              {
                backgroundColor: darkMode
                  ? "#241A1D"
                  : "#FCF3F4",
                borderColor: darkMode
                  ? "#4B2B31"
                  : "#EDD3D7",
              },
            ]}
          >

            <View style={styles.noticeIcon}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={CARDINAL}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.noticeTitle,
                  {
                    color: text,
                  },
                ]}
              >
                Account Administration
              </Text>

              <Text
                style={[
                  styles.noticeText,
                  {
                    color: muted,
                  },
                ]}
              >
                User records are managed through the application's
                connected database and authentication system.
              </Text>
            </View>

          </View>

          {/* ===================================================
              ACCESS CONTROL
          =================================================== */}

          <Text
            style={[
              styles.section,
              {
                color: text,
              },
            ]}
          >
            Access Control
          </Text>

          <View
            style={[
              styles.accessCard,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >

            <View
              style={[
                styles.accessIcon,
                {
                  backgroundColor: darkMode
                    ? "#24151A"
                    : "#F8ECEE",
                },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color={CARDINAL}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.accessTitle,
                  {
                    color: text,
                  },
                ]}
              >
                Authentication System
              </Text>

              <Text
                style={[
                  styles.accessDescription,
                  {
                    color: muted,
                  },
                ]}
              >
                User authentication and authorization services
                are connected to the application backend.
              </Text>
            </View>

            <View style={styles.connectedBadge}>
              <View style={styles.successDot} />

              <Text style={styles.connectedText}>
                ACTIVE
              </Text>
            </View>

          </View>

          <View style={{ height: 105 }} />

        </ScrollView>

        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <AdminBottomNav
          active="users"
          darkMode={darkMode}
        />

      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   ADMIN ACTION
========================================================= */

function AdminAction({
  icon,
  title,
  description,
  card,
  border,
  text,
  muted,
  darkMode,
  onPress,
}: {
  icon: IconName;
  title: string;
  description: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  darkMode: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.action,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >

      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor: darkMode
              ? "#24151A"
              : "#F8ECEE",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={CARDINAL}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.actionTitle,
            {
              color: text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.actionDescription,
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
========================================================= */

function AdminBottomNav({
  active,
  darkMode,
}: {
  active: string;
  darkMode: boolean;
}) {
  const bg = darkMode
    ? "#161C24"
    : "#FFFFFF";

  const border = darkMode
    ? "#29313C"
    : "#E1E4E8";

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
          const selected =
            active === key;

          return (
            <TouchableOpacity
              key={key}
              style={styles.navItem}
              activeOpacity={0.75}
              onPress={() => {
                if (!selected) {
                  router.replace(
                    route as any
                  );
                }
              }}
            >

              {selected && (
                <View
                  style={styles.activeLine}
                />
              )}

              <View
                style={[
                  styles.navIconContainer,
                  selected &&
                    styles.navIconActive,
                ]}
              >
                <Ionicons
                  name={
                    (selected
                      ? activeIcon
                      : icon) as any
                  }
                  size={20}
                  color={
                    selected
                      ? CARDINAL
                      : inactive
                  }
                />
              </View>

              <Text
                style={[
                  styles.navLabel,
                  {
                    color: selected
                      ? CARDINAL
                      : inactive,
                    fontWeight:
                      selected
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
    paddingTop: 13,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 19,
  },

  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  institution: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },

  institutionSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 7.5,
    fontWeight: "700",
    letterSpacing: 1.1,
  },

  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  kicker: {
    color: GOLD,
    fontSize: 8.5,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 2,
  },

  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10.5,
    lineHeight: 15,
    marginTop: 3,
    paddingRight: 5,
  },

  headerIcon: {
    width: 47,
    height: 47,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
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
     SUMMARY
  ======================================================= */

  summary: {
    minHeight: 90,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 47,
    height: 47,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryLabel: {
    fontSize: 10,
  },

  summaryValue: {
    fontSize: 25,
    fontWeight: "800",
    marginTop: 2,
  },

  systemBadge: {
    backgroundColor: "#F8ECEE",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
  },

  systemBadgeText: {
    color: CARDINAL,
    fontSize: 7.5,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  section: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 22,
    marginBottom: 10,
  },

  /* =======================================================
     ACTION
  ======================================================= */

  action: {
    minHeight: 76,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  actionDescription: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
    paddingRight: 4,
  },

  /* =======================================================
     NOTICE
  ======================================================= */

  notice: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F8EDEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  noticeTitle: {
    fontSize: 12.5,
    fontWeight: "800",
  },

  noticeText: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  /* =======================================================
     ACCESS CONTROL
  ======================================================= */

  accessCard: {
    minHeight: 82,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  accessIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  accessTitle: {
    fontSize: 12.5,
    fontWeight: "800",
  },

  accessDescription: {
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
    paddingRight: 4,
  },

  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF7F0",
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 7,
    marginLeft: 6,
  },

  successDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS,
    marginRight: 4,
  },

  connectedText: {
    color: SUCCESS,
    fontSize: 7.5,
    fontWeight: "900",
  },

  /* =======================================================
     BOTTOM NAVIGATION
  ======================================================= */

  bottomNav: {
    height: 73,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  navItem: {
    width: "20%",
    height: 73,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    position: "relative",
  },

  activeLine: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 3,
    backgroundColor: CARDINAL,
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
  },
});
