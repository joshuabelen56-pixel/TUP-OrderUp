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
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   CONFIG
========================================================= */

const API_URL = "https://groove-blend-charity.ngrok-free.dev";

const PRIMARY = "#7D1021";
const DARK_RED = "#5F0C19";
const CARDINAL_SOFT = "#F9ECEF";
const GOLD = "#D8B56A";

const USER_STORAGE_KEY = "@tuporderup_user";

/* =========================================================
   HELPERS
========================================================= */

const capitalizeName = (name?: string) => {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   MAIN SETTINGS
========================================================= */

export default function Settings() {
  /* =======================================================
     GLOBAL THEME
  ======================================================= */

  const {
    darkMode,
    toggleDarkMode,
  } = useTheme();

  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] = useState<User | null>(
    null
  );

  /* =======================================================
     STATES
  ======================================================= */

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

  const [modal, setModal] =
    useState<ModalType>(null);

  /* =======================================================
     PROFILE
  ======================================================= */

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [username, setUsername] =
    useState("");

  /* =======================================================
     PASSWORD
  ======================================================= */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =======================================================
     SUPPORT
  ======================================================= */

  const [feedback, setFeedback] =
    useState("");

  /* =========================================================
     LOAD USER
  ========================================================= */

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
                router.replace("../login"),
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

      /* =====================================================
         LOCAL USER
      ===================================================== */

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
          parsedUser.gmailEmail ||
          ""
      );

      /* =====================================================
         REFRESH FROM SERVER
      ===================================================== */

      try {
        const response = await fetch(
          `${API_URL}/api/users/${parsedUser.id}`
        );

        const data = await response.json();

        if (
          response.ok &&
          data.user
        ) {
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

  /* =========================================================
     THEME COLORS
  ========================================================= */

  const theme = {
    background: darkMode
      ? "#101010"
      : "#F5F6F8",

    card: darkMode
      ? "#1A1A1A"
      : "#FFFFFF",

    text: darkMode
      ? "#FFFFFF"
      : "#202124",

    secondary: darkMode
      ? "#A6A6A6"
      : "#777777",

    border: darkMode
      ? "#2B2B2B"
      : "#E8E8E8",

    softCard: darkMode
      ? "#202020"
      : "#FAFAFA",
  };

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials =
    `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();

  /* =========================================================
     PASSWORD STRENGTH
  ========================================================= */

  const passwordChecks = {
    length:
      newPassword.length >= 8,

    uppercase:
      /[A-Z]/.test(newPassword),

    lowercase:
      /[a-z]/.test(newPassword),

    number:
      /[0-9]/.test(newPassword),

    special:
      /[^A-Za-z0-9]/.test(newPassword),
  };

  const passwordScore =
    Object.values(
      passwordChecks
    ).filter(Boolean).length;

  const passwordStrength =
    newPassword.length === 0
      ? {
          label:
            "Enter a new password",
          color: "#999999",
          progress: 0,
        }
      : passwordScore <= 2
        ? {
            label:
              "Weak password",
            color: "#D64545",
            progress: 0.3,
          }
        : passwordScore === 3
          ? {
              label:
                "Fair password",
              color: "#E39A18",
              progress: 0.5,
            }
          : passwordScore === 4
            ? {
                label:
                  "Good password",
                color: "#4B8D5C",
                progress: 0.75,
              }
            : {
                label:
                  "Strong password",
                color: "#278A45",
                progress: 1,
              };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

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
            firstName:
              capitalizeName(firstName),

            lastName:
              capitalizeName(lastName),

            username:
              username
                .trim()
                .toLowerCase(),
          }),
        }
      );

      const data =
        await response.json();

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
          JSON.stringify(
            data.user
          )
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

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

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

    if (
      currentPassword ===
      newPassword
    ) {
      Alert.alert(
        "Invalid Password",
        "Your new password must be different from your current password."
      );
      return;
    }

    if (passwordScore < 5) {
      Alert.alert(
        "Weak Password",
        "Please create a strong password that meets all the requirements."
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(
        false
      );

      setShowNewPassword(
        false
      );

      setShowConfirmPassword(
        false
      );

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

  /* =========================================================
     LOGOUT
  ========================================================= */

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
              /*
               IMPORTANT:
               Only remove USER SESSION.

               DO NOT clear AsyncStorage,
               so Dark Mode remains saved.
              */

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

              router.replace(
                "../login"
              );
            }
          },
        },
      ]
    );
  };

  /* =========================================================
     SEND FEEDBACK
  ========================================================= */

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

  /* =========================================================
     LOADING
  ========================================================= */

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
          backgroundColor={
            DARK_RED
          }
        />

        <View
          style={
            styles.loadingContainer
          }
        >
          <View
            style={styles.loadingMark}
          >
            <Ionicons
              name="person-outline"
              size={29}
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

          <Text
            style={styles.loadingText}
          >
            Loading settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

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
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.container
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={styles.header}
        >
          <View>
            <Text
              style={
                styles.headerEyebrow
              }
            >
              TUP-ORDERUP
            </Text>

            <Text
              style={
                styles.headerTitle
              }
            >
              Settings
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Account, preferences & support
            </Text>
          </View>

          <View
            style={
              styles.headerAccent
            }
          >
            <View
              style={
                styles.headerAccentLine
              }
            />

            <View
              style={
                styles.headerAccentDot
              }
            />
          </View>
        </View>

        {/* =================================================
            PROFILE
        ================================================= */}

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor:
                theme.card,

              borderColor:
                theme.border,
            },
          ]}
        >
          <View
            style={styles.avatar}
          >
            <Text
              style={
                styles.avatarText
              }
            >
              {initials || "U"}
            </Text>
          </View>

          <View
            style={
              styles.profileInfo
            }
          >
            <Text
              style={[
                styles.profileName,
                {
                  color:
                    theme.text,
                },
              ]}
              numberOfLines={1}
            >
              {capitalizeName(
                firstName
              )}{" "}
              {capitalizeName(
                lastName
              )}
            </Text>

            <Text
              style={[
                styles.profileUsername,
                {
                  color:
                    theme.secondary,
                },
              ]}
              numberOfLines={1}
            >
              @{username || "user"}
            </Text>

            <View
              style={
                styles.accountStatusRow
              }
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      user?.accountStatus ===
                      "Approved"
                        ? "#35A853"
                        : "#E39A18",
                  },
                ]}
              />

              <Text
                style={[
                  styles.accountStatusText,
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
            style={
              styles.editButton
            }
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

        <SectionHeader title="ACCOUNT" />

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,

              borderColor:
                theme.border,
            },
          ]}
        >
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your personal details"
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
            subtitle="Check your verification status"
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
              setModal(
                "verification"
              )
            }
          />

          <Divider
            color={theme.border}
          />

          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password and account protection"
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

        <SectionHeader
          title="PREFERENCES"
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,

              borderColor:
                theme.border,
            },
          ]}
        >
          <PreferenceRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Order updates and important alerts"
            value={
              notifications
            }
            onValueChange={
              setNotifications
            }
            darkMode={
              darkMode
            }
          />

          <Divider
            color={theme.border}
          />

          <PreferenceRow
            icon={
              darkMode
                ? "moon"
                : "moon-outline"
            }
            title="Dark Mode"
            subtitle="Use a darker app appearance"
            value={
              darkMode
            }
            onValueChange={
              toggleDarkMode
            }
            darkMode={
              darkMode
            }
          />
        </View>

        {/* =================================================
            SUPPORT
        ================================================= */}

        <SectionHeader
          title="SUPPORT & INFORMATION"
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,

              borderColor:
                theme.border,
            },
          ]}
        >
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Answers to common questions"
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
          style={
            styles.logoutButton
          }
          activeOpacity={0.8}
          onPress={
            handleLogout
          }
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={PRIMARY}
          />

          <Text
            style={
              styles.logoutText
            }
          >
            Log Out
          </Text>
        </TouchableOpacity>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View
          style={styles.footer}
        >
          <View
            style={styles.footerLine}
          />

          <Text
            style={
              styles.footerBrand
            }
          >
            TUP-ORDERUP
          </Text>

          <Text
            style={
              styles.footerUniversity
            }
          >
            TECHNOLOGICAL UNIVERSITY OF THE
            PHILIPPINES
          </Text>

          <Text
            style={
              styles.footerVersion
            }
          >
            Version 1.0.0 • 2026
          </Text>
        </View>
      </ScrollView>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      <AppModal
        visible={
          modal === "profile"
        }
        onClose={() =>
          setModal(null)
        }
        title="My Profile"
        subtitle="Update your account information"
        darkMode={
          darkMode
        }
      >
        <View
          style={styles.bigAvatar}
        >
          <Text
            style={
              styles.bigAvatarText
            }
          >
            {initials || "U"}
          </Text>
        </View>

        <Input
          label="FIRST NAME"
          value={firstName}
          onChangeText={
            setFirstName
          }
          darkMode={
            darkMode
          }
        />

        <Input
          label="LAST NAME"
          value={lastName}
          onChangeText={
            setLastName
          }
          darkMode={
            darkMode
          }
        />

        <Input
          label="EMAIL"
          value={email}
          onChangeText={
            setEmail
          }
          keyboardType="email-address"
          editable={false}
          darkMode={
            darkMode
          }
        />

        <Input
          label="USERNAME"
          value={username}
          onChangeText={
            setUsername
          }
          darkMode={
            darkMode
          }
        />

        <PrimaryButton
          title={
            savingProfile
              ? "Saving..."
              : "Save Changes"
          }
          onPress={
            saveProfile
          }
          loading={
            savingProfile
          }
        />
      </AppModal>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <AppModal
        visible={
          modal === "personal"
        }
        onClose={() =>
          setModal(null)
        }
        title="Personal Information"
        subtitle="Your registered account details"
        darkMode={
          darkMode
        }
      >
        <InfoRow
          icon="person-outline"
          label="FULL NAME"
          value={`${capitalizeName(
            user?.firstName
          )} ${capitalizeName(
            user?.lastName
          )}`}
          darkMode={
            darkMode
          }
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
          darkMode={
            darkMode
          }
        />

        <InfoRow
          icon="at-outline"
          label="USERNAME"
          value={`@${
            user?.username ||
            ""
          }`}
          darkMode={
            darkMode
          }
        />

        <InfoRow
          icon="school-outline"
          label="ACCOUNT TYPE"
          value={
            user?.role ||
            "User"
          }
          darkMode={
            darkMode
          }
        />

        {user?.age !==
          undefined && (
          <InfoRow
            icon="calendar-outline"
            label="AGE"
            value={`${user.age} years old`}
            darkMode={
              darkMode
            }
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
          darkMode={
            darkMode
          }
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
        visible={
          modal === "verification"
        }
        onClose={() =>
          setModal(null)
        }
        title="Account Verification"
        subtitle="Your verification status"
        darkMode={
          darkMode
        }
      >
        <View
          style={[
            styles.verificationBox,
            {
              backgroundColor:
                user?.accountStatus ===
                "Approved"
                  ? darkMode
                    ? "#14251A"
                    : "#F0FAF3"
                  : darkMode
                    ? "#2A2112"
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
              size={32}
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
                  darkMode
                    ? "#AAAAAA"
                    : "#777777",
              },
            ]}
          >
            {user?.accountStatus ===
            "Approved"
              ? "Your account has been approved and is ready to use."
              : "Your account verification is currently being processed."}
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
          darkMode={
            darkMode
          }
        />

        <InfoRow
          icon="person-outline"
          label="ACCOUNT TYPE"
          value={
            user?.role ||
            "User"
          }
          darkMode={
            darkMode
          }
        />

        {user?.role ===
          "Student" && (
          <InfoRow
            icon="school-outline"
            label="TUP ID NUMBER"
            value={
              user?.tupIdNumber ||
              "Not provided"
            }
            darkMode={
              darkMode
            }
          />
        )}

        {user?.role !==
          "Student" && (
          <>
            <InfoRow
              icon="card-outline"
              label="GOVERNMENT ID"
              value={
                user?.governmentIdType ||
                "Not provided"
              }
              darkMode={
                darkMode
              }
            />

            <InfoRow
              icon="document-text-outline"
              label="ID NUMBER"
              value={
                user?.governmentIdNumber ||
                "Not provided"
              }
              darkMode={
                darkMode
              }
            />
          </>
        )}
      </AppModal>

      {/* =====================================================
          SECURITY
      ===================================================== */}

      <AppModal
        visible={
          modal === "security"
        }
        onClose={() => {
          setModal(null);

          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");

          setShowCurrentPassword(
            false
          );

          setShowNewPassword(
            false
          );

          setShowConfirmPassword(
            false
          );
        }}
        title="Security"
        subtitle="Keep your account protected"
        darkMode={
          darkMode
        }
      >
        {/* =================================================
            SECURITY NOTICE
        ================================================= */}

        <View
          style={[
            styles.securityNotice,
            {
              backgroundColor:
                darkMode
                  ? "#2A171A"
                  : CARDINAL_SOFT,
            },
          ]}
        >
          <View
            style={
              styles.securityIcon
            }
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color={PRIMARY}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={[
                styles.securityNoticeTitle,
                {
                  color:
                    darkMode
                      ? "#FFFFFF"
                      : DARK_RED,
                },
              ]}
            >
              Strong password required
            </Text>

            <Text
              style={[
                styles.securityNoticeText,
                {
                  color:
                    darkMode
                      ? "#BBBBBB"
                      : "#707070",
                },
              ]}
            >
              Create a strong password to keep
              your TUP-OrderUp account secure.
            </Text>
          </View>
        </View>

        {/* =================================================
            CURRENT PASSWORD
        ================================================= */}

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
          CURRENT PASSWORD
        </Text>

        <View
          style={[
            styles.passwordInputWrapper,
            {
              backgroundColor:
                darkMode
                  ? "#292929"
                  : "#FAFAFA",

              borderColor:
                darkMode
                  ? "#3A3A3A"
                  : "#E2E2E2",
            },
          ]}
        >
          <TextInput
            value={
              currentPassword
            }
            onChangeText={
              setCurrentPassword
            }
            secureTextEntry={
              !showCurrentPassword
            }
            style={[
              styles.passwordInput,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#242424",
              },
            ]}
            autoCapitalize="none"
            placeholder="Enter your current password"
            placeholderTextColor="#999999"
          />

          <TouchableOpacity
            style={
              styles.passwordEye
            }
            activeOpacity={0.7}
            onPress={() =>
              setShowCurrentPassword(
                !showCurrentPassword
              )
            }
          >
            <Ionicons
              name={
                showCurrentPassword
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={20}
              color="#999999"
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            NEW PASSWORD
        ================================================= */}

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
          NEW PASSWORD
        </Text>

        <View
          style={[
            styles.passwordInputWrapper,
            {
              backgroundColor:
                darkMode
                  ? "#292929"
                  : "#FAFAFA",

              borderColor:
                newPassword.length >
                0
                  ? passwordStrength.color
                  : darkMode
                    ? "#3A3A3A"
                    : "#E2E2E2",
            },
          ]}
        >
          <TextInput
            value={
              newPassword
            }
            onChangeText={
              setNewPassword
            }
            secureTextEntry={
              !showNewPassword
            }
            style={[
              styles.passwordInput,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#242424",
              },
            ]}
            autoCapitalize="none"
            placeholder="Create a strong password"
            placeholderTextColor="#999999"
          />

          <TouchableOpacity
            style={
              styles.passwordEye
            }
            activeOpacity={0.7}
            onPress={() =>
              setShowNewPassword(
                !showNewPassword
              )
            }
          >
            <Ionicons
              name={
                showNewPassword
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={20}
              color="#999999"
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            PASSWORD STRENGTH
        ================================================= */}

        {newPassword.length >
          0 && (
          <View
            style={
              styles.passwordStrengthContainer
            }
          >
            <View
              style={
                styles.passwordStrengthHeader
              }
            >
              <Text
                style={[
                  styles.passwordStrengthLabel,
                  {
                    color:
                      passwordStrength.color,
                  },
                ]}
              >
                {
                  passwordStrength.label
                }
              </Text>

              <Text
                style={[
                  styles.passwordStrengthPercent,
                  {
                    color:
                      passwordStrength.color,
                  },
                ]}
              >
                {Math.round(
                  passwordStrength.progress *
                    100
                )}
                %
              </Text>
            </View>

            <View
              style={[
                styles.passwordProgressBackground,
                {
                  backgroundColor:
                    darkMode
                      ? "#343434"
                      : "#E8E8E8",
                },
              ]}
            >
              <View
                style={[
                  styles.passwordProgressFill,
                  {
                    width: `${passwordStrength.progress * 100}%`,
                    backgroundColor:
                      passwordStrength.color,
                  },
                ]}
              />
            </View>

            <View
              style={
                styles.passwordRequirements
              }
            >
              <PasswordRequirement
                label="At least 8 characters"
                valid={
                  passwordChecks.length
                }
                darkMode={
                  darkMode
                }
              />

              <PasswordRequirement
                label="One uppercase letter"
                valid={
                  passwordChecks.uppercase
                }
                darkMode={
                  darkMode
                }
              />

              <PasswordRequirement
                label="One lowercase letter"
                valid={
                  passwordChecks.lowercase
                }
                darkMode={
                  darkMode
                }
              />

              <PasswordRequirement
                label="One number"
                valid={
                  passwordChecks.number
                }
                darkMode={
                  darkMode
                }
              />

              <PasswordRequirement
                label="One special character"
                valid={
                  passwordChecks.special
                }
                darkMode={
                  darkMode
                }
              />
            </View>
          </View>
        )}

        {/* =================================================
            CONFIRM PASSWORD
        ================================================= */}

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
          CONFIRM NEW PASSWORD
        </Text>

        <View
          style={[
            styles.passwordInputWrapper,
            {
              backgroundColor:
                darkMode
                  ? "#292929"
                  : "#FAFAFA",

              borderColor:
                confirmPassword.length >
                0
                  ? confirmPassword ===
                    newPassword
                    ? "#35A853"
                    : "#D64545"
                  : darkMode
                    ? "#3A3A3A"
                    : "#E2E2E2",
            },
          ]}
        >
          <TextInput
            value={
              confirmPassword
            }
            onChangeText={
              setConfirmPassword
            }
            secureTextEntry={
              !showConfirmPassword
            }
            style={[
              styles.passwordInput,
              {
                color:
                  darkMode
                    ? "#FFFFFF"
                    : "#242424",
              },
            ]}
            autoCapitalize="none"
            placeholder="Confirm your new password"
            placeholderTextColor="#999999"
          />

          <TouchableOpacity
            style={
              styles.passwordEye
            }
            activeOpacity={0.7}
            onPress={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            <Ionicons
              name={
                showConfirmPassword
                  ? "eye-outline"
                  : "eye-off-outline"
              }
              size={20}
              color="#999999"
            />
          </TouchableOpacity>
        </View>

        {confirmPassword.length >
          0 && (
          <View
            style={
              styles.confirmPasswordStatus
            }
          >
            <Ionicons
              name={
                confirmPassword ===
                newPassword
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={15}
              color={
                confirmPassword ===
                newPassword
                  ? "#278A45"
                  : "#D64545"
              }
            />

            <Text
              style={[
                styles.confirmPasswordText,
                {
                  color:
                    confirmPassword ===
                    newPassword
                      ? "#278A45"
                      : "#D64545",
                },
              ]}
            >
              {confirmPassword ===
              newPassword
                ? "Passwords match"
                : "Passwords do not match"}
            </Text>
          </View>
        )}

        <PrimaryButton
          title={
            changingPassword
              ? "Updating..."
              : "Update Password"
          }
          onPress={
            changePassword
          }
          loading={
            changingPassword
          }
        />
      </AppModal>

      {/* =====================================================
          HELP CENTER
      ===================================================== */}

      <AppModal
        visible={
          modal === "help"
        }
        onClose={() =>
          setModal(null)
        }
        title="Help Center"
        subtitle="Frequently asked questions"
        darkMode={
          darkMode
        }
      >
        <FAQ
          question="How do I place an order?"
          answer="Go to Home, select Order Food, choose your meal, add it to your cart, and proceed to checkout."
          darkMode={
            darkMode
          }
        />

        <FAQ
          question="How can I track my order?"
          answer="Open My Orders to view your current orders and order history."
          darkMode={
            darkMode
          }
        />

        <FAQ
          question="Why can't I log in?"
          answer="Only approved accounts can log in. Make sure you are using the correct username and password."
          darkMode={
            darkMode
          }
        />

        <FAQ
          question="How do I change my password?"
          answer="Open Settings, select Security, enter your current password, then create and confirm a strong new password."
          darkMode={
            darkMode
          }
        />

        <FAQ
          question="What if I have a problem with my order?"
          answer="Open Contact Support and send us a detailed message about your concern."
          darkMode={
            darkMode
          }
        />
      </AppModal>

      {/* =====================================================
          SUPPORT
      ===================================================== */}

      <AppModal
        visible={
          modal === "support"
        }
        onClose={() =>
          setModal(null)
        }
        title="Contact Support"
        subtitle="We're here to help"
        darkMode={
          darkMode
        }
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
          onChangeText={
            setFeedback
          }
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

              color:
                darkMode
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
          onPress={
            sendFeedback
          }
        />
      </AppModal>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <AppModal
        visible={
          modal === "about"
        }
        onClose={() =>
          setModal(null)
        }
        title="About TUP-OrderUp"
        subtitle="Campus ordering made easier"
        darkMode={
          darkMode
        }
      >
        <View
          style={styles.aboutMark}
        >
          <Text
            style={
              styles.aboutMarkText
            }
          >
            T
          </Text>
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
            styles.aboutUniversity,
            {
              color:
                darkMode
                  ? "#B5B5B5"
                  : "#777777",
            },
          ]}
        >
          TECHNOLOGICAL UNIVERSITY OF THE
          PHILIPPINES
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
          darkMode={
            darkMode
          }
        />

        <InfoRow
          icon="calendar-outline"
          label="RELEASE YEAR"
          value="2026"
          darkMode={
            darkMode
          }
        />

        <InfoRow
          icon="school-outline"
          label="PLATFORM"
          value="TUP Campus"
          darkMode={
            darkMode
          }
        />
      </AppModal>
    </SafeAreaView>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
}: {
  title: string;
}) {
  return (
    <View
      style={
        styles.sectionHeader
      }
    >
      <Text
        style={
          styles.sectionTitle
        }
      >
        {title}
      </Text>

      <View
        style={
          styles.sectionLine
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
      style={
        styles.settingRow
      }
      activeOpacity={0.72}
      onPress={onPress}
    >
      <View
        style={
          styles.settingIcon
        }
      >
        <Ionicons
          name={icon}
          size={21}
          color={PRIMARY}
        />
      </View>

      <View
        style={
          styles.settingText
        }
      >
        <Text
          style={[
            styles.settingTitle,
            {
              color:
                textColor,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingSubtitle,
            {
              color:
                secondaryColor,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {badge && (
        <View
          style={
            styles.badge
          }
        >
          <Text
            style={
              styles.badgeText
            }
          >
            {badge}
          </Text>
        </View>
      )}

      {rightText && (
        <Text
          style={
            styles.rightText
          }
        >
          {rightText}
        </Text>
      )}

      {!badge &&
        !rightText && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#B3B3B3"
          />
        )}
    </TouchableOpacity>
  );
}

/* =========================================================
   PREFERENCE ROW
========================================================= */

function PreferenceRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  darkMode,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (
    value: boolean
  ) => void;
  darkMode: boolean;
}) {
  return (
    <View
      style={
        styles.settingRow
      }
    >
      <View
        style={
          styles.settingIcon
        }
      >
        <Ionicons
          name={icon}
          size={21}
          color={PRIMARY}
        />
      </View>

      <View
        style={
          styles.settingText
        }
      >
        <Text
          style={[
            styles.settingTitle,
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
            styles.settingSubtitle,
            {
              color:
                darkMode
                  ? "#9D9D9D"
                  : "#777777",
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
        trackColor={{
          false: "#D5D5D5",
          true: "#D9A6AF",
        }}
        thumbColor={
          value
            ? PRIMARY
            : "#F5F5F5"
        }
      />
    </View>
  );
}

/* =========================================================
   DIVIDER
========================================================= */

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
          backgroundColor:
            color,
        },
      ]}
    />
  );
}

/* =========================================================
   INPUT
========================================================= */

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
  onChangeText: (
    text: string
  ) => void;
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
        onChangeText={
          onChangeText
        }
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

            color:
              darkMode
                ? "#FFFFFF"
                : "#242424",

            opacity: editable
              ? 1
              : 0.6,
          },
        ]}
        secureTextEntry={
          secureTextEntry
        }
        keyboardType={
          keyboardType
        }
        autoCapitalize="none"
        editable={editable}
        placeholderTextColor="#999999"
      />
    </>
  );
}

/* =========================================================
   MODAL
========================================================= */

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
      onRequestClose={
        onClose
      }
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        style={
          styles.modalOverlay
        }
      >
        <View
          style={
            styles.modalBackground
          }
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
              style={
                styles.modalHeader
              }
            >
              <View
                style={{
                  flex: 1,
                }}
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
                activeOpacity={
                  0.75
                }
                onPress={
                  onClose
                }
              >
                <Ionicons
                  name="close"
                  size={21}
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

/* =========================================================
   INFO ROW
========================================================= */

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
      <View
        style={
          styles.infoIcon
        }
      >
        <Ionicons
          name={icon}
          size={20}
          color={PRIMARY}
        />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
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

/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

function PasswordRequirement({
  label,
  valid,
  darkMode,
}: {
  label: string;
  valid: boolean;
  darkMode: boolean;
}) {
  return (
    <View
      style={
        styles.passwordRequirementRow
      }
    >
      <Ionicons
        name={
          valid
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={15}
        color={
          valid
            ? "#278A45"
            : darkMode
              ? "#666666"
              : "#B5B5B5"
        }
      />

      <Text
        style={[
          styles.passwordRequirementText,
          {
            color: valid
              ? "#278A45"
              : darkMode
                ? "#999999"
                : "#888888",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   FAQ
========================================================= */

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

          borderColor:
            darkMode
              ? "#363636"
              : "#EEEEEE",
        },
      ]}
      activeOpacity={0.8}
      onPress={() =>
        setOpen(!open)
      }
    >
      <View
        style={
          styles.faqHeader
        }
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

/* =========================================================
   PRIMARY BUTTON
========================================================= */

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
          opacity:
            loading
              ? 0.7
              : 1,
        },
      ]}
      activeOpacity={
        0.85
      }
      onPress={onPress}
      disabled={
        loading
      }
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

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     SAFE AREA
  ======================================================= */

  safeArea: {
    flex: 1,
  },

  container: {
    paddingBottom: 35,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {
    flex: 1,
    justifyContent:
      "center",
    alignItems:
      "center",
  },

  loadingMark: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor:
      DARK_RED,
    justifyContent:
      "center",
    alignItems:
      "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#888888",
    fontSize: 12,
    fontWeight:
      "600",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    backgroundColor:
      DARK_RED,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 32,

    flexDirection:
      "row",

    alignItems:
      "flex-end",

    justifyContent:
      "space-between",

    borderBottomLeftRadius:
      28,

    borderBottomRightRadius:
      28,
  },

  headerEyebrow: {
    color:
      "#E7C4CA",
    fontSize: 9,
    fontWeight:
      "800",
    letterSpacing: 2,
  },

  headerTitle: {
    color:
      "#FFFFFF",
    fontSize: 30,
    fontWeight:
      "900",
    marginTop: 4,
  },

  headerSubtitle: {
    color:
      "#E9BDC5",
    fontSize: 11,
    marginTop: 3,
  },

  headerAccent: {
    width: 38,
    height: 38,
    justifyContent:
      "center",
    alignItems:
      "center",
    marginBottom: 3,
  },

  headerAccentLine: {
    width: 26,
    height: 2,
    backgroundColor:
      GOLD,
    marginBottom: 6,
  },

  headerAccentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      GOLD,
  },

  /* =======================================================
     PROFILE
  ======================================================= */

  profileCard: {
    marginHorizontal: 18,
    marginTop: -16,
    borderRadius: 20,
    padding: 16,

    flexDirection:
      "row",

    alignItems:
      "center",

    borderWidth: 1,

    shadowColor:
      "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity:
      0.07,

    shadowRadius:
      9,

    elevation: 3,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,

    backgroundColor:
      CARDINAL_SOFT,

    justifyContent:
      "center",

    alignItems:
      "center",

    borderWidth: 1,

    borderColor:
      "#F0D7DC",
  },

  avatarText: {
    color:
      PRIMARY,
    fontSize: 18,
    fontWeight:
      "900",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
  },

  profileName: {
    fontSize: 15,
    fontWeight:
      "900",
  },

  profileUsername: {
    fontSize: 10.5,
    marginTop: 2,
  },

  accountStatusRow: {
    flexDirection:
      "row",

    alignItems:
      "center",

    marginTop: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  accountStatusText: {
    fontSize: 9.5,
    fontWeight:
      "800",
    marginLeft: 5,
  },

  editButton: {
    width: 39,
    height: 39,
    borderRadius: 12,

    backgroundColor:
      CARDINAL_SOFT,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    marginTop: 27,
    marginBottom: 9,
    marginHorizontal: 21,

    flexDirection:
      "row",

    alignItems:
      "center",
  },

  sectionTitle: {
    fontSize: 10.5,
    fontWeight:
      "900",
    color:
      "#858585",
    letterSpacing:
      1.3,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor:
      "#E3E3E3",
    marginLeft: 10,
  },

  /* =======================================================
     CARD
  ======================================================= */

  card: {
    marginHorizontal: 18,
    borderRadius: 18,
    overflow:
      "hidden",

    borderWidth: 1,

    shadowColor:
      "#000000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity:
      0.035,

    shadowRadius:
      6,

    elevation: 2,
  },

  /* =======================================================
     SETTING ROW
  ======================================================= */

  settingRow: {
    minHeight: 68,

    paddingHorizontal: 14,
    paddingVertical: 10,

    flexDirection:
      "row",

    alignItems:
      "center",
  },

  settingIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,

    backgroundColor:
      CARDINAL_SOFT,

    justifyContent:
      "center",

    alignItems:
      "center",

    marginRight: 12,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 13.5,
    fontWeight:
      "800",
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
    backgroundColor:
      "#EAF7EE",

    borderRadius: 8,

    paddingHorizontal: 9,
    paddingVertical: 5,

    marginRight: 4,
  },

  badgeText: {
    color:
      "#278A45",
    fontSize: 9.5,
    fontWeight:
      "800",
  },

  rightText: {
    color:
      "#999999",
    fontSize: 10.5,
    marginRight: 3,
  },

  /* =======================================================
     LOGOUT
  ======================================================= */

  logoutButton: {
    height: 54,

    marginHorizontal: 18,
    marginTop: 25,

    borderRadius: 16,

    backgroundColor:
      "#FFF4F5",

    borderWidth: 1,

    borderColor:
      "#EECFD4",

    flexDirection:
      "row",

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  logoutText: {
    color:
      PRIMARY,
    fontSize: 14,
    fontWeight:
      "900",
    marginLeft: 8,
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    alignItems:
      "center",
    marginTop: 28,
  },

  footerLine: {
    width: 35,
    height: 2,
    backgroundColor:
      GOLD,
    borderRadius: 2,
    marginBottom: 10,
  },

  footerBrand: {
    color:
      DARK_RED,
    fontSize: 13,
    fontWeight:
      "900",
    letterSpacing:
      1.1,
  },

  footerUniversity: {
    color:
      "#8C8C8C",
    fontSize: 7.5,
    fontWeight:
      "700",
    letterSpacing:
      0.4,

    marginTop: 4,

    textAlign:
      "center",
  },

  footerVersion: {
    color:
      "#B0B0B0",
    fontSize: 9,
    marginTop: 5,
  },

  /* =======================================================
     MODAL
  ======================================================= */

  modalOverlay: {
    flex: 1,
  },

  modalBackground: {
    flex: 1,

    justifyContent:
      "flex-end",

    backgroundColor:
      "rgba(0,0,0,0.45)",
  },

  modalSheet: {
    borderTopLeftRadius:
      29,

    borderTopRightRadius:
      29,

    maxHeight:
      "91%",

    paddingHorizontal:
      20,

    paddingTop:
      10,
  },

  modalHandle: {
    alignSelf:
      "center",

    width: 42,
    height: 5,

    borderRadius: 3,

    marginBottom: 17,
  },

  modalHeader: {
    flexDirection:
      "row",

    alignItems:
      "center",

    marginBottom:
      20,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight:
      "900",
  },

  modalSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 12,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  /* =======================================================
     AVATAR
  ======================================================= */

  bigAvatar: {
    width: 82,
    height: 82,

    borderRadius: 26,

    backgroundColor:
      CARDINAL_SOFT,

    alignSelf:
      "center",

    justifyContent:
      "center",

    alignItems:
      "center",

    marginBottom: 23,
  },

  bigAvatarText: {
    color:
      PRIMARY,

    fontSize: 26,

    fontWeight:
      "900",
  },

  /* =======================================================
     INPUT
  ======================================================= */

  modalLabel: {
    fontSize: 10,

    fontWeight:
      "900",

    letterSpacing:
      1,

    marginBottom:
      7,

    marginTop:
      13,
  },

  input: {
    height: 49,

    borderRadius:
      13,

    borderWidth:
      1,

    paddingHorizontal:
      14,

    fontSize:
      13,
  },

  textArea: {
    height: 130,
    paddingTop: 14,
  },

  /* =======================================================
     PASSWORD
  ======================================================= */

  passwordInputWrapper: {
    height: 49,

    borderRadius:
      13,

    borderWidth:
      1,

    flexDirection:
      "row",

    alignItems:
      "center",
  },

  passwordInput: {
    flex: 1,

    height:
      "100%",

    paddingHorizontal:
      14,

    fontSize:
      13,
  },

  passwordEye: {
    width: 45,
    height: 49,

    justifyContent:
      "center",

    alignItems:
      "center",
  },

  passwordStrengthContainer: {
    marginTop: 10,
    marginBottom: 4,
  },

  passwordStrengthHeader: {
    flexDirection:
      "row",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    marginBottom: 6,
  },

  passwordStrengthLabel: {
    fontSize: 10.5,
    fontWeight:
      "800",
  },

  passwordStrengthPercent: {
    fontSize: 10,
    fontWeight:
      "800",
  },

  passwordProgressBackground: {
    height: 6,

    borderRadius:
      3,

    overflow:
      "hidden",
  },

  passwordProgressFill: {
    height:
      "100%",

    borderRadius:
      3,
  },

  passwordRequirements: {
    marginTop: 10,
    gap: 5,
  },

  passwordRequirementRow: {
    flexDirection:
      "row",

    alignItems:
      "center",
  },

  passwordRequirementText: {
    fontSize: 10.5,
    marginLeft: 6,
  },

  confirmPasswordStatus: {
    flexDirection:
      "row",

    alignItems:
      "center",

    marginTop: 7,
  },

  confirmPasswordText: {
    fontSize: 10.5,

    fontWeight:
      "700",

    marginLeft: 5,
  },

  /* =======================================================
     BUTTON
  ======================================================= */

  primaryButton: {
    height: 52,

    borderRadius:
      15,

    backgroundColor:
      PRIMARY,

    flexDirection:
      "row",

    alignItems:
      "center",

    justifyContent:
      "center",

    marginTop:
      24,
  },

  primaryButtonText: {
    color:
      "#FFFFFF",

    fontSize:
      14,

    fontWeight:
      "900",

    marginRight:
      8,
  },

  /* =======================================================
     INFO
  ======================================================= */

  infoRow: {
    minHeight:
      65,

    flexDirection:
      "row",

    alignItems:
      "center",

    borderBottomWidth:
      1,
  },

  infoIcon: {
    width: 42,
    height: 42,

    borderRadius:
      13,

    backgroundColor:
      CARDINAL_SOFT,

    justifyContent:
      "center",

    alignItems:
      "center",

    marginRight:
      13,
  },

  infoLabel: {
    fontSize:
      9.5,

    fontWeight:
      "800",

    letterSpacing:
      0.6,
  },

  infoValue: {
    fontSize:
      13,

    fontWeight:
      "700",

    marginTop:
      3,
  },

  /* =======================================================
     VERIFICATION
  ======================================================= */

  verificationBox: {
    borderRadius:
      19,

    padding:
      22,

    alignItems:
      "center",

    marginBottom:
      15,
  },

  verificationCircle: {
    width:
      64,

    height:
      64,

    borderRadius:
      32,

    justifyContent:
      "center",

    alignItems:
      "center",

    marginBottom:
      12,
  },

  verificationTitle: {
    fontSize:
      18,

    fontWeight:
      "900",
  },

  verificationDescription: {
    textAlign:
      "center",

    fontSize:
      11,

    lineHeight:
      17,

    marginTop:
      6,
  },

  /* =======================================================
     SECURITY
  ======================================================= */

  securityNotice: {
    flexDirection:
      "row",

    alignItems:
      "center",

    borderRadius:
      15,

    padding:
      13,

    marginBottom:
      8,
  },

  securityIcon: {
    width:
      38,

    height:
      38,

    borderRadius:
      12,

    backgroundColor:
      "#FFFFFF",

    justifyContent:
      "center",

    alignItems:
      "center",

    marginRight:
      10,
  },

  securityNoticeTitle: {
    fontSize:
      11.5,

    fontWeight:
      "900",

    marginBottom:
      2,
  },

  securityNoticeText: {
    fontSize:
      10.5,

    lineHeight:
      15,
  },

  /* =======================================================
     FAQ
  ======================================================= */

  faq: {
    borderRadius:
      14,

    borderWidth:
      1,

    padding:
      15,

    marginBottom:
      10,
  },

  faqHeader: {
    flexDirection:
      "row",

    alignItems:
      "center",
  },

  faqQuestion: {
    flex: 1,

    fontSize:
      13,

    fontWeight:
      "800",
  },

  faqAnswer: {
    fontSize:
      11,

    lineHeight:
      17,

    marginTop:
      10,

    paddingRight:
      10,
  },

  /* =======================================================
     ABOUT
  ======================================================= */

  aboutMark: {
    width:
      78,

    height:
      78,

    borderRadius:
      24,

    backgroundColor:
      DARK_RED,

    alignSelf:
      "center",

    justifyContent:
      "center",

    alignItems:
      "center",

    marginBottom:
      13,
  },

  aboutMarkText: {
    color:
      "#FFFFFF",

    fontSize:
      35,

    fontWeight:
      "900",
  },

  aboutTitle: {
    textAlign:
      "center",

    fontSize:
      23,

    fontWeight:
      "900",
  },

  aboutUniversity: {
    textAlign:
      "center",

    fontSize:
      8,

    fontWeight:
      "700",

    letterSpacing:
      0.5,

    marginTop:
      4,
  },

  aboutDescription: {
    textAlign:
      "center",

    fontSize:
      11,

    lineHeight:
      18,

    marginTop:
      10,

    marginBottom:
      15,
  },
});