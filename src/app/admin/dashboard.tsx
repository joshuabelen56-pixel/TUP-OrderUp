import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
const CARDINAL_DARK = "#641522";
const GOLD = "#C8A96B";
const SUCCESS = "#278548";

export default function AdminDashboard() {
  const { darkMode } = useTheme();

  const bg = darkMode ? "#0D1117" : "#F4F5F7";
  const card = darkMode ? "#161C24" : "#FFFFFF";
  const text = darkMode ? "#FFFFFF" : "#252A34";
  const muted = darkMode ? "#A5ADB8" : "#6B7280";
  const border = darkMode ? "#29313C" : "#E1E4E8";

  const go = (route: string) => {
    router.replace(route as any);
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
            ? CARDINAL_DARK
            : CARDINAL
        }
      />

      <View style={styles.container}>

        {/* =====================================================
            INSTITUTIONAL HEADER
        ===================================================== */}

        <View
          style={[
            styles.topHeader,
            {
              backgroundColor: darkMode
                ? CARDINAL_DARK
                : CARDINAL,
            },
          ]}
        >

          <View style={styles.brandRow}>

            <View style={styles.logoBox}>
              <Ionicons
                name="shield"
                size={24}
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

          <View style={styles.adminCircle}>
            <Ionicons
              name="person"
              size={17}
              color={CARDINAL}
            />
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
              PAGE HEADER
          =================================================== */}

          <View style={styles.pageHeader}>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.pageKicker,
                  {
                    color: CARDINAL,
                  },
                ]}
              >
                MASTER ADMIN
              </Text>

              <Text
                style={[
                  styles.pageTitle,
                  {
                    color: text,
                  },
                ]}
              >
                Overview
              </Text>

              <Text
                style={[
                  styles.pageSubtitle,
                  {
                    color: muted,
                  },
                ]}
              >
                Administrative system overview and management.
              </Text>
            </View>

            <View
              style={[
                styles.secureBadge,
                {
                  backgroundColor: darkMode
                    ? "#25151A"
                    : "#F8ECEE",
                },
              ]}
            >
              <View style={styles.secureDot} />

              <Text style={styles.secureText}>
                SECURE
              </Text>
            </View>

          </View>

          {/* ===================================================
              WELCOME PANEL
          =================================================== */}

          <View
            style={[
              styles.welcome,
              {
                backgroundColor: CARDINAL,
              },
            ]}
          >

            <View style={styles.welcomeContent}>

              <Text style={styles.welcomeKicker}>
                TUP SYSTEM
              </Text>

              <Text style={styles.welcomeTitle}>
                Welcome, Administrator
              </Text>

              <Text style={styles.welcomeDescription}>
                Manage users, database services, security controls,
                and system settings from the administration portal.
              </Text>

            </View>

            <View style={styles.welcomeIcon}>
              <Ionicons
                name="business-outline"
                size={42}
                color="rgba(255,255,255,0.9)"
              />
            </View>

          </View>

          {/* ===================================================
              SYSTEM STATUS
          =================================================== */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            System Status
          </Text>

          <View style={styles.statsRow}>

            <StatusCard
              icon="people-outline"
              title="Users"
              value="—"
              subtitle="Registered accounts"
              card={card}
              border={border}
              text={text}
              muted={muted}
              darkMode={darkMode}
              onPress={() =>
                go("/admin/users")
              }
            />

            <StatusCard
              icon="server-outline"
              title="Database"
              value="Online"
              subtitle="Connection active"
              card={card}
              border={border}
              text={text}
              muted={muted}
              darkMode={darkMode}
              onPress={() =>
                go("/admin/database")
              }
              status="online"
            />

          </View>

          <View style={styles.statsRow}>

            <StatusCard
              icon="shield-checkmark-outline"
              title="Security"
              value="Active"
              subtitle="Protection enabled"
              card={card}
              border={border}
              text={text}
              muted={muted}
              darkMode={darkMode}
              onPress={() =>
                go("/admin/security")
              }
              status="active"
            />

            <StatusCard
              icon="settings-outline"
              title="Settings"
              value="Ready"
              subtitle="System configuration"
              card={card}
              border={border}
              text={text}
              muted={muted}
              darkMode={darkMode}
              onPress={() =>
                go("/admin/settings")
              }
            />

          </View>

          {/* ===================================================
              QUICK MANAGEMENT
          =================================================== */}

          <Text
            style={[
              styles.sectionTitle,
              {
                color: text,
              },
            ]}
          >
            Quick Management
          </Text>

          <ManagementCard
            icon="people-outline"
            title="User Management"
            description="View and manage registered accounts."
            onPress={() =>
              go("/admin/users")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
          />

          <ManagementCard
            icon="server-outline"
            title="Database Management"
            description="Monitor database connection and collections."
            onPress={() =>
              go("/admin/database")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
          />

          <ManagementCard
            icon="shield-checkmark-outline"
            title="Security Center"
            description="Review security controls and access protection."
            onPress={() =>
              go("/admin/security")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
          />

          <ManagementCard
            icon="settings-outline"
            title="System Settings"
            description="Configure administrative system preferences."
            onPress={() =>
              go("/admin/settings")
            }
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
          />

          {/* Bottom spacing */}
          <View style={{ height: 105 }} />

        </ScrollView>

        {/* =====================================================
            BOTTOM NAVIGATION
        ===================================================== */}

        <AdminBottomNav
          active="overview"
          darkMode={darkMode}
        />

      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   STATUS CARD
========================================================= */

function StatusCard({
  icon,
  title,
  value,
  subtitle,
  card,
  border,
  text,
  muted,
  darkMode,
  onPress,
  status,
}: {
  icon: IconName;
  title: string;
  value: string;
  subtitle: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  darkMode: boolean;
  onPress: () => void;
  status?: "online" | "active";
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.statusCard,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >

      <View
        style={[
          styles.statusIcon,
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

      <View style={styles.statusHeader}>

        <Text
          style={[
            styles.statusTitle,
            {
              color: text,
            },
          ]}
        >
          {title}
        </Text>

        {status && (
          <View style={styles.statusDotContainer}>
            <View style={styles.statusDot} />
          </View>
        )}

      </View>

      <Text
        style={[
          styles.statusValue,
          {
            color:
              status
                ? SUCCESS
                : text,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.statusSubtitle,
          {
            color: muted,
          },
        ]}
      >
        {subtitle}
      </Text>

    </TouchableOpacity>
  );
}

/* =========================================================
   MANAGEMENT CARD
========================================================= */

function ManagementCard({
  icon,
  title,
  description,
  onPress,
  card,
  border,
  text,
  muted,
  darkMode,
}: {
  icon: IconName;
  title: string;
  description: string;
  onPress: () => void;
  card: string;
  border: string;
  text: string;
  muted: string;
  darkMode: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[
        styles.managementCard,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >

      <View
        style={[
          styles.managementIcon,
          {
            backgroundColor: darkMode
              ? "#24151A"
              : "#F8ECEE",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={CARDINAL}
        />
      </View>

      <View style={styles.managementText}>

        <Text
          style={[
            styles.managementTitle,
            {
              color: text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.managementDescription,
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
              activeOpacity={0.75}
              style={styles.navItem}
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
     TOP HEADER
  ======================================================= */

  topHeader: {
    height: 68,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 39,
    height: 39,
    borderRadius: 9,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  institution: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  institutionSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 1,
  },

  adminCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 25,
  },

  /* =======================================================
     PAGE HEADER
  ======================================================= */

  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  pageKicker: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  pageTitle: {
    fontSize: 29,
    fontWeight: "800",
    marginTop: 2,
  },

  pageSubtitle: {
    fontSize: 11.5,
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 17,
  },

  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 7,
    marginLeft: 8,
  },

  secureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS,
    marginRight: 5,
  },

  secureText: {
    color: SUCCESS,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  /* =======================================================
     WELCOME
  ======================================================= */

  welcome: {
    minHeight: 155,
    borderRadius: 14,
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 21,
  },

  welcomeContent: {
    flex: 1,
    paddingRight: 8,
  },

  welcomeKicker: {
    color: GOLD,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 7,
  },

  welcomeDescription: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    lineHeight: 17,
  },

  welcomeIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor:
      "rgba(255,255,255,0.09)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     SECTIONS
  ======================================================= */

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },

  /* =======================================================
     STATUS CARDS
  ======================================================= */

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  statusCard: {
    flex: 1,
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 13,
    padding: 14,
  },

  statusIcon: {
    width: 39,
    height: 39,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusTitle: {
    fontSize: 11,
    fontWeight: "700",
  },

  statusValue: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 3,
  },

  statusSubtitle: {
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
  },

  statusDotContainer: {
    width: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS,
  },

  /* =======================================================
     MANAGEMENT CARDS
  ======================================================= */

  managementCard: {
    minHeight: 73,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  managementIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  managementText: {
    flex: 1,
  },

  managementTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  managementDescription: {
    fontSize: 10,
    marginTop: 3,
    lineHeight: 14,
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
  },
});
