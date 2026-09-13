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
   MAIN
========================================================= */

export default function AdminDatabase() {
  const { darkMode } = useTheme();

  const bg = darkMode ? DARK_BG : LIGHT_BG;
  const card = darkMode ? DARK_CARD : LIGHT_CARD;
  const text = darkMode ? DARK_TEXT : LIGHT_TEXT;
  const muted = darkMode ? DARK_MUTED : LIGHT_MUTED;
  const border = darkMode ? DARK_BORDER : LIGHT_BORDER;

  /* =======================================================
     BACKUP
  ======================================================= */

  const backup = () => {
    Alert.alert(
      "Database Backup",
      "The database backup service is ready to be connected to the TUP-OrderUP backend API.",
      [
        {
          text: "OK",
          style: "default",
        },
      ]
    );
  };

  /* =======================================================
     COLLECTION
  ======================================================= */

  const openCollection = (name: string) => {
    Alert.alert(
      name,
      `${name} collection management can be connected to the database API.`,
      [
        {
          text: "OK",
          style: "default",
        },
      ]
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
        backgroundColor={darkMode ? DARK_CARDINAL : CARDINAL}
      />

      <View style={styles.container}>

        {/* =================================================
            HEADER
            SAME STRUCTURE AS DASHBOARD
        ================================================= */}

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
          {/* BRAND ROW */}

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

          {/* HEADER BOTTOM */}

          <View style={styles.headerBottom}>
            <View style={styles.headerInfo}>
              <Text style={styles.kicker}>
                MASTER ADMIN
              </Text>

              <Text style={styles.title}>
                Database
              </Text>

              <Text style={styles.subtitle}>
                Database monitoring and management
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Ionicons
                name="server"
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* =================================================
              DATABASE STATUS
          ================================================= */}

          <View
            style={[
              styles.connection,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >
            <View
              style={[
                styles.connectionIcon,
                {
                  backgroundColor: darkMode
                    ? "#24151A"
                    : "#F8ECEE",
                },
              ]}
            >
              <Ionicons
                name="server"
                size={25}
                color={CARDINAL}
              />
            </View>

            <View style={styles.connectionInfo}>
              <Text
                style={[
                  styles.connectionTitle,
                  {
                    color: text,
                  },
                ]}
              >
                Database Online
              </Text>

              <Text
                style={[
                  styles.connectionSubtitle,
                  {
                    color: muted,
                  },
                ]}
              >
                Active connection to the TUP-OrderUP database.
              </Text>
            </View>

            <View style={styles.online}>
              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                ONLINE
              </Text>
            </View>
          </View>

          {/* =================================================
              DATABASE INFORMATION
          ================================================= */}

          <Text
            style={[
              styles.section,
              {
                color: text,
              },
            ]}
          >
            Database Information
          </Text>

          <Info
            icon="server-outline"
            label="Database Name"
            value="TUPOrderUp"
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
          />

          <Info
            icon="cloud-done-outline"
            label="Connection Status"
            value="Connected"
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            success
          />

          <Info
            icon="layers-outline"
            label="Database Collections"
            value="Available"
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
          />

          {/* =================================================
              COLLECTIONS
          ================================================= */}

          <Text
            style={[
              styles.section,
              {
                color: text,
              },
            ]}
          >
            Collections
          </Text>

          <Collection
            icon="people-outline"
            name="Users"
            description="User account and profile records"
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() => openCollection("Users")}
          />

          <Collection
            icon="receipt-outline"
            name="Orders"
            description="Order and transaction records"
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() => openCollection("Orders")}
          />

          <Collection
            icon="restaurant-outline"
            name="Products"
            description="Product and menu records"
            card={card}
            border={border}
            text={text}
            muted={muted}
            darkMode={darkMode}
            onPress={() => openCollection("Products")}
          />

          {/* =================================================
              DATABASE ACTIONS
          ================================================= */}

          <Text
            style={[
              styles.section,
              {
                color: text,
              },
            ]}
          >
            Database Actions
          </Text>

          <TouchableOpacity
            activeOpacity={0.82}
            onPress={backup}
            style={[
              styles.backup,
              {
                backgroundColor: card,
                borderColor: border,
              },
            ]}
          >
            <View
              style={[
                styles.backupIcon,
                {
                  backgroundColor: darkMode
                    ? "#24151A"
                    : "#F8ECEE",
                },
              ]}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color={CARDINAL}
              />
            </View>

            <View style={styles.backupInfo}>
              <Text
                style={[
                  styles.backupTitle,
                  {
                    color: text,
                  },
                ]}
              >
                Create Database Backup
              </Text>

              <Text
                style={[
                  styles.backupDescription,
                  {
                    color: muted,
                  },
                ]}
              >
                Create a server-side backup of the application database.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={muted}
            />
          </TouchableOpacity>

          {/* =================================================
              NOTE
          ================================================= */}

          <View
            style={[
              styles.noteCard,
              {
                backgroundColor: darkMode
                  ? "#1A1711"
                  : "#FBF8F1",
                borderColor: darkMode
                  ? "#443B28"
                  : "#E8DEC7",
              },
            ]}
          >
            <View style={styles.noteIcon}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={GOLD}
              />
            </View>

            <View style={styles.noteInfo}>
              <Text
                style={[
                  styles.noteTitle,
                  {
                    color: text,
                  },
                ]}
              >
                Database Administration
              </Text>

              <Text
                style={[
                  styles.noteText,
                  {
                    color: muted,
                  },
                ]}
              >
                Database operations should be performed carefully.
                Changes to production data may affect the TUP-OrderUP system.
              </Text>
            </View>
          </View>

          {/* NAVIGATION SPACING */}

          <View style={{ height: 105 }} />

        </ScrollView>

        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <AdminBottomNav
          active="database"
          darkMode={darkMode}
        />

      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   DATABASE INFORMATION
========================================================= */

function Info({
  icon,
  label,
  value,
  card,
  border,
  text,
  muted,
  darkMode,
  success = false,
}: {
  icon: IconName;
  label: string;
  value: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  darkMode: boolean;
  success?: boolean;
}) {
  return (
    <View
      style={[
        styles.info,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor: darkMode
              ? "#24151A"
              : "#F8ECEE",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={CARDINAL}
        />
      </View>

      <View style={styles.infoText}>
        <Text
          style={[
            styles.infoLabel,
            {
              color: muted,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            {
              color: success
                ? SUCCESS
                : text,
            },
          ]}
        >
          {value}
        </Text>
      </View>

      {success && (
        <View style={styles.successBadge}>
          <View style={styles.successDot} />

          <Text style={styles.successText}>
            ACTIVE
          </Text>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   COLLECTION
========================================================= */

function Collection({
  icon,
  name,
  description,
  card,
  border,
  text,
  muted,
  darkMode,
  onPress,
}: {
  icon: IconName;
  name: string;
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
        styles.collection,
        {
          backgroundColor: card,
          borderColor: border,
        },
      ]}
    >
      <View
        style={[
          styles.collectionIcon,
          {
            backgroundColor: darkMode
              ? "#24151A"
              : "#F8ECEE",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={CARDINAL}
        />
      </View>

      <View style={styles.collectionInfo}>
        <Text
          style={[
            styles.collectionName,
            {
              color: text,
            },
          ]}
        >
          {name}
        </Text>

        <Text
          style={[
            styles.collectionDescription,
            {
              color: muted,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      <View style={styles.collectionRight}>
        <View style={styles.collectionStatus}>
          <View style={styles.successDot} />

          <Text style={styles.collectionStatusText}>
            READY
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={muted}
        />
      </View>
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
     MATCH DASHBOARD
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
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerInfo: {
    flex: 1,
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
    marginTop: 3,
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
     CONNECTION
  ======================================================= */

  connection: {
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  connectionIcon: {
    width: 47,
    height: 47,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  connectionInfo: {
    flex: 1,
  },

  connectionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  connectionSubtitle: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
    paddingRight: 4,
  },

  online: {
    alignItems: "flex-end",
    marginLeft: 7,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SUCCESS,
    marginBottom: 4,
  },

  onlineText: {
    color: SUCCESS,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.4,
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
     INFORMATION
  ======================================================= */

  info: {
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  infoText: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 9.5,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF7F0",
  },

  successDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SUCCESS,
    marginRight: 5,
  },

  successText: {
    color: SUCCESS,
    fontSize: 8,
    fontWeight: "900",
  },

  /* =======================================================
     COLLECTIONS
  ======================================================= */

  collection: {
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  collectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  collectionInfo: {
    flex: 1,
  },

  collectionName: {
    fontSize: 13,
    fontWeight: "800",
  },

  collectionDescription: {
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
  },

  collectionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 7,
    gap: 5,
  },

  collectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },

  collectionStatusText: {
    color: SUCCESS,
    fontSize: 7.5,
    fontWeight: "900",
  },

  /* =======================================================
     BACKUP
  ======================================================= */

  backup: {
    minHeight: 78,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  backupIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  backupInfo: {
    flex: 1,
  },

  backupTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  backupDescription: {
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
    paddingRight: 4,
  },

  /* =======================================================
     NOTE
  ======================================================= */

  noteCard: {
    marginTop: 12,
    minHeight: 82,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  noteIcon: {
    width: 39,
    height: 39,
    borderRadius: 10,
    backgroundColor:
      "rgba(200,169,107,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  noteInfo: {
    flex: 1,
  },

  noteTitle: {
    fontSize: 12.5,
    fontWeight: "800",
  },

  noteText: {
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
    paddingRight: 3,
  },

  /* =======================================================
     BOTTOM NAV
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
