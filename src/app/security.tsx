import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const USER_STORAGE_KEY = "@tuporderup_user";
const SECURITY_PENDING_KEY = "@tuporderup_security_pending";
const SECURITY_METHOD_PREFIX = "tuporderup_security_method_";
const PIN_PREFIX = "tuporderup_pin_";

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

type SecurityMethod = "fingerprint" | "pin";

export default function SecurityScreen() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<LoginUser | null>(null);

  const [selectedMethod, setSelectedMethod] =
    useState<SecurityMethod>("fingerprint");

  const [pin, setPin] = useState("");
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [fingerprintRegistered, setFingerprintRegistered] = useState(false);
  const [pinAvailable, setPinAvailable] = useState(false);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const getUserId = (currentUser: LoginUser) =>
    String(currentUser.id || currentUser._id || "");

  const initializeSecurity = async () => {
    try {
      setChecking(true);

      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (!storedUser) {
        Alert.alert(
          "Session Error",
          "No logged-in account was found.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ],
          { cancelable: false }
        );
        return;
      }

      let parsedUser: LoginUser;

      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        Alert.alert(
          "Session Error",
          "Your saved account session is invalid.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ],
          { cancelable: false }
        );
        return;
      }

      setUser(parsedUser);

      const userId = getUserId(parsedUser);

      if (!userId) {
        Alert.alert(
          "Security Error",
          "Unable to identify this account."
        );
        return;
      }

      /*
       * ================================================
       * CHECK FINGERPRINT
       * ================================================
       */

      const hasHardware =
        await LocalAuthentication.hasHardwareAsync();

      const isEnrolled =
        await LocalAuthentication.isEnrolledAsync();

      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      const hasFingerprint = types.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      );

      const canFingerprint =
        hasHardware &&
        isEnrolled &&
        hasFingerprint;

      setFingerprintAvailable(canFingerprint);

      /*
       * ================================================
       * CHECK SAVED FINGERPRINT METHOD
       * ================================================
       */

      const savedMethod =
        await SecureStore.getItemAsync(
          `${SECURITY_METHOD_PREFIX}${userId}`
        );

      const fingerprintWasRegistered =
        savedMethod === "fingerprint";

      setFingerprintRegistered(
        fingerprintWasRegistered
      );

      /*
       * ================================================
       * CHECK SAVED PIN
       * ================================================
       */

      const savedPin =
        await SecureStore.getItemAsync(
          `${PIN_PREFIX}${userId}`
        );

      const hasPin =
        !!savedPin && /^\d{6}$/.test(savedPin);

      setPinAvailable(hasPin);

      /*
       * ================================================
       * SELECT INITIAL METHOD
       * ================================================
       */

      if (
        fingerprintWasRegistered &&
        canFingerprint
      ) {
        setSelectedMethod("fingerprint");
      } else if (hasPin) {
        setSelectedMethod("pin");
      } else if (canFingerprint) {
        setSelectedMethod("fingerprint");
      }

      console.log(
        "SECURITY METHOD:",
        savedMethod
      );

      console.log(
        "FINGERPRINT AVAILABLE:",
        canFingerprint
      );

      console.log(
        "FINGERPRINT REGISTERED:",
        fingerprintWasRegistered
      );

      console.log(
        "PIN AVAILABLE:",
        hasPin
      );
    } catch (error) {
      console.error(
        "SECURITY INITIALIZATION ERROR:",
        error
      );

      Alert.alert(
        "Security Error",
        "Unable to initialize account security."
      );
    } finally {
      setChecking(false);
    }
  };

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

    if (
      role === "seller" ||
      accountType === "seller"
    ) {
      return "seller";
    }

    if (
      role === "admin" ||
      role === "staff" ||
      accountType === "admin" ||
      accountType === "staff"
    ) {
      return role === "staff" ||
        accountType === "staff"
        ? "staff"
        : "admin";
    }

    return "user";
  };

  const navigateAfterSecurity = async (
    currentUser: LoginUser
  ) => {
    const normalizedRole =
      getNormalizedRole(currentUser);

    await AsyncStorage.removeItem(
      SECURITY_PENDING_KEY
    );

    console.log(
      "SECURITY VERIFIED:",
      currentUser.username
    );

    console.log(
      "ROLE:",
      normalizedRole
    );

    if (normalizedRole === "seller") {
      router.replace("/seller" as any);
      return;
    }

    if (
      normalizedRole === "admin" ||
      normalizedRole === "staff"
    ) {
      router.replace("/admin" as any);
      return;
    }

    router.replace("/tabs");
  };

  /*
   * ================================================
   * FINGERPRINT AUTHENTICATION
   * ================================================
   */

  const authenticateFingerprint = async () => {
    if (!user || loading) return;

    if (!fingerprintAvailable) {
      Alert.alert(
        "Fingerprint Unavailable",
        "Fingerprint authentication is not available on this device."
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await LocalAuthentication.authenticateAsync({
          promptMessage:
            "Verify your fingerprint",
          cancelLabel: "Cancel",
          disableDeviceFallback: true,
        });

      console.log(
        "FINGERPRINT RESULT:",
        result
      );

      if (result.success) {
        await navigateAfterSecurity(user);
        return;
      }

      if (
        result.error !== "user_cancel" &&
        result.error !== "system_cancel"
      ) {
        Alert.alert(
          "Fingerprint Verification Failed",
          "The fingerprint could not be verified. You cannot continue to the dashboard."
        );
      }
    } catch (error) {
      console.error(
        "FINGERPRINT AUTH ERROR:",
        error
      );

      Alert.alert(
        "Verification Error",
        "Unable to verify your fingerprint."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ================================================
   * PIN AUTHENTICATION
   * ================================================
   */

  const authenticatePin = async () => {
    if (!user || loading) return;

    if (!/^\d{6}$/.test(pin)) {
      Alert.alert(
        "Invalid PIN",
        "Please enter your 6-digit PIN."
      );
      return;
    }

    try {
      setLoading(true);

      const userId = getUserId(user);

      const savedPin =
        await SecureStore.getItemAsync(
          `${PIN_PREFIX}${userId}`
        );

      if (!savedPin) {
        Alert.alert(
          "PIN Not Found",
          "No 6-digit PIN was found for this account on this device."
        );
        return;
      }

      if (pin !== savedPin) {
        setPin("");

        Alert.alert(
          "Incorrect PIN",
          "The PIN you entered is incorrect. You cannot continue to the dashboard."
        );

        return;
      }

      console.log(
        "PIN VERIFICATION SUCCESS:",
        user.username
      );

      await navigateAfterSecurity(user);
    } catch (error) {
      console.error(
        "PIN AUTH ERROR:",
        error
      );

      Alert.alert(
        "Verification Error",
        "Unable to verify your PIN."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ================================================
   * LOADING
   * ================================================
   */

  if (checking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <ActivityIndicator
              size="large"
              color="#A6192E"
            />
          </View>

          <Text style={styles.title}>
            Security Verification
          </Text>

          <Text style={styles.subtitle}>
            Checking your security options...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * ================================================
   * MAIN SECURITY SCREEN
   * ================================================
   */

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={
              selectedMethod === "fingerprint"
                ? "finger-print-outline"
                : "keypad-outline"
            }
            size={65}
            color="#A6192E"
          />
        </View>

        <Text style={styles.title}>
          Security Verification
        </Text>

        {user && (
          <Text style={styles.accountText}>
            Signed in as{" "}
            <Text style={styles.accountUsername}>
              {user.username}
            </Text>
          </Text>
        )}

        <Text style={styles.subtitle}>
          Choose how you want to verify your identity.
        </Text>

        {/* =========================================
            SECURITY METHOD OPTIONS
        ========================================= */}

        <View style={styles.optionsContainer}>

          {/* FINGERPRINT OPTION */}

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "fingerprint" &&
                styles.methodCardSelected,
              (!fingerprintAvailable ||
                !fingerprintRegistered) &&
                styles.methodCardDisabled,
            ]}
            onPress={() => {
              if (
                fingerprintAvailable &&
                fingerprintRegistered
              ) {
                setSelectedMethod(
                  "fingerprint"
                );
              } else {
                Alert.alert(
                  "Fingerprint Unavailable",
                  "Fingerprint authentication is not available or has not been registered for this account."
                );
              }
            }}
            activeOpacity={0.85}
            disabled={loading}
          >
            <View style={styles.methodIcon}>
              <Ionicons
                name="finger-print-outline"
                size={30}
                color={
                  selectedMethod === "fingerprint"
                    ? "#A6192E"
                    : "#666666"
                }
              />
            </View>

            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>
                Fingerprint
              </Text>

              <Text style={styles.methodDescription}>
                Use your registered fingerprint
              </Text>
            </View>

            <Ionicons
              name={
                selectedMethod === "fingerprint"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={23}
              color={
                selectedMethod === "fingerprint"
                  ? "#A6192E"
                  : "#999999"
              }
            />
          </TouchableOpacity>

          {/* PIN OPTION */}

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "pin" &&
                styles.methodCardSelected,
              !pinAvailable &&
                styles.methodCardDisabled,
            ]}
            onPress={() => {
              if (pinAvailable) {
                setSelectedMethod("pin");
              } else {
                Alert.alert(
                  "PIN Not Found",
                  "No 6-digit PIN has been registered for this account on this device."
                );
              }
            }}
            activeOpacity={0.85}
            disabled={loading}
          >
            <View style={styles.methodIcon}>
              <Ionicons
                name="keypad-outline"
                size={28}
                color={
                  selectedMethod === "pin"
                    ? "#A6192E"
                    : "#666666"
                }
              />
            </View>

            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>
                Security PIN
              </Text>

              <Text style={styles.methodDescription}>
                Enter your 6-digit PIN
              </Text>
            </View>

            <Ionicons
              name={
                selectedMethod === "pin"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
              size={23}
              color={
                selectedMethod === "pin"
                  ? "#A6192E"
                  : "#999999"
              }
            />
          </TouchableOpacity>
        </View>

        {/* =========================================
            SELECTED METHOD
        ========================================= */}

        {selectedMethod === "fingerprint" ? (
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={authenticateFingerprint}
            disabled={loading}
            activeOpacity={0.85}
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

            <Text style={styles.buttonText}>
              {loading
                ? "Verifying..."
                : "Verify with Fingerprint"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pinCard}>
            <Text style={styles.pinLabel}>
              6-DIGIT SECURITY PIN
            </Text>

            <View style={styles.pinInputWrapper}>
              <Ionicons
                name="keypad-outline"
                size={22}
                color="#777777"
              />

              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={(text) =>
                  setPin(
                    text
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                placeholder="Enter your PIN"
                placeholderTextColor="#AAAAAA"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                loading &&
                  styles.buttonDisabled,
              ]}
              onPress={authenticatePin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="lock-open-outline"
                  size={23}
                  color="#FFFFFF"
                />
              )}

              <Text style={styles.buttonText}>
                {loading
                  ? "Verifying..."
                  : "Verify PIN"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.securityText}>
          🔒 Your security credentials are protected on this device.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#430812",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F8E7EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#242124",
    textAlign: "center",
  },

  accountText: {
    marginTop: 8,
    fontSize: 12,
    color: "#777276",
    textAlign: "center",
  },

  accountUsername: {
    fontWeight: "800",
    color: "#A6192E",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: "#777276",
    textAlign: "center",
    maxWidth: 330,
  },

  optionsContainer: {
    width: "100%",
    marginTop: 24,
    gap: 12,
  },

  methodCard: {
    width: "100%",
    minHeight: 74,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  methodCardSelected: {
    borderColor: "#A6192E",
    backgroundColor: "#FFF5F6",
  },

  methodCardDisabled: {
    opacity: 0.45,
  },

  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },

  methodInfo: {
    flex: 1,
    marginLeft: 13,
  },

  methodTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#252225",
  },

  methodDescription: {
    marginTop: 3,
    fontSize: 12,
    color: "#777276",
  },

  button: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor: "#A6192E",
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  pinCard: {
    width: "100%",
    marginTop: 2,
  },

  pinLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#555555",
    marginBottom: 8,
  },

  pinInputWrapper: {
    height: 56,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  pinInput: {
    flex: 1,
    height: 54,
    marginLeft: 11,
    fontSize: 18,
    letterSpacing: 5,
    color: "#222222",
  },

  securityText: {
    marginTop: 20,
    fontSize: 11,
    color: "#999999",
    textAlign: "center",
  },
});
