import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

/* =================================================
   STORAGE
================================================= */

const USER_STORAGE_KEY = "@tuporderup_user";
const SECURITY_PENDING_KEY =
  "@tuporderup_security_pending";

/* =================================================
   TYPES
================================================= */

type LoginUser = {
  id: string;
  _id?: string;

  firstName: string;
  lastName: string;

  username: string;

  email?: string | null;
  gsfeEmail?: string | null;
  gmailEmail?: string | null;

  role?: string;
  accountType?: string;

  tupIdNumber?: string | null;

  governmentIdType?: string | null;
  governmentIdNumber?: string | null;

  accountStatus?: string;
};

/* =================================================
   SECURITY SCREEN
================================================= */

export default function SecurityScreen() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [biometricType, setBiometricType] =
    useState("Fingerprint");

  const [user, setUser] =
    useState<LoginUser | null>(null);

  /* =================================================
     LOAD USER + CHECK BIOMETRIC
  ================================================= */

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      setChecking(true);

      /* =============================================
         GET LOGGED-IN USER
      ============================================= */

      const storedUser =
        await AsyncStorage.getItem(
          USER_STORAGE_KEY
        );

      if (!storedUser) {
        Alert.alert(
          "Session Error",
          "No logged-in account was found.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/login");
              },
            },
          ],
          {
            cancelable: false,
          }
        );

        return;
      }

      let parsedUser: LoginUser;

      try {
        parsedUser =
          JSON.parse(storedUser);
      } catch (error) {
        console.error(
          "USER JSON PARSE ERROR:",
          error
        );

        Alert.alert(
          "Session Error",
          "Your saved account session is invalid.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/login");
              },
            },
          ],
          {
            cancelable: false,
          }
        );

        return;
      }

      setUser(parsedUser);

      console.log(
        "================================"
      );

      console.log(
        "SECURITY PAGE"
      );

      console.log(
        "USER:",
        parsedUser.username
      );

      console.log(
        "ROLE:",
        parsedUser.role
      );

      console.log(
        "ACCOUNT TYPE:",
        parsedUser.accountType
      );

      console.log(
        "================================"
      );

      /* =============================================
         CHECK SECURITY FLAG
      ============================================= */

      const securityPending =
        await AsyncStorage.getItem(
          SECURITY_PENDING_KEY
        );

      if (securityPending !== "true") {
        console.log(
          "⚠️ NO PENDING SECURITY SESSION"
        );
      }

      /* =============================================
         CHECK BIOMETRIC HARDWARE
      ============================================= */

      const hasHardware =
        await LocalAuthentication.hasHardwareAsync();

      console.log(
        "BIOMETRIC HARDWARE:",
        hasHardware
      );

      if (!hasHardware) {
        Alert.alert(
          "Biometric Not Supported",
          "This device does not support fingerprint or Face ID."
        );

        return;
      }

      /* =============================================
         CHECK ENROLLMENT
      ============================================= */

      const isEnrolled =
        await LocalAuthentication.isEnrolledAsync();

      console.log(
        "BIOMETRIC ENROLLED:",
        isEnrolled
      );

      if (!isEnrolled) {
        Alert.alert(
          "Biometric Not Set Up",
          "Please set up your fingerprint or Face ID on your device first."
        );

        return;
      }

      /* =============================================
         DETECT BIOMETRIC TYPE
      ============================================= */

      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      console.log(
        "SUPPORTED BIOMETRIC TYPES:",
        types
      );

      if (
        types.includes(
          LocalAuthentication.AuthenticationType
            .FACIAL_RECOGNITION
        )
      ) {
        setBiometricType(
          "Face ID"
        );
      } else if (
        types.includes(
          LocalAuthentication.AuthenticationType
            .FINGERPRINT
        )
      ) {
        setBiometricType(
          "Fingerprint"
        );
      } else {
        setBiometricType(
          "Biometric"
        );
      }
    } catch (error) {
      console.error(
        "SECURITY INITIALIZATION ERROR:",
        error
      );

      Alert.alert(
        "Security Error",
        "Unable to initialize biometric security."
      );
    } finally {
      setChecking(false);
    }
  };

  /* =================================================
     ROLE NORMALIZATION
  ================================================= */

  const getNormalizedRole = (
    currentUser: LoginUser
  ) => {
    const role = String(
      currentUser.role || ""
    )
      .trim()
      .toLowerCase();

    const accountType = String(
      currentUser.accountType || ""
    )
      .trim()
      .toLowerCase();

    /* =============================================
       SELLER
    ============================================= */

    if (
      role === "seller" ||
      accountType === "seller"
    ) {
      return "seller";
    }

    /* =============================================
       ADMIN / STAFF
    ============================================= */

    if (
      role === "admin" ||
      role === "staff" ||
      accountType === "admin" ||
      accountType === "staff"
    ) {
      if (
        role === "staff" ||
        accountType === "staff"
      ) {
        return "staff";
      }

      return "admin";
    }

    /* =============================================
       CUSTOMER
    ============================================= */

    return "user";
  };

  /* =================================================
     NAVIGATE AFTER BIOMETRIC SUCCESS
  ================================================= */

  const navigateAfterSecurity = async (
    currentUser: LoginUser
  ) => {
    const normalizedRole =
      getNormalizedRole(
        currentUser
      );

    console.log(
      "================================"
    );

    console.log(
      "BIOMETRIC VERIFIED"
    );

    console.log(
      "USERNAME:",
      currentUser.username
    );

    console.log(
      "ROLE:",
      normalizedRole
    );

    console.log(
      "================================"
    );

    /* =============================================
       REMOVE SECURITY PENDING FLAG
    ============================================= */

    await AsyncStorage.removeItem(
      SECURITY_PENDING_KEY
    );

    /* =============================================
       SELLER
    ============================================= */

    if (
      normalizedRole === "seller"
    ) {
      router.replace(
        "/seller" as any
      );

      return;
    }

    /* =============================================
       ADMIN / STAFF
    ============================================= */

    if (
      normalizedRole === "admin" ||
      normalizedRole === "staff"
    ) {
      router.replace(
        "/admin" as any
      );

      return;
    }

    /* =============================================
       CUSTOMER
    ============================================= */

    router.replace(
      "/tabs"
    );
  };

  /* =================================================
     AUTHENTICATE
  ================================================= */

  const authenticate = async () => {
    if (loading) {
      return;
    }

    if (!user) {
      Alert.alert(
        "Session Error",
        "No logged-in user was found."
      );

      router.replace(
        "/login"
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================"
      );

      console.log(
        "STARTING BIOMETRIC VERIFICATION"
      );

      console.log(
        "ACCOUNT:",
        user.username
      );

      console.log(
        "METHOD:",
        biometricType
      );

      console.log(
        "================================"
      );

      /* =============================================
         REAL DEVICE BIOMETRIC AUTHENTICATION
      ============================================= */

      const result =
        await LocalAuthentication.authenticateAsync(
          {
            promptMessage:
              `Verify with ${biometricType}`,

            cancelLabel:
              "Cancel",

            disableDeviceFallback:
              false,
          }
        );

      console.log(
        "BIOMETRIC RESULT:",
        result
      );

      /* =============================================
         SUCCESS
      ============================================= */

      if (result.success) {
        console.log(
          "✅ BIOMETRIC VERIFICATION SUCCESS"
        );

        await navigateAfterSecurity(
          user
        );

        return;
      }

      /* =============================================
         FAILED / CANCELLED
      ============================================= */

      console.log(
        "❌ BIOMETRIC VERIFICATION FAILED"
      );

      if (
        result.error ===
        "user_cancel"
      ) {
        return;
      }

      if (
        result.error ===
        "system_cancel"
      ) {
        return;
      }

      Alert.alert(
        "Verification Failed",
        "Your fingerprint or Face ID could not be verified. You cannot continue to the dashboard."
      );
    } catch (error) {
      console.error(
        "BIOMETRIC AUTH ERROR:",
        error
      );

      Alert.alert(
        "Verification Error",
        "Unable to verify your biometric authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =================================================
     LOADING / CHECKING SCREEN
  ================================================= */

  if (checking) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={styles.container}
        >
          <View
            style={styles.iconCircle}
          >
            <ActivityIndicator
              size="large"
              color="#A6192E"
            />
          </View>

          <Text
            style={styles.title}
          >
            Security Verification
          </Text>

          <Text
            style={styles.subtitle}
          >
            Checking your device security...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =================================================
     MAIN UI
  ================================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <View
        style={styles.container}
      >
        {/* ==========================================
            ICON
        ========================================== */}

        <View
          style={styles.iconCircle}
        >
          <Ionicons
            name="finger-print-outline"
            size={65}
            color="#A6192E"
          />
        </View>

        {/* ==========================================
            TITLE
        ========================================== */}

        <Text
          style={styles.title}
        >
          Security Verification
        </Text>

        {/* ==========================================
            USERNAME
        ========================================== */}

        {user && (
          <Text
            style={styles.accountText}
          >
            Signed in as{" "}
            <Text
              style={
                styles.accountUsername
              }
            >
              {user.username}
            </Text>
          </Text>
        )}

        {/* ==========================================
            DESCRIPTION
        ========================================== */}

        <Text
          style={styles.subtitle}
        >
          Verify your identity using your{" "}
          {biometricType} to continue to your dashboard.
        </Text>

        {/* ==========================================
            VERIFY BUTTON
        ========================================== */}

        <TouchableOpacity
          style={[
            styles.button,
            loading &&
              styles.buttonDisabled,
          ]}
          onPress={
            authenticate
          }
          disabled={
            loading
          }
          activeOpacity={
            0.85
          }
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Ionicons
              name="finger-print"
              size={25}
              color="#FFFFFF"
            />
          )}

          <Text
            style={
              styles.buttonText
            }
          >
            {loading
              ? "Verifying..."
              : `Verify with ${biometricType}`}
          </Text>
        </TouchableOpacity>

        {/* ==========================================
            SECURITY MESSAGE
        ========================================== */}

        <Text
          style={
            styles.securityText
          }
        >
          🔒 Your biometric data stays on your device.
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:
      "#430812",
  },

  container: {
    flex: 1,
    backgroundColor:
      "#FFFFFF",
    alignItems: "center",
    justifyContent:
      "center",
    paddingHorizontal: 30,
  },

  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor:
      "#F8E7EA",
    alignItems: "center",
    justifyContent:
      "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color:
      "#242124",
    textAlign: "center",
  },

  accountText: {
    marginTop: 8,
    fontSize: 12,
    color:
      "#777276",
    textAlign: "center",
  },

  accountUsername: {
    fontWeight: "800",
    color:
      "#A6192E",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color:
      "#777276",
    textAlign: "center",
    maxWidth: 320,
  },

  button: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor:
      "#A6192E",
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "center",
    gap: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color:
      "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  securityText: {
    marginTop: 22,
    fontSize: 11,
    color:
      "#999999",
    textAlign: "center",
  },
});