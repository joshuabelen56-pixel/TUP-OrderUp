import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   COLORS
========================================================= */

const CARDINAL = "#8B1E2D";
const DARK_CARDINAL = "#641522";
const GOLD = "#C8A96B";

const SUCCESS = "#278548";

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
   NAVIGATION
========================================================= */

const tabs = [
  ["overview", "Overview", "grid-outline", "grid", "/admin/dashboard"],
  ["users", "Users", "people-outline", "people", "/admin/users"],
  ["database", "Database", "server-outline", "server", "/admin/database"],
  [
    "security",
    "Security",
    "shield-checkmark-outline",
    "shield-checkmark",
    "/admin/security",
  ],
  ["settings", "Settings", "settings-outline", "settings", "/admin/settings"],
] as const;

/* =========================================================
   COMPONENT
========================================================= */

export default function SecurityScreen() {
  const router = useRouter();
  const pathname = usePathname();

  const { darkMode } = useTheme();

  const bg = darkMode ? DARK_BG : LIGHT_BG;
  const card = darkMode ? DARK_CARD : LIGHT_CARD;
  const text = darkMode ? DARK_TEXT : LIGHT_TEXT;
  const muted = darkMode ? DARK_MUTED : LIGHT_MUTED;
  const border = darkMode ? DARK_BORDER : LIGHT_BORDER;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={darkMode ? DARK_CARDINAL : CARDINAL}
      />

      <View style={styles.container}>
        {/* =================================================
            HEADER — SAME DESIGN AS USERS
        ================================================= */}

        <View
          style={[
            styles.header,
            {
              backgroundColor: darkMode ? DARK_CARDINAL : CARDINAL,
            },
          ]}
        >
          {/* BRAND ROW */}

          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons name="shield" size={23} color="#FFFFFF" />
            </View>

            <View>
              <Text style={styles.institution}>TUP</Text>

              <Text style={styles.institutionSub}>
                ADMINISTRATION PORTAL
              </Text>
            </View>
          </View>

          {/* HEADER BOTTOM */}

          <View style={styles.headerBottom}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>MASTER ADMIN</Text>

              <Text style={styles.title}>Security</Text>

              <Text style={styles.subtitle}>
                System security and administrative access controls
              </Text>
            </View>

            {/* RIGHT ICON — SAME AS USERS */}

            <View style={styles.headerIcon}>
              <Ionicons
                name="shield-checkmark"
                size={25}
                color={CARDINAL}
              />
            </View>
          </View>
        </View>

        {/* =================================================
            CONTENT
        ================================================= */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* SECURITY STATUS */}

          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >
            <View style={styles.statusLeft}>
              <View style={styles.statusIcon}>
                <Ionicons
                  name="shield-checkmark"
                  size={21}
                  color={SUCCESS}
                />
              </View>

              <View>
                <Text style={[styles.statusTitle, { color: text }]}>
                  Security Status
                </Text>

                <Text style={[styles.statusSubtitle, { color: muted }]}>
                  Administrative security systems
                </Text>
              </View>
            </View>

            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />

              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          </View>

          {/* SECURITY OVERVIEW */}

          <Text style={[styles.sectionLabel, { color: muted }]}>
            SECURITY OVERVIEW
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >
            <SecurityRow
              icon="lock-closed-outline"
              title="Authentication"
              description="Administrative authentication is enabled"
              value="Enabled"
              text={text}
              muted={muted}
              border={border}
            />

            <SecurityRow
              icon="key-outline"
              title="Access Control"
              description="Role-based administrative permissions"
              value="Protected"
              text={text}
              muted={muted}
              border={border}
            />

            <SecurityRow
              icon="shield-checkmark-outline"
              title="System Protection"
              description="Security monitoring is active"
              value="Active"
              text={text}
              muted={muted}
              border={border}
            />

            <SecurityRow
              icon="eye-outline"
              title="Security Monitoring"
              description="Administrative activity monitoring"
              value="Enabled"
              text={text}
              muted={muted}
              border={border}
              last
            />
          </View>

          {/* SECURITY CONTROLS */}

          <Text style={[styles.sectionLabel, { color: muted }]}>
            SECURITY CONTROLS
          </Text>

          <View
            style={[
              styles.actionCard,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.actionRow}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: darkMode ? "#2A171D" : "#F8EDEF",
                  },
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={CARDINAL}
                />
              </View>

              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, { color: text }]}>
                  Manage Admin Access
                </Text>

                <Text style={[styles.actionDescription, { color: muted }]}>
                  Review administrative accounts and permissions
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={muted}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: border,
                },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.actionRow}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: darkMode ? "#2A171D" : "#F8EDEF",
                  },
                ]}
              >
                <Ionicons
                  name="key-outline"
                  size={20}
                  color={CARDINAL}
                />
              </View>

              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, { color: text }]}>
                  Access Permissions
                </Text>

                <Text style={[styles.actionDescription, { color: muted }]}>
                  Configure system access privileges
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={muted}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: border,
                },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.actionRow}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: darkMode ? "#2A171D" : "#F8EDEF",
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={CARDINAL}
                />
              </View>

              <View style={styles.actionText}>
                <Text style={[styles.actionTitle, { color: text }]}>
                  Activity Logs
                </Text>

                <Text style={[styles.actionDescription, { color: muted }]}>
                  Review recent administrative activities
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={muted}
              />
            </TouchableOpacity>
          </View>

          {/* ADMINISTRATIVE SECURITY */}

          <Text style={[styles.sectionLabel, { color: muted }]}>
            ADMINISTRATIVE SECURITY
          </Text>

          <View
            style={[
              styles.noticeCard,
              {
                backgroundColor: darkMode ? "#21191B" : "#FFF9F3",
                borderColor: darkMode ? "#4A292E" : "#EBDCCB",
              },
            ]}
          >
            <View style={styles.noticeIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={GOLD}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.noticeTitle, { color: text }]}>
                Keep administrative access secure
              </Text>

              <Text style={[styles.noticeText, { color: muted }]}>
                Only authorized administrators should have access to
                sensitive system controls and management functions.
              </Text>
            </View>
          </View>

          {/* BOTTOM SPACE */}

          <View style={{ height: 105 }} />
        </ScrollView>

        {/* =================================================
            BOTTOM NAV — SAME AS USERS
        ================================================= */}

        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: card,
              borderTopColor: border,
            },
          ]}
        >
          {tabs.map(
            ([key, label, inactiveIcon, activeIcon, route]) => {
              const isActive = pathname === route;

              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.75}
                  style={styles.navItem}
                  onPress={() => {
                    if (!isActive) {
                      router.replace(route as any);
                    }
                  }}
                >
                  {isActive && <View style={styles.activeLine} />}

                  <View
                    style={[
                      styles.navIconContainer,
                      isActive && styles.navIconActive,
                    ]}
                  >
                    <Ionicons
                      name={(isActive
                        ? activeIcon
                        : inactiveIcon) as any}
                      size={19}
                      color={isActive ? CARDINAL : muted}
                    />
                  </View>

                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: isActive ? CARDINAL : muted,
                        fontWeight: isActive ? "800" : "600",
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
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   SECURITY ROW
========================================================= */

function SecurityRow({
  icon,
  title,
  description,
  value,
  text,
  muted,
  border,
  last,
}: {
  icon: any;
  title: string;
  description: string;
  value: string;
  text: string;
  muted: string;
  border: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.securityRow,
        !last && {
          borderBottomWidth: 1,
          borderBottomColor: border,
        },
      ]}
    >
      <View style={styles.securityIcon}>
        <Ionicons name={icon} size={19} color={CARDINAL} />
      </View>

      <View style={styles.securityInfo}>
        <Text style={[styles.securityTitle, { color: text }]}>
          {title}
        </Text>

        <Text style={[styles.securityDescription, { color: muted }]}>
          {description}
        </Text>
      </View>

      <Text style={styles.securityValue}>{value}</Text>
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
     HEADER — COPIED FROM USERS DESIGN
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
    backgroundColor: "rgba(255,255,255,0.15)",
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
     SCROLL
  ======================================================= */

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  /* =======================================================
     STATUS
  ======================================================= */

  statusCard: {
    minHeight: 76,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF6EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  statusSubtitle: {
    fontSize: 9.5,
    marginTop: 3,
  },

  activeBadge: {
    height: 25,
    paddingHorizontal: 9,
    borderRadius: 8,
    backgroundColor: "#EAF6EE",
    flexDirection: "row",
    alignItems: "center",
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS,
    marginRight: 5,
  },

  activeText: {
    color: SUCCESS,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 9,
  },

  /* =======================================================
     CARD
  ======================================================= */

  card: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  securityRow: {
    minHeight: 67,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  securityIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F8EDEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  securityInfo: {
    flex: 1,
    paddingRight: 8,
  },

  securityTitle: {
    fontSize: 11.5,
    fontWeight: "800",
  },

  securityDescription: {
    fontSize: 8.8,
    lineHeight: 13,
    marginTop: 2,
  },

  securityValue: {
    color: SUCCESS,
    fontSize: 8.5,
    fontWeight: "800",
  },

  /* =======================================================
     ACTIONS
  ======================================================= */

  actionCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  actionRow: {
    minHeight: 67,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 39,
    height: 39,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 11.5,
    fontWeight: "800",
  },

  actionDescription: {
    fontSize: 8.8,
    lineHeight: 13,
    marginTop: 2,
    paddingRight: 5,
  },

  divider: {
    height: 1,
  },

  /* =======================================================
     NOTICE
  ======================================================= */

  noticeCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noticeIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  noticeTitle: {
    fontSize: 11,
    fontWeight: "800",
    marginTop: 1,
  },

  noticeText: {
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  /* =======================================================
     BOTTOM NAV — SAME AS USERS
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

