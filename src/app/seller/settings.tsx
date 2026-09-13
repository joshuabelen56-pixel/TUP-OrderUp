import React from "react";
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

const LIGHT = {
  background: "#F4F5F7",
  card: "#FFFFFF",
  text: "#101828",
  muted: "#667085",
  border: "#E7E8EB",
  cardinal: "#8F1029",
  cardinalDeep: "#5B0918",
  gold: "#D8B56A",
  green: "#2E8B57",
  red: "#C44747",
};

const DARK = {
  background: "#0F1012",
  card: "#191A1E",
  text: "#F5F5F5",
  muted: "#A6A8AD",
  border: "#2B2D33",
  cardinal: "#A6192E",
  cardinalDeep: "#520A18",
  gold: "#D8B56A",
  green: "#4CAF7A",
  red: "#E06767",
};

export default function SellerSettings() {
  const {
    darkMode,
    toggleDarkMode,
  } = useTheme();

  const C = darkMode ? DARK : LIGHT;

  const go = (
    path:
      | "/seller/dashboard"
      | "/seller/orders"
      | "/seller/menu"
      | "/seller/settings"
  ) => {
    router.replace(path);
  };

  const comingSoon = (title: string) => {
    Alert.alert(
      title,
      "This setting can be connected to the backend later."
    );
  };

  const logout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: C.background,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.cardinalDeep}
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: C.cardinalDeep,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>
              SELLER CENTER
            </Text>

            <Text style={styles.title}>
              Settings
            </Text>

            <Text style={styles.subtitle}>
              Manage your seller preferences
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="settings-outline"
              size={25}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* STORE PROFILE */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: C.card,
              borderColor: C.border,
            },
          ]}
        >
          <View
            style={[
              styles.profileLogo,
              {
                backgroundColor: darkMode
                  ? "#32121B"
                  : "#F8E9ED",
              },
            ]}
          >
            <Ionicons
              name="storefront"
              size={29}
              color={C.cardinal}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.profileName,
                { color: C.text },
              ]}
            >
              Campus Food Hub
            </Text>

            <Text
              style={[
                styles.profileEmail,
                { color: C.muted },
              ]}
            >
              seller@tup-orderup.com
            </Text>

            <View style={styles.verifiedRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={C.green}
              />

              <Text
                style={[
                  styles.verifiedText,
                  { color: C.green },
                ]}
              >
                Verified Seller
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              comingSoon("Edit Store")
            }
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={C.cardinal}
            />
          </TouchableOpacity>
        </View>

        {/* STORE */}
        <SectionTitle
          title="Store"
          C={C}
        />

        <View
          style={[
            styles.group,
            {
              backgroundColor: C.card,
              borderColor: C.border,
            },
          ]}
        >
          <SettingRow
            icon="storefront-outline"
            title="Store information"
            subtitle="Name, location and contact details"
            C={C}
            onPress={() =>
              comingSoon("Store Information")
            }
          />

          <Divider C={C} />

          <SettingRow
            icon="time-outline"
            title="Operating hours"
            subtitle="7:00 AM – 6:00 PM"
            C={C}
            onPress={() =>
              comingSoon("Operating Hours")
            }
          />

          <Divider C={C} />

          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Order alerts and seller updates"
            C={C}
            onPress={() =>
              comingSoon("Notifications")
            }
          />
        </View>

        {/* ACCOUNT */}
        <SectionTitle
          title="Account"
          C={C}
        />

        <View
          style={[
            styles.group,
            {
              backgroundColor: C.card,
              borderColor: C.border,
            },
          ]}
        >
          <SettingRow
            icon="person-outline"
            title="Account profile"
            subtitle="Manage your seller account"
            C={C}
            onPress={() =>
              comingSoon("Account Profile")
            }
          />

          <Divider C={C} />

          <SettingRow
            icon="lock-closed-outline"
            title="Password & security"
            subtitle="Security preferences"
            C={C}
            onPress={() =>
              comingSoon("Password & Security")
            }
          />
        </View>

        {/* APPEARANCE */}
        <SectionTitle
          title="Appearance"
          C={C}
        />

        <View
          style={[
            styles.group,
            {
              backgroundColor: C.card,
              borderColor: C.border,
            },
          ]}
        >
          <View style={styles.settingRow}>
            <View
              style={[
                styles.settingIcon,
                {
                  backgroundColor: darkMode
                    ? "#312719"
                    : "#FFF6DE",
                },
              ]}
            >
              <Ionicons
                name={
                  darkMode
                    ? "moon-outline"
                    : "sunny-outline"
                }
                size={20}
                color={C.gold}
              />
            </View>

            <View style={styles.settingText}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: C.text },
                ]}
              >
                Dark Mode
              </Text>

              <Text
                style={[
                  styles.settingSubtitle,
                  { color: C.muted },
                ]}
              >
                {darkMode
                  ? "Dark theme is enabled"
                  : "Use the light theme"}
              </Text>
            </View>

            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{
                false: darkMode
                  ? "#34363B"
                  : "#D0D5DD",
                true: C.cardinal,
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D0D5DD"
            />
          </View>
        </View>

        {/* ABOUT */}
        <SectionTitle
          title="About"
          C={C}
        />

        <View
          style={[
            styles.group,
            {
              backgroundColor: C.card,
              borderColor: C.border,
            },
          ]}
        >
          <SettingRow
            icon="information-circle-outline"
            title="About TUP-OrderUp"
            subtitle="Seller platform information"
            C={C}
            onPress={() =>
              comingSoon("About TUP-OrderUp")
            }
          />

          <Divider C={C} />

          <SettingRow
            icon="document-text-outline"
            title="Terms & conditions"
            subtitle="Review seller terms"
            C={C}
            onPress={() =>
              comingSoon("Terms & Conditions")
            }
          />

          <Divider C={C} />

          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy policy"
            subtitle="Review privacy information"
            C={C}
            onPress={() =>
              comingSoon("Privacy Policy")
            }
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={logout}
          style={[
            styles.logoutButton,
            {
              backgroundColor: darkMode
                ? "#301719"
                : "#FDECEC",
              borderColor: darkMode
                ? "#542326"
                : "#F3CACA",
            },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={C.red}
          />

          <Text
            style={[
              styles.logoutText,
              { color: C.red },
            ]}
          >
            Log out
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerBrand,
              { color: C.cardinal },
            ]}
          >
            TUP-OrderUp
          </Text>

          <Text
            style={[
              styles.footerText,
              { color: C.muted },
            ]}
          >
            Seller Center
          </Text>

          <Text
            style={[
              styles.version,
              { color: C.muted },
            ]}
          >
            Version 1.0.0
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <SellerNav
        active="settings"
        C={C}
        go={go}
      />
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
  C,
}: {
  title: string;
  C: any;
}) {
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color: C.text,
        },
      ]}
    >
      {title}
    </Text>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  C,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={styles.settingRow}
    >
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: "#F8E9ED",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={C.cardinal}
        />
      </View>

      <View style={styles.settingText}>
        <Text
          style={[
            styles.settingTitle,
            { color: C.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingSubtitle,
            { color: C.muted },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={C.muted}
      />
    </TouchableOpacity>
  );
}

function Divider({ C }: { C: any }) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: C.border,
        },
      ]}
    />
  );
}

function SellerNav({ active, C, go }: any) {
  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: C.card,
          borderTopColor: C.border,
        },
      ]}
    >
      <NavItem
        icon="home-outline"
        label="Home"
        active={active === "home"}
        C={C}
        onPress={() =>
          go("/seller/dashboard")
        }
      />

      <NavItem
        icon="receipt-outline"
        label="Orders"
        active={active === "orders"}
        C={C}
        onPress={() =>
          go("/seller/orders")
        }
      />

      <NavItem
        icon="restaurant-outline"
        label="Menu"
        active={active === "menu"}
        C={C}
        onPress={() =>
          go("/seller/menu")
        }
      />

      <NavItem
        icon="settings"
        label="Settings"
        active={active === "settings"}
        C={C}
        onPress={() =>
          go("/seller/settings")
        }
      />
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  C,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.navItem}
    >
      <Ionicons
        name={icon}
        size={22}
        color={active ? C.cardinal : C.muted}
      />

      <Text
        style={[
          styles.navLabel,
          {
            color: active
              ? C.cardinal
              : C.muted,
            fontWeight: active ? "800" : "500",
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eyebrow: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },

  subtitle: {
    color: "#D0D0D0",
    fontSize: 11,
    marginTop: 3,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 105,
  },

  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  profileLogo: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  profileName: {
    fontSize: 16,
    fontWeight: "900",
  },

  profileEmail: {
    fontSize: 10,
    marginTop: 3,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  verifiedText: {
    fontSize: 9,
    fontWeight: "800",
    marginLeft: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 22,
    marginBottom: 9,
    marginLeft: 2,
  },

  group: {
    borderRadius: 19,
    borderWidth: 1,
    overflow: "hidden",
  },

  settingRow: {
    minHeight: 69,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  settingIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 12,
    fontWeight: "800",
  },

  settingSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  divider: {
    height: 1,
    marginLeft: 66,
  },

  logoutButton: {
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 8,
  },

  footer: {
    alignItems: "center",
    marginTop: 27,
  },

  footerBrand: {
    fontSize: 13,
    fontWeight: "900",
  },

  footerText: {
    fontSize: 9,
    marginTop: 3,
  },

  version: {
    fontSize: 8,
    marginTop: 3,
  },

  bottomSpace: {
    height: 20,
  },

  nav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
  },

  navItem: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },

  navLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});