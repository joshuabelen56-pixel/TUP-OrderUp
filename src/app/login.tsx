import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ================================================= */
/* CONFIGURATION */
/* ================================================= */

const BASE_URL =
  (
    process.env.EXPO_PUBLIC_API_URL ||
    "http://192.168.18.24:5000"
  ).replace(/\/+$/, "");

const API_URL = BASE_URL.endsWith("/api")
  ? BASE_URL
  : `${BASE_URL}/api`;

const USER_STORAGE_KEY = "@tuporderup_user";

const PRIMARY = "#C41E3A";
const DARK_RED = "#8F1029";

/* ================================================= */
/* TYPES */
/* ================================================= */

type LoginUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string | null;
  gsfeEmail?: string | null;
  role?: string;
  tupIdNumber?: string | null;
  governmentIdType?: string | null;
  governmentIdNumber?: string | null;
  accountStatus?: string;
};

type LoginResponse = {
  success?: boolean;
  message?: string;

  // Old / normal login response compatibility
  user?: LoginUser;

  // New Gmail OTP response
  otpRequired?: boolean;
  userId?: string;
  maskedEmail?: string;
};

/* ================================================= */
/* LOGIN SCREEN */
/* ================================================= */

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================================================= */
  /* HANDLE LOGIN */
  /* ================================================= */

  const handleLogin = async () => {
    // Prevent multiple login requests
    if (loading) {
      return;
    }

    // ================================================
    // CLEAN INPUT
    // ================================================

    const cleanUsername =
      username.trim().toLowerCase();

    const cleanPassword =
      password.trim();

    // ================================================
    // VALIDATION
    // ================================================

    if (!cleanUsername) {
      Alert.alert(
        "Username Required",
        "Please enter your username."
      );

      return;
    }

    if (!cleanPassword) {
      Alert.alert(
        "Password Required",
        "Please enter your password."
      );

      return;
    }

    // ================================================
    // API CHECK
    // ================================================

    if (!API_URL) {
      Alert.alert(
        "Configuration Error",
        "API URL is not configured. Please check your .env file."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================"
      );

      console.log(
        "TUP-ORDERUP LOGIN"
      );

      console.log(
        "================================"
      );

      console.log(
        "API URL:",
        API_URL
      );

      console.log(
        "Username:",
        cleanUsername
      );

      console.log(
        "================================"
      );

      // ================================================
      // CLEAR OLD PENDING OTP SESSION
      // ================================================

      await AsyncStorage.multiRemove([
        "pending_otp_user_id",
        "pending_otp_email",
        "pending_otp_masked_email",
        "pending_otp_channels",
        "pending_otp_contacts",
      ]);

      // ================================================
      // SEND LOGIN REQUEST
      // ================================================

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            username:
              cleanUsername,

            password:
              cleanPassword,
          }),
        }
      );

      // ================================================
      // READ RESPONSE SAFELY
      // ================================================

      let data: LoginResponse = {};

      try {
        data =
          await response.json();
      } catch (jsonError) {
        console.error(
          "SERVER RETURNED INVALID JSON:",
          jsonError
        );

        Alert.alert(
          "Server Error",
          "The server returned an invalid response. Please check if your backend is running correctly."
        );

        return;
      }

      console.log(
        "LOGIN STATUS:",
        response.status
      );

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // ================================================
      // LOGIN FAILED
      // ================================================

      if (!response.ok) {
        Alert.alert(
          "Login Failed",
          data.message ||
            "Invalid username or password."
        );

        return;
      }

      // ================================================
      // NEW GMAIL OTP FLOW
      // ================================================

      if (
        data.success &&
        data.otpRequired &&
        data.userId
      ) {
        console.log(
          "LOGIN PASSWORD VERIFIED"
        );

        console.log(
          "GMAIL OTP REQUIRED"
        );

        console.log(
          "OTP USER ID:",
          data.userId
        );

        console.log(
          "MASKED EMAIL:",
          data.maskedEmail
        );

        // ----------------------------------------------
        // SAVE PENDING OTP USER ID
        // ----------------------------------------------

        await AsyncStorage.setItem(
          "pending_otp_user_id",
          data.userId
        );

        // ----------------------------------------------
        // SAVE MASKED EMAIL
        // ----------------------------------------------

        await AsyncStorage.setItem(
          "pending_otp_masked_email",
          data.maskedEmail || ""
        );

        // ----------------------------------------------
        // SAVE EMAIL COMPATIBILITY KEY
        // ----------------------------------------------

        await AsyncStorage.setItem(
          "pending_otp_email",
          data.maskedEmail || ""
        );

        // ----------------------------------------------
        // CLEAR LOGIN FORM
        // ----------------------------------------------

        setUsername("");
        setPassword("");

        // ----------------------------------------------
        // GO TO OTP SCREEN
        // ----------------------------------------------

        router.push(
          "../otp"
        );

        return;
      }

      // ================================================
      // COMPATIBILITY:
      // IF BACKEND STILL RETURNS USER WITHOUT OTP
      // ================================================

      if (
        data.user &&
        data.user.id
      ) {
        console.log(
          "WARNING: SERVER RETURNED DIRECT LOGIN WITHOUT OTP."
        );

        // ----------------------------------------------
        // CHECK ACCOUNT STATUS
        // ----------------------------------------------

        if (
          data.user.accountStatus &&
          data.user.accountStatus !==
            "Approved"
        ) {
          Alert.alert(
            "Account Not Approved",
            `Your account status is ${data.user.accountStatus}.`
          );

          return;
        }

        // ----------------------------------------------
        // SAVE USER SESSION
        // ----------------------------------------------

        try {
          await AsyncStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(
              data.user
            )
          );

          console.log(
            "USER SESSION SAVED SUCCESSFULLY"
          );

          console.log(
            "STORAGE KEY:",
            USER_STORAGE_KEY
          );

          console.log(
            "SAVED USER:",
            data.user
          );
        } catch (
          storageError
        ) {
          console.error(
            "ASYNCSTORAGE SAVE ERROR:",
            storageError
          );

          Alert.alert(
            "Storage Error",
            "Login was successful, but the app could not save your session. Please rebuild the app with AsyncStorage installed."
          );

          return;
        }

        // ----------------------------------------------
        // CLEAR LOGIN FORM
        // ----------------------------------------------

        setUsername("");
        setPassword("");

        // ----------------------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------------------

        Alert.alert(
          "Login Successful",
          `Welcome back, ${
            data.user.firstName ||
            "User"
          }!`,
          [
            {
              text: "Continue",

              onPress: () => {
                router.replace(
                  "/tabs"
                );
              },
            },
          ],
          {
            cancelable: false,
          }
        );

        return;
      }

      // ================================================
      // UNEXPECTED SERVER RESPONSE
      // ================================================

      console.error(
        "UNEXPECTED LOGIN RESPONSE:",
        data
      );

      Alert.alert(
        "Login Error",
        data.message ||
          "The server did not return the required login information."
      );
    } catch (error) {
      // ================================================
      // NETWORK / CONNECTION ERROR
      // ================================================

      console.error(
        "LOGIN CONNECTION ERROR:",
        error
      );

      Alert.alert(
        "Connection Error",
        "Unable to connect to the TUP-OrderUp server.\n\nMake sure:\n\n• Your backend is running\n• Your phone and computer are on the same Wi-Fi\n• Your API URL is correct\n• Port 5000 is accessible"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* REGISTER */
  /* ================================================= */

  const handleRegister = () => {
    if (loading) {
      return;
    }

    router.push(
      "/register"
    );
  };

  /* ================================================= */
  /* FORGOT PASSWORD */
  /* ================================================= */

  const handleForgotPassword = () => {
    if (loading) {
      return;
    }

    Alert.alert(
      "Forgot Password",
      "Password recovery will be connected later."
    );
  };

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* ========================================== */}
          {/* HEADER */}
          {/* ========================================== */}

          <View
            style={
              styles.header
            }
          >
            <View
              style={
                styles.logoCircle
              }
            >
              <Ionicons
                name="bag-handle"
                size={32}
                color={PRIMARY}
              />
            </View>

            <Text
              style={
                styles.appName
              }
            >
              TUP-OrderUp
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Easy ordering for campus life.
            </Text>
          </View>

          {/* ========================================== */}
          {/* LOGIN CARD */}
          {/* ========================================== */}

          <View
            style={
              styles.card
            }
          >
            <Text
              style={
                styles.welcome
              }
            >
              Welcome Back!
            </Text>

            <Text
              style={
                styles.description
              }
            >
              Sign in to continue to your account.
            </Text>

            {/* ======================================== */}
            {/* USERNAME */}
            {/* ======================================== */}

            <View
              style={
                styles.inputGroup
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                USERNAME
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  loading &&
                    styles.inputWrapperDisabled,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#777777"
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter your username"
                  placeholderTextColor="#A0A0A0"
                  value={
                    username
                  }
                  onChangeText={
                    setUsername
                  }
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                  editable={
                    !loading
                  }
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* ======================================== */}
            {/* PASSWORD */}
            {/* ======================================== */}

            <View
              style={
                styles.inputGroup
              }
            >
              <Text
                style={
                  styles.label
                }
              >
                PASSWORD
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  loading &&
                    styles.inputWrapperDisabled,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#777777"
                  style={
                    styles.inputIcon
                  }
                />

                <TextInput
                  style={
                    styles.input
                  }
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  value={
                    password
                  }
                  onChangeText={
                    setPassword
                  }
                  secureTextEntry={
                    !showPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={
                    false
                  }
                  editable={
                    !loading
                  }
                  returnKeyType="done"
                  onSubmitEditing={
                    handleLogin
                  }
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={
                    styles.eyeButton
                  }
                  disabled={
                    loading
                  }
                  activeOpacity={
                    0.7
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    color="#777777"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* ======================================== */}
            {/* FORGOT PASSWORD */}
            {/* ======================================== */}

            <TouchableOpacity
              style={
                styles.forgotButton
              }
              disabled={
                loading
              }
              onPress={
                handleForgotPassword
              }
              activeOpacity={
                0.7
              }
            >
              <Text
                style={
                  styles.forgotText
                }
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* ======================================== */}
            {/* LOGIN BUTTON */}
            {/* ======================================== */}

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading &&
                  styles.loginButtonDisabled,
              ]}
              onPress={
                handleLogin
              }
              disabled={
                loading
              }
              activeOpacity={
                0.8
              }
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    SIGNING IN...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.loginButtonText
                    }
                  >
                    LOGIN
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* ======================================== */}
            {/* DIVIDER */}
            {/* ======================================== */}

            <View
              style={
                styles.dividerContainer
              }
            >
              <View
                style={
                  styles.divider
                }
              />

              <Text
                style={
                  styles.orText
                }
              >
                OR
              </Text>

              <View
                style={
                  styles.divider
                }
              />
            </View>

            {/* ======================================== */}
            {/* REGISTER */}
            {/* ======================================== */}

            <View
              style={
                styles.registerContainer
              }
            >
              <Text
                style={
                  styles.noAccount
                }
              >
                Don't have an account?
              </Text>

              <TouchableOpacity
                disabled={
                  loading
                }
                onPress={
                  handleRegister
                }
                activeOpacity={
                  0.7
                }
              >
                <Text
                  style={
                    styles.registerText
                  }
                >
                  {" "}
                  Create an Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ========================================== */}
          {/* FOOTER */}
          {/* ========================================== */}

          <Text
            style={
              styles.footer
            }
          >
            TUP-OrderUp • Campus Ordering System
          </Text>

          <View
            style={
              styles.serverContainer
            }
          >
            <View
              style={
                styles.serverDot
              }
            />

            <Text
              style={
                styles.serverStatus
              }
            >
              TUP-OrderUp Server
            </Text>
          </View>

          {/* ========================================== */}
          {/* DEBUG API */}
          {/* ========================================== */}

          {__DEV__ && (
            <Text
              style={
                styles.apiText
              }
            >
              API: {API_URL}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboard: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 35,
    justifyContent: "center",
  },

  /* =============================================== */
  /* HEADER */
  /* =============================================== */

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF1F3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#222222",
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: "#777777",
    marginTop: 5,
  },

  /* =============================================== */
  /* CARD */
  /* =============================================== */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,

    borderWidth: 1,
    borderColor: "#EEEEEE",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },

  welcome: {
    fontSize: 25,
    fontWeight: "800",
    color: "#222222",
  },

  description: {
    fontSize: 14,
    color: "#777777",
    marginTop: 6,
    marginBottom: 25,
  },

  /* =============================================== */
  /* INPUT */
  /* =============================================== */

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#555555",
    letterSpacing: 1,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 54,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FAFAFA",

    flexDirection: "row",
    alignItems: "center",
  },

  inputWrapperDisabled: {
    opacity: 0.65,
  },

  inputIcon: {
    marginLeft: 15,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,

    fontSize: 15,
    color: "#222222",
  },

  eyeButton: {
    paddingHorizontal: 15,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =============================================== */
  /* FORGOT PASSWORD */
  /* =============================================== */

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "700",
  },

  /* =============================================== */
  /* LOGIN BUTTON */
  /* =============================================== */

  loginButton: {
    height: 56,
    backgroundColor: PRIMARY,
    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  /* =============================================== */
  /* DIVIDER */
  /* =============================================== */

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },

  orText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: "700",
    color: "#999999",
  },

  /* =============================================== */
  /* REGISTER */
  /* =============================================== */

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  noAccount: {
    fontSize: 13,
    color: "#777777",
  },

  registerText: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: "800",
  },

  /* =============================================== */
  /* FOOTER */
  /* =============================================== */

  footer: {
    textAlign: "center",
    marginTop: 25,
    color: "#AAAAAA",
    fontSize: 11,
  },

  serverContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
  },

  serverDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#28A745",
    marginRight: 6,
  },

  serverStatus: {
    color: PRIMARY,
    fontSize: 9.5,
    fontWeight: "600",
  },

  /* =============================================== */
  /* DEVELOPMENT API TEXT */
  /* =============================================== */

  apiText: {
    textAlign: "center",
    marginTop: 8,
    color: "#BBBBBB",
    fontSize: 8,
  },
});