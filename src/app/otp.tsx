import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  router,
} from "expo-router";

// ======================================================
// CONFIG
// ======================================================

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.18.24:5000"
).replace(/\/+$/, "");

const API_URL =
  BASE_URL.endsWith("/api")
    ? BASE_URL
    : `${BASE_URL}/api`;

// ======================================================
// AUTH STORAGE KEYS
// ======================================================
// IMPORTANT:
// These MUST match your settings.tsx

const TOKEN_STORAGE_KEY =
  "@tuporderup_token";

const USER_STORAGE_KEY =
  "@tuporderup_user";

const LOGIN_STATUS_KEY =
  "@tuporderup_logged_in";

// Old keys from previous version.
// We remove these after successful login
// to prevent storage conflicts.

const OLD_AUTH_KEYS = [
  "auth_token",
  "user",
  "is_logged_in",
];

// ======================================================
// PENDING OTP KEYS
// ======================================================

const PENDING_USER_ID_KEY =
  "pending_otp_user_id";

const PENDING_EMAIL_KEY =
  "pending_otp_email";

const PENDING_MASKED_EMAIL_KEY =
  "pending_otp_masked_email";

const PENDING_CHANNELS_KEY =
  "pending_otp_channels";

const PENDING_CONTACTS_KEY =
  "pending_otp_contacts";

// ======================================================
// TYPES
// ======================================================

interface PendingUser {
  userId: string;
  email?: string | null;
  maskedEmail?: string | null;
}

// ======================================================
// SCREEN
// ======================================================

export default function OTPScreen() {
  // ====================================================
  // STATE
  // ====================================================

  const [
    userId,
    setUserId,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    resending,
    setResending,
  ] = useState(false);

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(60);

  const [
    initialized,
    setInitialized,
  ] = useState(false);

  const [
    verifyingAutomatically,
    setVerifyingAutomatically,
  ] = useState(false);

  const inputRef =
    useRef<TextInput>(null);

  // Prevent duplicate verification requests
  const verificationInProgress =
    useRef(false);

  // ====================================================
  // LOAD PENDING LOGIN
  // ====================================================

  useEffect(() => {
    loadPendingLogin();
  }, []);

  // ====================================================
  // RESEND COUNTDOWN
  // ====================================================

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer =
      setInterval(() => {
        setResendSeconds(
          (previous) =>
            previous > 0
              ? previous - 1
              : 0
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resendSeconds]);

  // ====================================================
  // LOAD PENDING LOGIN
  // ====================================================

  const loadPendingLogin =
    async () => {
      try {
        const storedUserId =
          await AsyncStorage.getItem(
            PENDING_USER_ID_KEY
          );

        const storedEmail =
          await AsyncStorage.getItem(
            PENDING_EMAIL_KEY
          );

        const storedMaskedEmail =
          await AsyncStorage.getItem(
            PENDING_MASKED_EMAIL_KEY
          );

        // ------------------------------------------------
        // NO USER ID
        // ------------------------------------------------

        if (!storedUserId) {
          Alert.alert(
            "Session Expired",
            "Your login session has expired. Please login again.",
            [
              {
                text: "OK",
                onPress: () => {
                  router.replace(
                    "../login"
                  );
                },
              },
            ]
          );

          return;
        }

        // ------------------------------------------------
        // SET DATA
        // ------------------------------------------------

        setUserId(
          storedUserId
        );

        setEmail(
          storedMaskedEmail ||
            storedEmail ||
            ""
        );

        setInitialized(true);

        // ------------------------------------------------
        // FOCUS OTP INPUT
        // ------------------------------------------------

        setTimeout(() => {
          inputRef.current?.focus();
        }, 500);

      } catch (error) {
        console.error(
          "LOAD PENDING OTP ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to load your verification session."
        );
      }
    };

  // ====================================================
  // VERIFY OTP
  // ====================================================

  const verifyOTP = async (
    otpCode?: string
  ) => {
    // Use supplied code if available.
    // Otherwise use current state.

    const cleanOTP = (
      otpCode !== undefined
        ? otpCode
        : otp
    )
      .replace(/\D/g, "")
      .slice(0, 6);

    // --------------------------------------------------
    // VALIDATE USER
    // --------------------------------------------------

    if (!userId) {
      Alert.alert(
        "Session Expired",
        "Your login session is missing. Please login again.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace(
                "../login"
              );
            },
          },
        ]
      );

      return;
    }

    // --------------------------------------------------
    // VALIDATE OTP
    // --------------------------------------------------

    if (cleanOTP.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit verification code."
      );

      return;
    }

    // --------------------------------------------------
    // PREVENT DUPLICATE REQUEST
    // --------------------------------------------------

    if (
      verificationInProgress.current
    ) {
      return;
    }

    verificationInProgress.current =
      true;

    try {
      setLoading(true);

      console.log(
        "================================"
      );

      console.log(
        "VERIFYING OTP"
      );

      console.log(
        "API URL:",
        `${API_URL}/auth/verify-otp`
      );

      console.log(
        "USER ID:",
        userId
      );

      // ------------------------------------------------
      // API REQUEST
      // ------------------------------------------------

      const response =
        await fetch(
          `${API_URL}/auth/verify-otp`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId,
              otp: cleanOTP,
            }),
          }
        );

      // ------------------------------------------------
      // READ RESPONSE SAFELY
      // ------------------------------------------------

      let data: any = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      console.log(
        "OTP RESPONSE:",
        data
      );

      // ------------------------------------------------
      // API ERROR
      // ------------------------------------------------

      if (!response.ok) {
        Alert.alert(
          "Verification Failed",
          data.message ||
            "The verification code is incorrect or has expired."
        );

        setOtp("");

        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);

        return;
      }

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      if (
        data.success &&
        data.token &&
        data.user
      ) {
        console.log(
          "OTP VERIFIED SUCCESSFULLY"
        );

        // ==================================================
        // SAVE AUTH TOKEN
        // ==================================================

        await AsyncStorage.setItem(
          TOKEN_STORAGE_KEY,
          String(data.token)
        );

        // ==================================================
        // SAVE USER
        // ==================================================

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(
            data.user
          )
        );

        // ==================================================
        // SAVE LOGIN STATUS
        // ==================================================

        await AsyncStorage.setItem(
          LOGIN_STATUS_KEY,
          "true"
        );

        // ==================================================
        // REMOVE OLD AUTH KEYS
        // ==================================================

        await AsyncStorage.multiRemove(
          OLD_AUTH_KEYS
        );

        // ==================================================
        // REMOVE PENDING OTP DATA
        // ==================================================

        await AsyncStorage.multiRemove([
          PENDING_USER_ID_KEY,
          PENDING_EMAIL_KEY,
          PENDING_MASKED_EMAIL_KEY,
          PENDING_CHANNELS_KEY,
          PENDING_CONTACTS_KEY,
        ]);

        // ==================================================
        // VERIFY STORAGE
        // ==================================================

        const savedToken =
          await AsyncStorage.getItem(
            TOKEN_STORAGE_KEY
          );

        const savedUser =
          await AsyncStorage.getItem(
            USER_STORAGE_KEY
          );

        const savedLoginStatus =
          await AsyncStorage.getItem(
            LOGIN_STATUS_KEY
          );

        console.log(
          "================================"
        );

        console.log(
          "AUTH SESSION SAVED"
        );

        console.log(
          "TOKEN SAVED:",
          !!savedToken
        );

        console.log(
          "USER SAVED:",
          !!savedUser
        );

        console.log(
          "LOGIN STATUS:",
          savedLoginStatus
        );

        console.log(
          "GOING TO TABS"
        );

        console.log(
          "================================"
        );

        // ==================================================
        // NAVIGATE TO APP
        // ==================================================

        router.replace(
          "/tabs"
        );

        return;
      }

      // ------------------------------------------------
      // UNEXPECTED SUCCESS RESPONSE
      // ------------------------------------------------

      Alert.alert(
        "Verification Error",
        "The server did not return a valid login session."
      );

    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Make sure your backend is running and your phone is connected to the same network."
      );

    } finally {
      setLoading(false);

      verificationInProgress.current =
        false;

      setVerifyingAutomatically(
        false
      );
    }
  };

  // ====================================================
  // OTP INPUT
  // ====================================================

  const handleOTPChange =
    (value: string) => {
      const clean =
        value
          .replace(/\D/g, "")
          .slice(0, 6);

      setOtp(clean);

      // ------------------------------------------------
      // AUTOMATIC VERIFY
      // ------------------------------------------------

      if (
        clean.length === 6 &&
        !verificationInProgress.current
      ) {
        setVerifyingAutomatically(
          true
        );

        setTimeout(() => {
          verifyOTP(clean);
        }, 150);
      }
    };

  // ====================================================
  // RESEND OTP
  // ====================================================

  const resendOTP =
    async () => {
      if (!userId) {
        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        return;
      }

      if (resendSeconds > 0) {
        return;
      }

      if (resending) {
        return;
      }

      try {
        setResending(true);

        console.log(
          "RESENDING OTP..."
        );

        // ------------------------------------------------
        // API
        // ------------------------------------------------

        const response =
          await fetch(
            `${API_URL}/auth/resend-otp`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                userId,
              }),
            }
          );

        // ------------------------------------------------
        // RESPONSE
        // ------------------------------------------------

        let data: any = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        console.log(
          "RESEND OTP RESPONSE:",
          data
        );

        // ------------------------------------------------
        // ERROR
        // ------------------------------------------------

        if (!response.ok) {
          if (
            data.retryAfter
          ) {
            setResendSeconds(
              Number(
                data.retryAfter
              )
            );
          }

          Alert.alert(
            "Unable to Resend",
            data.message ||
              "Please wait and try again."
          );

          return;
        }

        // ------------------------------------------------
        // SUCCESS
        // ------------------------------------------------

        setOtp("");

        setResendSeconds(
          60
        );

        Alert.alert(
          "OTP Sent",
          "A new 6-digit verification code has been sent to your Gmail.",
          [
            {
              text: "OK",

              onPress: () => {
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 250);
              },
            },
          ]
        );

      } catch (error) {
        console.error(
          "RESEND OTP ERROR:",
          error
        );

        Alert.alert(
          "Connection Error",
          "Unable to connect to the server."
        );

      } finally {
        setResending(false);
      }
    };

  // ====================================================
  // BACK TO LOGIN
  // ====================================================

  const goBackToLogin =
    async () => {
      try {
        await AsyncStorage.multiRemove([
          PENDING_USER_ID_KEY,
          PENDING_EMAIL_KEY,
          PENDING_MASKED_EMAIL_KEY,
          PENDING_CHANNELS_KEY,
          PENDING_CONTACTS_KEY,
        ]);
      } catch (error) {
        console.error(
          "CLEAR OTP SESSION ERROR:",
          error
        );
      }

      router.replace(
        "../login"
      );
    };

  // ====================================================
  // FORMAT EMAIL
  // ====================================================

  const displayEmail =
    email ||
    "your registered Gmail address";

  // ====================================================
  // UI
  // ====================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
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
          {/* ==========================================
              BACK BUTTON
          ========================================== */}

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={
              goBackToLogin
            }
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#222"
            />

            <Text
              style={
                styles.backText
              }
            >
              Back to Login
            </Text>
          </TouchableOpacity>

          {/* ==========================================
              SECURITY ICON
          ========================================== */}

          <View
            style={
              styles.iconContainer
            }
          >
            <View
              style={
                styles.iconCircle
              }
            >
              <Ionicons
                name="mail-outline"
                size={45}
                color="#C41E3A"
              />
            </View>
          </View>

          {/* ==========================================
              TITLE
          ========================================== */}

          <Text
            style={
              styles.title
            }
          >
            Check Your Gmail
          </Text>

          <Text
            style={
              styles.description
            }
          >
            We sent a 6-digit verification
            code to your registered email
            address.
          </Text>

          {/* ==========================================
              EMAIL CARD
          ========================================== */}

          <View
            style={
              styles.emailCard
            }
          >
            <View
              style={
                styles.emailIcon
              }
            >
              <Ionicons
                name="mail"
                size={22}
                color="#C41E3A"
              />
            </View>

            <View
              style={
                styles.emailInfo
              }
            >
              <Text
                style={
                  styles.emailLabel
                }
              >
                Verification Email
              </Text>

              <Text
                style={
                  styles.emailValue
                }
                numberOfLines={1}
              >
                {displayEmail}
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={22}
              color="#2E9B5B"
            />
          </View>

          {/* ==========================================
              OTP SECTION
          ========================================== */}

          <View
            style={
              styles.divider
            }
          >
            <View
              style={
                styles.dividerLine
              }
            />

            <Text
              style={
                styles.dividerText
              }
            >
              VERIFICATION CODE
            </Text>

            <View
              style={
                styles.dividerLine
              }
            />
          </View>

          <Text
            style={
              styles.otpLabel
            }
          >
            Enter the 6-digit code
          </Text>

          <TextInput
            ref={inputRef}
            style={[
              styles.otpInput,
              otp.length === 6 &&
                styles.otpInputComplete,
            ]}
            value={otp}
            onChangeText={
              handleOTPChange
            }
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#C9C9C9"
            textAlign="center"
            editable={
              !loading &&
              !resending &&
              initialized
            }
            autoFocus={false}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
          />

          {/* ==========================================
              DIGIT INDICATOR
          ========================================== */}

          <View
            style={
              styles.digitContainer
            }
          >
            {[0, 1, 2, 3, 4, 5].map(
              (index) => (
                <View
                  key={index}
                  style={[
                    styles.digitDot,
                    otp.length >
                      index &&
                      styles.digitDotActive,
                  ]}
                />
              )
            )}
          </View>

          {/* ==========================================
              VERIFY BUTTON
          ========================================== */}

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (
                loading ||
                otp.length !== 6
              ) &&
                styles.disabledButton,
            ]}
            disabled={
              loading ||
              otp.length !== 6
            }
            onPress={() =>
              verifyOTP()
            }
            activeOpacity={0.85}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

                <Text
                  style={
                    styles.verifyText
                  }
                >
                  Verifying...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.verifyText
                  }
                >
                  Verify & Continue
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* ==========================================
              AUTOMATIC VERIFICATION NOTICE
          ========================================== */}

          {verifyingAutomatically && (
            <View
              style={
                styles.autoVerifyBox
              }
            >
              <ActivityIndicator
                size="small"
                color="#C41E3A"
              />

              <Text
                style={
                  styles.autoVerifyText
                }
              >
                Verifying your code...
              </Text>
            </View>
          )}

          {/* ==========================================
              RESEND
          ========================================== */}

          <View
            style={
              styles.resendContainer
            }
          >
            <Text
              style={
                styles.resendText
              }
            >
              Didn't receive the code?
            </Text>

            {resendSeconds > 0 ? (
              <Text
                style={
                  styles.countdownText
                }
              >
                Resend available in{" "}
                {resendSeconds}s
              </Text>
            ) : (
              <TouchableOpacity
                disabled={
                  resending
                }
                onPress={
                  resendOTP
                }
                activeOpacity={0.7}
              >
                {resending ? (
                  <View
                    style={
                      styles.resendLoading
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color="#C41E3A"
                    />

                    <Text
                      style={
                        styles.resendLink
                      }
                    >
                      Sending...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={
                      styles.resendLink
                    }
                  >
                    Resend Code
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* ==========================================
              CHECK EMAIL NOTICE
          ========================================== */}

          <View
            style={
              styles.helpBox
            }
          >
            <View
              style={
                styles.helpIcon
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#777"
              />
            </View>

            <View
              style={
                styles.helpContent
              }
            >
              <Text
                style={
                  styles.helpTitle
                }
              >
                Can't find the email?
              </Text>

              <Text
                style={
                  styles.helpText
                }
              >
                Check your Spam, Junk, or
                Promotions folder. The
                verification code expires
                after a few minutes.
              </Text>
            </View>
          </View>

          {/* ==========================================
              SECURITY NOTICE
          ========================================== */}

          <View
            style={
              styles.securityBox
            }
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#777"
            />

            <Text
              style={
                styles.securityText
              }
            >
              Never share your verification
              code with anyone.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({

    // ==================================================
    // SAFE AREA
    // ==================================================

    safeArea: {
      flex: 1,
      backgroundColor:
        "#FFFFFF",
    },

    // ==================================================
    // CONTAINER
    // ==================================================

    container: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 18,
      paddingBottom: 40,
    },

    // ==================================================
    // BACK BUTTON
    // ==================================================

    backButton: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 8,
      marginBottom: 30,
    },

    backText: {
      fontSize: 14,
      color: "#333",
      fontWeight: "600",
    },

    // ==================================================
    // ICON
    // ==================================================

    iconContainer: {
      alignItems:
        "center",
      marginBottom: 20,
    },

    iconCircle: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor:
        "#FFF0F3",
      justifyContent:
        "center",
      alignItems:
        "center",
      borderWidth: 1,
      borderColor:
        "#FFE0E6",
    },

    // ==================================================
    // TITLE
    // ==================================================

    title: {
      textAlign:
        "center",
      fontSize: 26,
      fontWeight:
        "800",
      color:
        "#222",
    },

    description: {
      textAlign:
        "center",
      color:
        "#777",
      fontSize: 14,
      lineHeight: 21,
      marginTop: 8,
      marginBottom: 24,
    },

    // ==================================================
    // EMAIL CARD
    // ==================================================

    emailCard: {
      minHeight: 76,
      borderWidth: 1,
      borderColor:
        "#E8E8E8",
      borderRadius: 16,
      paddingHorizontal: 14,
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#FAFAFA",
    },

    emailIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor:
        "#FFF0F3",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    emailInfo: {
      flex: 1,
      marginLeft: 13,
      marginRight: 10,
    },

    emailLabel: {
      fontSize: 12,
      color:
        "#888",
      fontWeight:
        "600",
    },

    emailValue: {
      fontSize: 13,
      color:
        "#222",
      fontWeight:
        "800",
      marginTop: 4,
    },

    // ==================================================
    // DIVIDER
    // ==================================================

    divider: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginVertical: 25,
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor:
        "#E8E8E8",
    },

    dividerText: {
      marginHorizontal: 12,
      color:
        "#999",
      fontSize: 10,
      fontWeight:
        "800",
      letterSpacing: 1,
    },

    // ==================================================
    // OTP LABEL
    // ==================================================

    otpLabel: {
      textAlign:
        "center",
      color:
        "#333",
      fontSize: 13,
      fontWeight:
        "700",
      marginBottom: 10,
    },

    // ==================================================
    // OTP INPUT
    // ==================================================

    otpInput: {
      height: 64,
      borderWidth: 1.5,
      borderColor:
        "#DCDCDC",
      borderRadius: 16,
      backgroundColor:
        "#FAFAFA",
      fontSize: 27,
      fontWeight:
        "800",
      letterSpacing: 10,
      color:
        "#222",
      paddingLeft: 10,
    },

    otpInputComplete: {
      borderColor:
        "#C41E3A",
      backgroundColor:
        "#FFF7F8",
    },

    // ==================================================
    // DIGIT INDICATOR
    // ==================================================

    digitContainer: {
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
      gap: 8,
      marginTop: 13,
    },

    digitDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor:
        "#DADADA",
    },

    digitDotActive: {
      backgroundColor:
        "#C41E3A",
    },

    // ==================================================
    // VERIFY BUTTON
    // ==================================================

    verifyButton: {
      height: 54,
      borderRadius: 15,
      backgroundColor:
        "#C41E3A",
      justifyContent:
        "center",
      alignItems:
        "center",
      flexDirection:
        "row",
      gap: 9,
      marginTop: 18,
    },

    disabledButton: {
      opacity: 0.5,
    },

    verifyText: {
      color:
        "#FFFFFF",
      fontSize: 15,
      fontWeight:
        "800",
    },

    // ==================================================
    // AUTO VERIFY
    // ==================================================

    autoVerifyBox: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 8,
      marginTop: 12,
    },

    autoVerifyText: {
      fontSize: 12,
      color:
        "#777",
      fontWeight:
        "600",
    },

    // ==================================================
    // RESEND
    // ==================================================

    resendContainer: {
      alignItems:
        "center",
      marginTop: 20,
    },

    resendText: {
      fontSize: 13,
      color:
        "#777",
    },

    resendLink: {
      color:
        "#C41E3A",
      fontWeight:
        "800",
      fontSize: 13,
      marginTop: 5,
    },

    countdownText: {
      color:
        "#999",
      fontWeight:
        "600",
      fontSize: 13,
      marginTop: 5,
    },

    resendLoading: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 7,
      marginTop: 5,
    },

    // ==================================================
    // HELP BOX
    // ==================================================

    helpBox: {
      marginTop: 28,
      padding: 14,
      borderRadius: 14,
      backgroundColor:
        "#F7F7F7",
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      gap: 10,
    },

    helpIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    helpContent: {
      flex: 1,
    },

    helpTitle: {
      color:
        "#555",
      fontSize: 12,
      fontWeight:
        "800",
      marginBottom: 3,
    },

    helpText: {
      color:
        "#777",
      fontSize: 11,
      lineHeight: 17,
    },

    // ==================================================
    // SECURITY
    // ==================================================

    securityBox: {
      marginTop: 14,
      padding: 14,
      borderRadius: 14,
      backgroundColor:
        "#F7F7F7",
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 8,
    },

    securityText: {
      color:
        "#777",
      fontSize: 11,
      flex: 1,
    },
  });