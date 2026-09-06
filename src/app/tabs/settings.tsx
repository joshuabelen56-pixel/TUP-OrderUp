import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =====================================================
// CONFIG
// =====================================================

const API_URL = "http://192.168.18.24:5000";
const PRIMARY = "#C41E3A";
const DARK_RED = "#8F1029";


const capitalizeName = (name?: string) => {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};


const USER_STORAGE_KEY = "@tuporderup_user";

type ModalType =
  | "profile"
  | "personal"
  | "security"
  | "verification"
  | "help"
  | "support"
  | "about"
  | null;

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  birthday?: string;
  age?: number;
  role?: string;
  email?: string | null;
  gsfeEmail?: string | null;
  gmailEmail?: string | null;
  tupIdNumber?: string | null;
  governmentIdType?: string | null;
  governmentIdNumber?: string | null;
  accountStatus?: string;
  createdAt?: string;
  updatedAt?: string;
};

// =====================================================
// MAIN SETTINGS
// =====================================================

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

  const [darkMode, setDarkMode] = useState(false);

  const [modal, setModal] =
    useState<ModalType>(null);

  // Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Password
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // Support
  const [feedback, setFeedback] =
    useState("");

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);

      const storedUser =
        await AsyncStorage.getItem(
          USER_STORAGE_KEY
        );

      if (!storedUser) {
        setLoading(false);

        Alert.alert(
          "Session Expired",
          "Please log in again.",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace(
                  "../login"
                ),
            },
          ]
        );

        return;
      }

      const parsedUser: User =
        JSON.parse(storedUser);

      if (!parsedUser?.id) {
        throw new Error(
          "Invalid stored user information."
        );
      }

      // Initial data from storage
      setUser(parsedUser);

      setFirstName(
        parsedUser.firstName || ""
      );

      setLastName(
        parsedUser.lastName || ""
      );

      setUsername(
        parsedUser.username || ""
      );

      setEmail(
        parsedUser.email ||
          parsedUser.gsfeEmail ||
          ""
      );

      // =================================================
      // GET LATEST USER FROM MONGODB
      // =================================================

      try {
        const response = await fetch(
          `${API_URL}/api/users/${parsedUser.id}`
        );

        const data = await response.json();

        if (response.ok && data.user) {
          setUser(data.user);

          setFirstName(
            data.user.firstName || ""
          );

          setLastName(
            data.user.lastName || ""
          );

          setUsername(
            data.user.username || ""
          );

          setEmail(
            data.user.email ||
            data.user.gsfeEmail ||
            data.user.gmailEmail ||
            ""
          );

          // Update local session
          await AsyncStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(data.user)
          );
        }
      } catch (error) {
        console.log(
          "Could not refresh user from server:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to load your account information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // THEME
  // =====================================================

  const theme = {
    background: darkMode
      ? "#111111"
      : "#F6F7F9",

    card: darkMode
      ? "#1E1E1E"
      : "#FFFFFF",

    text: darkMode
      ? "#FFFFFF"
      : "#242424",

    secondary: darkMode
      ? "#AAAAAA"
      : "#888888",

    border: darkMode
      ? "#303030"
      : "#EEEEEE",
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const initials =
    `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    if (!user?.id) {
      Alert.alert(
        "Error",
        "User session was not found."
      );
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please enter your first name and last name."
      );
      return;
    }

    if (!username.trim()) {
      Alert.alert(
        "Username Required",
        "Please enter your username."
      );
      return;
    }

    try {
      setSavingProfile(true);

      const response = await fetch(
        `${API_URL}/api/users/${user.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

        body: JSON.stringify({
          firstName: capitalizeName(firstName),
          lastName: capitalizeName(lastName),
          username: username.trim().toLowerCase(),
        }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      if (data.user) {
        setUser(data.user);

        setFirstName(
          data.user.firstName || ""
        );

        setLastName(
          data.user.lastName || ""
        );

        setUsername(
          data.user.username || ""
        );

        setEmail(
        data.user.email ||
        data.user.gsfeEmail ||
        data.user.gmailEmail ||
        ""
        );

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(data.user)
        );
      }

      setModal(null);

      Alert.alert(
        "Profile Updated",
        "Your profile information has been successfully updated."
      );
    } catch (error: any) {
      console.error(
        "Profile update error:",
        error
      );

      Alert.alert(
        "Update Failed",
        error?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const changePassword = async () => {
    if (!user?.id) {
      Alert.alert(
        "Error",
        "User session was not found."
      );
      return;
    }

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please complete all password fields."
      );
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Weak Password",
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirmation password do not match."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        `${API_URL}/api/users/${user.id}/password`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setModal(null);

      Alert.alert(
        "Password Updated",
        "Your password has been changed successfully."
      );
    } catch (error: any) {
      console.error(
        "Change password error:",
        error
      );

      Alert.alert(
        "Password Update Failed",
        error?.message ||
          "Unable to change your password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of TUP-OrderUp?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Log Out",
          style: "destructive",

          onPress: async () => {
            try {
              await AsyncStorage.removeItem(
                USER_STORAGE_KEY
              );

              router.replace(
                "../login"
              );
            } catch (error) {
              console.error(
                "Logout error:",
                error
              );

              // Still navigate even if
              // local storage has an issue.
              router.replace(
                "../login"
              );
            }
          },
        },
      ]
    );
  };

  // =====================================================
  // SEND FEEDBACK
  // =====================================================

  const sendFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert(
        "Message Required",
        "Please enter your concern or feedback."
      );
      return;
    }

    setFeedback("");
    setModal(null);

    Alert.alert(
      "Message Sent",
      "Thank you for your feedback. Our support team will review your message."
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor:
              theme.background,
          },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={DARK_RED}
        />

        <View style={styles.loadingContainer}>
          <View style={styles.loadingLogo}>
            <Ionicons
              name="settings-outline"
              size={32}
              color="#FFFFFF"
            />
          </View>

          <ActivityIndicator
            size="small"
            color={PRIMARY}
            style={{
              marginTop: 18,
            }}
          />

          <Text style={styles.loadingText}>
            Loading your settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={DARK_RED}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.smallTitle}>
              TUP-ORDERUP
            </Text>

            <Text style={styles.headerTitle}>
              Settings
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              Manage your account and
              preferences
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="settings-outline"
              size={24}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor:
                theme.card,
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials || "U"}
            </Text>
          </View>

          <View style={styles.profileInfo}>
          <Text
            style={[
              styles.profileName,
              {
                color: theme.text,
              },
            ]}
            numberOfLines={1}
          >
            {capitalizeName(firstName)} {capitalizeName(lastName)}
          </Text>

            <Text
              style={[
                styles.profileEmail,
                {
                  color:
                    theme.secondary,
                },
              ]}
              numberOfLines={1}
            >
              {email || "No email"}
            </Text>

            <View
              style={styles.verifiedRow}
            >
              <Ionicons
                name={
                  user?.accountStatus ===
                  "Approved"
                    ? "checkmark-circle"
                    : "time-outline"
                }
                size={13}
                color={
                  user?.accountStatus ===
                  "Approved"
                    ? "#35A853"
                    : "#E39A18"
                }
              />

              <Text
                style={[
                  styles.verifiedText,
                  {
                    color:
                      user?.accountStatus ===
                      "Approved"
                        ? "#278A45"
                        : "#C47C00",
                  },
                ]}
              >
                {user?.accountStatus ===
                "Approved"
                  ? "Verified Account"
                  : user?.accountStatus ||
                    "Account"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() =>
              setModal("profile")
            }
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={PRIMARY}
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <Text style={styles.sectionTitle}>
          ACCOUNT
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
            },
          ]}
        >
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your account details"
            textColor={theme.text}
            secondaryColor={
              theme.secondary
            }
            onPress={() =>
              setModal("personal")
            }
          />

          <Divider
            color={theme.border}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            title="Account Verification"
            subtitle="View your verification status"
            badge={
              user?.accountStatus ===
              "Approved"
                ? "Verified"
                : user?.accountStatus ||
                  "Pending"
            }
            textColor={theme.text}
            secondaryColor={
              theme.secondary
            }
            onPress={() =>
              setModal("verification")
            }
          />

          <Divider
            color={theme.border}
          />

          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password and account security"
            textColor={theme.text}
            secondaryColor={
              theme.secondary
            }
            onPress={() =>
              setModal("security")
            }
          />
        </View>

        {/* =================================================
            PREFERENCES
        ================================================= */}

        <Text style={styles.sectionTitle}>
          PREFERENCES
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
            },
          ]}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="notifications-outline"
                size={21}
                color={PRIMARY}
              />
            </View>

            <View
              style={styles.settingText}
            >
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Notifications
              </Text>

              <Text
                style={[
                  styles.settingSubtitle,
                  {
                    color:
                      theme.secondary,
                  },
                ]}
              >
                Receive order updates and
                alerts
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value);
              }}
              trackColor={{
                false: "#D7D7D7",
                true: "#E3A5B1",
              }}
              thumbColor={
                notifications
                  ? PRIMARY
                  : "#F4F4F4"
              }
            />
          </View>

          <Divider
            color={theme.border}
          />

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name={
                  darkMode
                    ? "moon"
                    : "moon-outline"
                }
                size={21}
                color={PRIMARY}
              />
            </View>

            <View
              style={styles.settingText}
            >
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Dark Mode
              </Text>

              <Text
                style={[
                  styles.settingSubtitle,
                  {
                    color:
                      theme.secondary,
                  },
                ]}
              >
                Change the app appearance
              </Text>
            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: "#D7D7D7",
                true: "#E3A5B1",
              }}
              thumbColor={
                darkMode
                  ? PRIMARY
                  : "#F4F4F4"
              }
            />
          </View>
        </View>

        {/* =================================================
            SUPPORT
        ================================================= */}

        <Text style={styles.sectionTitle}>
          SUPPORT
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
            },
          ]}
        >
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Find answers to common questions"
            textColor={theme.text}
            secondaryColor={
              theme.secondary
            }
            onPress={() =>
              setModal("help")
            }
          />

          <Divider
            color={theme.border}
          />

          <SettingItem
            icon="chatbubble-ellipses-outline"
            title="Contact Support"
            subtitle="Send feedback or report a problem"
            textColor={theme.text}
            secondaryColor={
              theme.secondary
            }
            onPress={() =>
              setModal("support")
            }
          />

          <Divider
            color={theme.border}
          />

          <SettingItem
            icon="information-circle-outline"
            title="About TUP-OrderUp"
            subtitle="Application information"
            rightText="v1.0.0"
            textColor={theme.text}
            secondaryColor={
              theme.secondary
            }
            onPress={() =>
              setModal("about")
            }
          />
        </View>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color={PRIMARY}
          />

          <Text style={styles.logoutText}>
            Log Out
          </Text>
        </TouchableOpacity>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            TUP-OrderUp
          </Text>

          <Text
            style={styles.footerVersion}
          >
            Version 1.0.0
          </Text>

          <Text
            style={styles.footerCopyright}
          >
            © 2026 TUP-OrderUp
          </Text>
        </View>
      </ScrollView>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      <AppModal
        visible={modal === "profile"}
        onClose={() => setModal(null)}
        title="My Profile"
        subtitle="Update your account information"
        darkMode={darkMode}
      >
        <View style={styles.bigAvatar}>
          <Text
            style={styles.bigAvatarText}
          >
            {initials || "U"}
          </Text>
        </View>

        <Input
          label="FIRST NAME"
          value={firstName}
          onChangeText={setFirstName}
          darkMode={darkMode}
        />

        <Input
          label="LAST NAME"
          value={lastName}
          onChangeText={setLastName}
          darkMode={darkMode}
        />

        <Input
          label="EMAIL"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={false}
          darkMode={darkMode}
        />

        <Input
          label="USERNAME"
          value={username}
          onChangeText={setUsername}
          darkMode={darkMode}
        />

        <PrimaryButton
          title={
            savingProfile
              ? "Saving..."
              : "Save Changes"
          }
          onPress={saveProfile}
          loading={savingProfile}
        />
      </AppModal>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <AppModal
        visible={modal === "personal"}
        onClose={() => setModal(null)}
        title="Personal Information"
        subtitle="Your registered account details"
        darkMode={darkMode}
      >
<InfoRow
  icon="person-outline"
  label="FULL NAME"
  value={`${capitalizeName(user?.firstName)} ${capitalizeName(user?.lastName)}`}
  darkMode={darkMode}
/>

        <InfoRow
          icon="mail-outline"
          label="EMAIL"
          value={
            user?.email ||
            user?.gsfeEmail ||
            user?.gmailEmail ||
            "Not provided"
          }
          darkMode={darkMode}
        />

        <InfoRow
          icon="at-outline"
          label="USERNAME"
          value={`@${
            user?.username || ""
          }`}
          darkMode={darkMode}
        />

        <InfoRow
          icon="school-outline"
          label="ACCOUNT TYPE"
          value={
            user?.role || "User"
          }
          darkMode={darkMode}
        />

        {user?.age !== undefined && (
          <InfoRow
            icon="calendar-outline"
            label="AGE"
            value={`${user.age} years old`}
            darkMode={darkMode}
          />
        )}

        <InfoRow
          icon="checkmark-circle-outline"
          label="ACCOUNT STATUS"
          value={
            user?.accountStatus ||
            "Unknown"
          }
          valueColor={
            user?.accountStatus ===
            "Approved"
              ? "#278A45"
              : "#C47C00"
          }
          darkMode={darkMode}
        />

        <PrimaryButton
          title="Edit Information"
          onPress={() =>
            setModal("profile")
          }
        />
      </AppModal>

      {/* =====================================================
          VERIFICATION
      ===================================================== */}

      <AppModal
        visible={modal === "verification"}
        onClose={() => setModal(null)}
        title="Account Verification"
        subtitle="Your account verification status"
        darkMode={darkMode}
      >
        <View
          style={[
            styles.verificationBox,
            {
              backgroundColor:
                user?.accountStatus ===
                "Approved"
                  ? "#F0FAF3"
                  : "#FFF8E8",
            },
          ]}
        >
          <View
            style={[
              styles.verificationCircle,
              {
                backgroundColor:
                  user?.accountStatus ===
                  "Approved"
                    ? "#35A853"
                    : "#E39A18",
              },
            ]}
          >
            <Ionicons
              name={
                user?.accountStatus ===
                "Approved"
                  ? "checkmark"
                  : "time-outline"
              }
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text
            style={[
              styles.verificationTitle,
              {
                color:
                  user?.accountStatus ===
                  "Approved"
                    ? "#278A45"
                    : "#C47C00",
              },
            ]}
          >
            {user?.accountStatus ===
            "Approved"
              ? "Account Verified"
              : user?.accountStatus ||
                "Verification Pending"}
          </Text>

          <Text
            style={[
              styles.verificationDescription,
              {
                color:
                  user?.accountStatus ===
                  "Approved"
                    ? "#6F806F"
                    : "#8A7750",
              },
            ]}
          >
            {user?.accountStatus ===
            "Approved"
              ? "Your account has been approved and is ready to use."
              : "Your account verification status is currently being processed."}
          </Text>
        </View>

        <InfoRow
          icon="shield-checkmark-outline"
          label="STATUS"
          value={
            user?.accountStatus ||
            "Unknown"
          }
          valueColor={
            user?.accountStatus ===
            "Approved"
              ? "#278A45"
              : "#C47C00"
          }
          darkMode={darkMode}
        />

        <InfoRow
          icon="person-outline"
          label="ACCOUNT TYPE"
          value={
            user?.role || "User"
          }
          darkMode={darkMode}
        />

        {user?.role === "Student" && (
          <InfoRow
            icon="school-outline"
            label="TUP ID NUMBER"
            value={
              user?.tupIdNumber ||
              "Not provided"
            }
            darkMode={darkMode}
          />
        )}

        {user?.role !== "Student" && (
          <>
            <InfoRow
              icon="card-outline"
              label="GOVERNMENT ID"
              value={
                user?.governmentIdType ||
                "Not provided"
              }
              darkMode={darkMode}
            />

            <InfoRow
              icon="document-text-outline"
              label="ID NUMBER"
              value={
                user?.governmentIdNumber ||
                "Not provided"
              }
              darkMode={darkMode}
            />
          </>
        )}
      </AppModal>

      {/* =====================================================
          SECURITY
      ===================================================== */}

      <AppModal
        visible={modal === "security"}
        onClose={() => setModal(null)}
        title="Security"
        subtitle="Keep your account protected"
        darkMode={darkMode}
      >
        <View
          style={[
            styles.securityNotice,
            {
              backgroundColor:
                darkMode
                  ? "#2A171A"
                  : "#FFF5F6",
            },
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={25}
            color={PRIMARY}
          />

          <Text
            style={[
              styles.securityNoticeText,
              {
                color:
                  darkMode
                    ? "#BBBBBB"
                    : "#777777",
              },
            ]}
          >
            Use a strong password with at
            least 8 characters to keep your
            account secure.
          </Text>
        </View>

        <Input
          label="CURRENT PASSWORD"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          darkMode={darkMode}
        />

        <Input
          label="NEW PASSWORD"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          darkMode={darkMode}
        />

        <Input
          label="CONFIRM NEW PASSWORD"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          darkMode={darkMode}
        />

        <PrimaryButton
          title={
            changingPassword
              ? "Updating..."
              : "Update Password"
          }
          onPress={changePassword}
          loading={changingPassword}
        />
      </AppModal>

      {/* =====================================================
          HELP CENTER
      ===================================================== */}

      <AppModal
        visible={modal === "help"}
        onClose={() => setModal(null)}
        title="Help Center"
        subtitle="Frequently asked questions"
        darkMode={darkMode}
      >
        <FAQ
          question="How do I place an order?"
          answer="Go to Home, select Order Food, choose your meal, add it to your cart, and proceed to checkout."
          darkMode={darkMode}
        />

        <FAQ
          question="How can I track my order?"
          answer="Open My Orders to view your current orders and order history."
          darkMode={darkMode}
        />

        <FAQ
          question="Why can't I log in?"
          answer="Only approved accounts can log in. Make sure you are using the correct username and password."
          darkMode={darkMode}
        />

        <FAQ
          question="How do I change my password?"
          answer="Open Settings, select Security, enter your current password, then enter and confirm your new password."
          darkMode={darkMode}
        />

        <FAQ
          question="What if I have a problem with my order?"
          answer="Open Contact Support and send us a detailed message about your concern."
          darkMode={darkMode}
        />
      </AppModal>

      {/* =====================================================
          SUPPORT
      ===================================================== */}

      <AppModal
        visible={modal === "support"}
        onClose={() => setModal(null)}
        title="Contact Support"
        subtitle="We're here to help"
        darkMode={darkMode}
      >
        <Text
          style={[
            styles.modalLabel,
            {
              color:
                darkMode
                  ? "#AAAAAA"
                  : "#777777",
            },
          ]}
        >
          YOUR MESSAGE
        </Text>

        <TextInput
          value={feedback}
          onChangeText={setFeedback}
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor:
                darkMode
                  ? "#292929"
                  : "#FAFAFA",

              borderColor:
                darkMode
                  ? "#3A3A3A"
                  : "#E2E2E2",

              color: darkMode
                ? "#FFFFFF"
                : "#242424",
            },
          ]}
          multiline
          textAlignVertical="top"
          placeholder="Describe your concern or feedback..."
          placeholderTextColor="#999999"
        />

        <PrimaryButton
          title="Send Message"
          onPress={sendFeedback}
        />
      </AppModal>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <AppModal
        visible={modal === "about"}
        onClose={() => setModal(null)}
        title="About TUP-OrderUp"
        subtitle="Campus ordering made easier"
        darkMode={darkMode}
      >
        <View style={styles.aboutLogo}>
          <Ionicons
            name="restaurant"
            size={38}
            color="#FFFFFF"
          />
        </View>

        <Text
          style={[
            styles.aboutTitle,
            {
              color:
                darkMode
                  ? "#FFFFFF"
                  : DARK_RED,
            },
          ]}
        >
          TUP-OrderUp
        </Text>

        <Text
          style={[
            styles.aboutDescription,
            {
              color:
                darkMode
                  ? "#AAAAAA"
                  : "#777777",
            },
          ]}
        >
          TUP-OrderUp is a campus ordering
          system designed to make food
          ordering faster, easier, and more
          convenient for the TUP community.
        </Text>

        <InfoRow
          icon="code-slash-outline"
          label="VERSION"
          value="1.0.0"
          darkMode={darkMode}
        />

        <InfoRow
          icon="calendar-outline"
          label="RELEASE YEAR"
          value="2026"
          darkMode={darkMode}
        />

        <InfoRow
          icon="school-outline"
          label="PLATFORM"
          value="TUP Campus"
          darkMode={darkMode}
        />
      </AppModal>
    </SafeAreaView>
  );
}

// =====================================================
// SETTING ITEM
// =====================================================

function SettingItem({
  icon,
  title,
  subtitle,
  badge,
  rightText,
  textColor,
  secondaryColor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge?: string;
  rightText?: string;
  textColor: string;
  secondaryColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={PRIMARY}
        />
      </View>

      <View style={styles.settingText}>
        <Text
          style={[
            styles.settingTitle,
            {
              color: textColor,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingSubtitle,
            {
              color: secondaryColor,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badge}
          </Text>
        </View>
      )}

      {rightText && (
        <Text style={styles.rightText}>
          {rightText}
        </Text>
      )}

      {!badge && !rightText && (
        <Ionicons
          name="chevron-forward"
          size={19}
          color="#B0B0B0"
        />
      )}
    </TouchableOpacity>
  );
}

// =====================================================
// DIVIDER
// =====================================================

function Divider({
  color,
}: {
  color: string;
}) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
        },
      ]}
    />
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  darkMode = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  editable?: boolean;
  darkMode?: boolean;
}) {
  return (
    <>
      <Text
        style={[
          styles.modalLabel,
          {
            color:
              darkMode
                ? "#AAAAAA"
                : "#777777",
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            backgroundColor:
              darkMode
                ? "#292929"
                : "#FAFAFA",

            borderColor:
              darkMode
                ? "#3A3A3A"
                : "#E2E2E2",

            color: darkMode
              ? "#FFFFFF"
              : "#242424",

            opacity: editable
              ? 1
              : 0.65,
          },
        ]}
        secureTextEntry={
          secureTextEntry
        }
        keyboardType={keyboardType}
        autoCapitalize="none"
        editable={editable}
        placeholderTextColor="#999999"
      />
    </>
  );
}

// =====================================================
// MODAL
// =====================================================

function AppModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  darkMode,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  darkMode: boolean;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalBackground,
            {
              backgroundColor:
                "rgba(0,0,0,0.48)",
            },
          ]}
        >
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor:
                  darkMode
                    ? "#181818"
                    : "#FFFFFF",
              },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                {
                  backgroundColor:
                    darkMode
                      ? "#555555"
                      : "#D5D5D5",
                },
              ]}
            />

            <View
              style={styles.modalHeader}
            >
              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        darkMode
                          ? "#FFFFFF"
                          : "#202124",
                    },
                  ]}
                >
                  {title}
                </Text>

                <Text
                  style={[
                    styles.modalSubtitle,
                    {
                      color:
                        darkMode
                          ? "#999999"
                          : "#888888",
                    },
                  ]}
                >
                  {subtitle}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor:
                      darkMode
                        ? "#292929"
                        : "#F3F3F3",
                  },
                ]}
                onPress={onClose}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={
                    darkMode
                      ? "#FFFFFF"
                      : "#555555"
                  }
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 35,
              }}
            >
              {children}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
  icon,
  label,
  value,
  valueColor,
  darkMode = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
  darkMode?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        {
          borderBottomColor:
            darkMode
              ? "#303030"
              : "#EEEEEE",
        },
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={PRIMARY}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.infoLabel,
            {
              color:
                darkMode
                  ? "#888888"
                  : "#999999",
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.infoValue,
            {
              color:
                valueColor ||
                (darkMode
                  ? "#FFFFFF"
                  : "#242424"),
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// =====================================================
// FAQ
// =====================================================

function FAQ({
  question,
  answer,
  darkMode,
}: {
  question: string;
  answer: string;
  darkMode: boolean;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.faq,
        {
          backgroundColor:
            darkMode
              ? "#292929"
              : "#F8F8F8",
        },
      ]}
      activeOpacity={0.8}
      onPress={() => setOpen(!open)}
    >
      <View
        style={styles.faqHeader}
      >
        <Text
          style={[
            styles.faqQuestion,
            {
              color:
                darkMode
                  ? "#FFFFFF"
                  : "#242424",
            },
          ]}
        >
          {question}
        </Text>

        <Ionicons
          name={
            open
              ? "chevron-up"
              : "chevron-down"
          }
          size={18}
          color="#999999"
        />
      </View>

      {open && (
        <Text
          style={[
            styles.faqAnswer,
            {
              color:
                darkMode
                  ? "#AAAAAA"
                  : "#777777",
            },
          ]}
        >
          {answer}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// =====================================================
// PRIMARY BUTTON
// =====================================================

function PrimaryButton({
  title,
  onPress,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        {
          opacity: loading
            ? 0.7
            : 1,
        },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
        />
      ) : (
        <>
          <Text
            style={
              styles.primaryButtonText
            }
          >
            {title}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
          />
        </>
      )}
    </TouchableOpacity>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingBottom: 40,
  },

  // ===================================================
  // LOADING
  // ===================================================

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingLogo: {
    width: 70,
    height: 70,
    borderRadius: 23,
    backgroundColor: DARK_RED,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#888888",
    fontSize: 12,
    fontWeight: "600",
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    backgroundColor: DARK_RED,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },

  smallTitle: {
    color: "#F6DDE2",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 2,
  },

  headerSubtitle: {
    color: "#F4C8D0",
    fontSize: 11,
    marginTop: 3,
  },

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===================================================
  // PROFILE
  // ===================================================

  profileCard: {
    marginHorizontal: 18,
    marginTop: -14,
    borderRadius: 19,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  avatar: {
    width: 57,
    height: 57,
    borderRadius: 18,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "900",
    color: PRIMARY,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
  },

  profileName: {
    fontSize: 15,
    fontWeight: "800",
    
  },

  profileEmail: {
    fontSize: 11,
    marginTop: 3,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
  },

  // ===================================================
  // SECTIONS
  // ===================================================

  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#858585",
    letterSpacing: 1.2,
    marginTop: 27,
    marginBottom: 9,
    marginHorizontal: 21,
  },

  card: {
    marginHorizontal: 18,
    borderRadius: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  // ===================================================
  // SETTINGS
  // ===================================================

  settingRow: {
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  settingIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 13.5,
    fontWeight: "700",
  },

  settingSubtitle: {
    fontSize: 10.5,
    marginTop: 3,
    lineHeight: 15,
  },

  divider: {
    height: 1,
    marginLeft: 69,
  },

  badge: {
    backgroundColor: "#EAF7EE",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 4,
  },

  badgeText: {
    color: "#278A45",
    fontSize: 9.5,
    fontWeight: "800",
  },

  rightText: {
    color: "#999999",
    fontSize: 10.5,
    marginRight: 3,
  },

  // ===================================================
  // LOGOUT
  // ===================================================

  logoutButton: {
    height: 54,
    marginHorizontal: 18,
    marginTop: 25,
    borderRadius: 16,
    backgroundColor: "#FFF1F3",
    borderWidth: 1,
    borderColor: "#F4D1D7",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },

  // ===================================================
  // FOOTER
  // ===================================================

  footer: {
    alignItems: "center",
    marginTop: 27,
  },

  footerBrand: {
    color: DARK_RED,
    fontSize: 13,
    fontWeight: "800",
  },

  footerVersion: {
    color: "#999999",
    fontSize: 10,
    marginTop: 3,
  },

  footerCopyright: {
    color: "#B0B0B0",
    fontSize: 9.5,
    marginTop: 4,
  },

  // ===================================================
  // MODAL
  // ===================================================

  modalOverlay: {
    flex: 1,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "90%",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  modalHandle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    marginBottom: 17,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: "900",
  },

  modalSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // ===================================================
  // AVATAR
  // ===================================================

  bigAvatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "#FCECEF",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  bigAvatarText: {
    color: PRIMARY,
    fontSize: 25,
    fontWeight: "900",
  },

  // ===================================================
  // INPUT
  // ===================================================

  modalLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 7,
    marginTop: 13,
  },

  input: {
    height: 49,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
  },

  textArea: {
    height: 130,
    paddingTop: 14,
  },

  // ===================================================
  // BUTTON
  // ===================================================

  primaryButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginRight: 8,
  },

  // ===================================================
  // INFO
  // ===================================================

  infoRow: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  infoLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  // ===================================================
  // VERIFICATION
  // ===================================================

  verificationBox: {
    borderRadius: 19,
    padding: 22,
    alignItems: "center",
    marginBottom: 15,
  },

  verificationCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  verificationTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  verificationDescription: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  // ===================================================
  // SECURITY
  // ===================================================

  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 13,
    marginBottom: 8,
  },

  securityNoticeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 10,
  },

  // ===================================================
  // FAQ
  // ===================================================

  faq: {
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
  },

  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
  },

  faqAnswer: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
    paddingRight: 10,
  },

  // ===================================================
  // ABOUT
  // ===================================================

  aboutLogo: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: DARK_RED,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  aboutTitle: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "900",
  },

  aboutDescription: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 15,
  },
});