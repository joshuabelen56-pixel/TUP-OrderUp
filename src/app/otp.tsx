import React, { useEffect, useRef, useState } from "react";

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

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

/* =========================================================
   CONFIG
========================================================= */

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.18.24:5000"
).replace(/\/+$/, "");

const API_URL = BASE_URL.endsWith("/api")
  ? BASE_URL
  : `${BASE_URL}/api`;

/* =========================================================
   AUTH STORAGE KEYS
========================================================= */

const TOKEN_STORAGE_KEY = "@tuporderup_token";
const USER_STORAGE_KEY = "@tuporderup_user";
const LOGIN_STATUS_KEY = "@tuporderup_logged_in";

const SECURITY_PENDING_KEY =
  "@tuporderup_security_pending";

const OLD_AUTH_KEYS = [
  "auth_token",
  "user",
  "is_logged_in",
];

/* =========================================================
   PENDING OTP KEYS
========================================================= */

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

/* =========================================================
   REMEMBER ME PENDING KEYS
========================================================= */

const PENDING_REMEMBER_ME_KEY =
  "pending_otp_remember_me";

const PENDING_USERNAME_KEY =
  "pending_otp_username";

const PENDING_PASSWORD_KEY =
  "pending_otp_password";

/* =========================================================
   REMEMBER ME SAVED KEYS
========================================================= */

const SAVED_USERNAME_KEY =
  "@tuporderup_saved_username";

const SAVED_PASSWORD_KEY =
  "@tuporderup_saved_password";

const REMEMBER_ME_KEY =
  "@tuporderup_remember_me";

/* =========================================================
   OTP SCREEN
========================================================= */

export default function OTPScreen() {
  /* =======================================================
     ROUTE PARAMS
  ======================================================= */

  const params = useLocalSearchParams<{
    email?: string;
    userId?: string;
  }>();

  const routeEmail =
    typeof params.email === "string"
      ? params.email
      : "";

  const routeUserId =
    typeof params.userId === "string"
      ? params.userId
      : "";

  /* =======================================================
     STATE
  ======================================================= */

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [resendSeconds, setResendSeconds] =
    useState(60);

  const [initialized, setInitialized] =
    useState(false);

  const [
    verifyingAutomatically,
    setVerifyingAutomatically,
  ] = useState(false);

  const inputRef =
    useRef<TextInput>(null);

  const verificationInProgress =
    useRef(false);

  /* =======================================================
     LOAD OTP SESSION
  ======================================================= */

  useEffect(() => {
    loadPendingOTP();
  }, []);

  /* =======================================================
     RESEND COUNTDOWN
  ======================================================= */

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendSeconds((previous) =>
        previous > 0
          ? previous - 1
          : 0
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resendSeconds]);

  /* =======================================================
     LOAD OTP SESSION
  ======================================================= */

  const loadPendingOTP = async () => {
    try {
      /*
       * First priority:
       * userId passed through route
       */
      let storedUserId = routeUserId;

      /*
       * If route does not contain userId,
       * get it from AsyncStorage.
       */
      if (!storedUserId) {
        storedUserId =
          (await AsyncStorage.getItem(
            PENDING_USER_ID_KEY
          )) || "";
      }

      /*
       * Email from register.tsx route
       */
      let storedEmail = routeEmail;

      /*
       * If route has no email,
       * get it from AsyncStorage.
       */
      if (!storedEmail) {
        storedEmail =
          (await AsyncStorage.getItem(
            PENDING_EMAIL_KEY
          )) || "";
      }

      const storedMaskedEmail =
        await AsyncStorage.getItem(
          PENDING_MASKED_EMAIL_KEY
        );

      /*
       * If route email exists,
       * save it for resend/back navigation.
       */
      if (storedEmail) {
        await AsyncStorage.setItem(
          PENDING_EMAIL_KEY,
          storedEmail
        );
      }

      /*
       * If route userId exists,
       * save it as pending OTP user.
       */
      if (storedUserId) {
        await AsyncStorage.setItem(
          PENDING_USER_ID_KEY,
          storedUserId
        );
      }

      /*
       * Validate user ID.
       */
      if (!storedUserId) {
        Alert.alert(
          "Session Expired",
          "Your verification session is missing. Please register or login again.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("../login");
              },
            },
          ]
        );

        return;
      }

      /*
       * Set screen state.
       */
      setUserId(storedUserId);

      setEmail(
        storedMaskedEmail ||
          storedEmail ||
          ""
      );

      setInitialized(true);

      /*
       * Focus OTP input.
       */
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);

      console.log(
        "================================"
      );

      console.log(
        "OTP SESSION LOADED"
      );

      console.log(
        "USER ID:",
        storedUserId
      );

      console.log(
        "EMAIL:",
        storedEmail || "N/A"
      );

      console.log(
        "ROUTE EMAIL:",
        routeEmail || "N/A"
      );

      console.log(
        "ROUTE USER ID:",
        routeUserId || "N/A"
      );

      console.log(
        "================================"
      );
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

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  const verifyOTP = async (
    otpCode?: string
  ) => {
    const cleanOTP = (
      otpCode !== undefined
        ? otpCode
        : otp
    )
      .replace(/\D/g, "")
      .slice(0, 6);

    /* -----------------------------------------------------
       VALIDATE USER
    ----------------------------------------------------- */

    if (!userId) {
      Alert.alert(
        "Session Expired",
        "Your verification session is missing. Please register or login again.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("../login");
            },
          },
        ]
      );

      return;
    }

    /* -----------------------------------------------------
       VALIDATE OTP
    ----------------------------------------------------- */

    if (cleanOTP.length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit verification code."
      );

      return;
    }

    /* -----------------------------------------------------
       PREVENT DUPLICATE REQUEST
    ----------------------------------------------------- */

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

      console.log(
        "OTP:",
        cleanOTP
      );

      console.log(
        "================================"
      );

      /* ---------------------------------------------------
         API REQUEST
      --------------------------------------------------- */

      const response = await fetch(
        `${API_URL}/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            userId,
            otp: cleanOTP,
          }),
        }
      );

      /* ---------------------------------------------------
         RESPONSE
      --------------------------------------------------- */

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "OTP RESPONSE:",
        data
      );

      /* ---------------------------------------------------
         API ERROR
      --------------------------------------------------- */

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

      /* ===================================================
         SUCCESSFUL OTP VERIFICATION
      =================================================== */

      if (
        data.success &&
        data.token &&
        data.user
      ) {
        console.log(
          "OTP VERIFIED SUCCESSFULLY"
        );

        /* =================================================
           REMEMBER ME
        ================================================= */

        const rememberMe =
          (
            await AsyncStorage.getItem(
              PENDING_REMEMBER_ME_KEY
            )
          ) === "true";

        const pendingUsername =
          await AsyncStorage.getItem(
            PENDING_USERNAME_KEY
          );

        const pendingPassword =
          await AsyncStorage.getItem(
            PENDING_PASSWORD_KEY
          );

        /* =================================================
           SAVE REMEMBERED ACCOUNT
        ================================================= */

        if (
          rememberMe &&
          pendingUsername &&
          pendingPassword
        ) {
          await AsyncStorage.multiSet([
            [
              REMEMBER_ME_KEY,
              "true",
            ],

            [
              SAVED_USERNAME_KEY,
              pendingUsername,
            ],

            [
              SAVED_PASSWORD_KEY,
              pendingPassword,
            ],
          ]);

          console.log(
            "================================"
          );

          console.log(
            "REMEMBER ME ENABLED"
          );

          console.log(
            "SAVED USERNAME:",
            pendingUsername
          );

          console.log(
            "SAVED PASSWORD: YES"
          );

          console.log(
            "================================"
          );
        } else {
          await AsyncStorage.multiRemove([
            REMEMBER_ME_KEY,
            SAVED_USERNAME_KEY,
            SAVED_PASSWORD_KEY,
          ]);

          console.log(
            "REMEMBER ME DISABLED"
          );
        }

        /* =================================================
           SAVE AUTH TOKEN
        ================================================= */

        await AsyncStorage.setItem(
          TOKEN_STORAGE_KEY,
          String(data.token)
        );

        /* =================================================
           SAVE USER
        ================================================= */

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(data.user)
        );

        /* =================================================
           SAVE LOGIN STATUS
        ================================================= */

        await AsyncStorage.setItem(
          LOGIN_STATUS_KEY,
          "true"
        );

        /* =================================================
           SECURITY VERIFICATION PENDING
        ================================================= */

        await AsyncStorage.setItem(
          SECURITY_PENDING_KEY,
          "true"
        );

        /* =================================================
           REMOVE OLD AUTH KEYS
        ================================================= */

        await AsyncStorage.multiRemove(
          OLD_AUTH_KEYS
        );

        /* =================================================
           GET ROLE
        ================================================= */

        const role = String(
          data.user?.role || ""
        )
          .trim()
          .toLowerCase();

        /* =================================================
           AUTH SESSION LOG
        ================================================= */

        console.log(
          "================================"
        );

        console.log(
          "AUTH SESSION SAVED"
        );

        console.log(
          "USER ID:",
          data.user?.id ||
            data.user?._id ||
            "N/A"
        );

        console.log(
          "USERNAME:",
          data.user?.username ||
            "N/A"
        );

        console.log(
          "ACCOUNT TYPE:",
          data.user?.accountType ||
            "N/A"
        );

        console.log(
          "USER ROLE:",
          role
        );

        console.log(
          "ACCOUNT STATUS:",
          data.user?.accountStatus ||
            "N/A"
        );

        console.log(
          "TOKEN SAVED:",
          true
        );

        console.log(
          "USER SAVED:",
          true
        );

        console.log(
          "LOGIN STATUS:",
          "true"
        );

        console.log(
          "SECURITY PENDING:",
          "true"
        );

        console.log(
          "================================"
        );

        /* =================================================
           REMOVE PENDING OTP DATA
        ================================================= */

        await AsyncStorage.multiRemove([
          PENDING_USER_ID_KEY,
          PENDING_EMAIL_KEY,
          PENDING_MASKED_EMAIL_KEY,
          PENDING_CHANNELS_KEY,
          PENDING_CONTACTS_KEY,
          PENDING_REMEMBER_ME_KEY,
          PENDING_USERNAME_KEY,
          PENDING_PASSWORD_KEY,
        ]);

        /* =================================================
           VERIFY STORAGE
        ================================================= */

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

        const savedSecurityPending =
          await AsyncStorage.getItem(
            SECURITY_PENDING_KEY
          );

        const savedRememberMe =
          await AsyncStorage.getItem(
            REMEMBER_ME_KEY
          );

        const savedUsername =
          await AsyncStorage.getItem(
            SAVED_USERNAME_KEY
          );

        console.log(
          "================================"
        );

        console.log(
          "FINAL AUTH STORAGE CHECK"
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
          "SECURITY PENDING:",
          savedSecurityPending
        );

        console.log(
          "REMEMBER ME:",
          savedRememberMe
        );

        console.log(
          "SAVED USERNAME:",
          savedUsername
        );

        console.log(
          "USER ROLE:",
          role
        );

        console.log(
          "================================"
        );

        /* =================================================
           CLEAR OTP FORM
        ================================================= */

        setOtp("");

        /* =================================================
           NEXT:
           OTP
             ↓
           SECURITY
             ↓
           FACE ID / FINGERPRINT
             ↓
           ROLE DASHBOARD
        ================================================= */

        console.log(
          "================================"
        );

        console.log(
          "OTP VERIFIED"
        );

        console.log(
          "REDIRECTING TO SECURITY VERIFICATION"
        );

        console.log(
          "ROUTE: /security"
        );

        console.log(
          "================================"
        );

        router.replace("/security");

        return;
      }

      /* ---------------------------------------------------
         UNEXPECTED SUCCESS RESPONSE
      --------------------------------------------------- */

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

      setVerifyingAutomatically(false);
    }
  };

  /* =======================================================
     OTP INPUT
  ======================================================= */

  const handleOTPChange = (
    value: string
  ) => {
    const clean = value
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(clean);

    /*
     * Automatically verify when
     * all 6 digits are entered.
     */
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

  /* =======================================================
     RESEND OTP
  ======================================================= */

  const resendOTP = async () => {
    if (!userId) {
      Alert.alert(
        "Session Expired",
        "Please register or login again."
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

      /* ---------------------------------------------------
         API
      --------------------------------------------------- */

      const response = await fetch(
        `${API_URL}/auth/resend-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            userId,
          }),
        }
      );

      /* ---------------------------------------------------
         RESPONSE
      --------------------------------------------------- */

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

      /* ---------------------------------------------------
         ERROR
      --------------------------------------------------- */

      if (!response.ok) {
        if (data.retryAfter) {
          setResendSeconds(
            Number(data.retryAfter)
          );
        }

        Alert.alert(
          "Unable to Resend",
          data.message ||
            "Please wait and try again."
        );

        return;
      }

      /* ---------------------------------------------------
         SUCCESS
      --------------------------------------------------- */

      setOtp("");

      setResendSeconds(60);

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

  /* =======================================================
     BACK TO LOGIN
  ======================================================= */

  const goBackToLogin = async () => {
    try {
      await AsyncStorage.multiRemove([
        PENDING_USER_ID_KEY,
        PENDING_EMAIL_KEY,
        PENDING_MASKED_EMAIL_KEY,
        PENDING_CHANNELS_KEY,
        PENDING_CONTACTS_KEY,
        PENDING_REMEMBER_ME_KEY,
        PENDING_USERNAME_KEY,
        PENDING_PASSWORD_KEY,
        SECURITY_PENDING_KEY,
      ]);
    } catch (error) {
      console.error(
        "CLEAR OTP SESSION ERROR:",
        error
      );
    }

    router.replace("../login");
  };

  /* =======================================================
     DISPLAY EMAIL
  ======================================================= */

  const displayEmail =
    email ||
    "your registered Gmail address";

  /* =======================================================
     UI
  ======================================================= */

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
          {/* BACK BUTTON */}

          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackToLogin}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#222"
            />

            <Text
              style={styles.backText}
            >
              Back to Login
            </Text>
          </TouchableOpacity>

          {/* MAIL ICON */}

          <View
            style={styles.iconContainer}
          >
            <View
              style={styles.iconCircle}
            >
              <Ionicons
                name="mail-outline"
                size={45}
                color="#C41E3A"
              />
            </View>
          </View>

          {/* TITLE */}

          <Text style={styles.title}>
            Check Your Gmail
          </Text>

          <Text
            style={styles.description}
          >
            We sent a 6-digit verification
            code to your registered email
            address.
          </Text>

          {/* EMAIL CARD */}

          <View
            style={styles.emailCard}
          >
            <View
              style={styles.emailIcon}
            >
              <Ionicons
                name="mail"
                size={22}
                color="#C41E3A"
              />
            </View>

            <View
              style={styles.emailInfo}
            >
              <Text
                style={styles.emailLabel}
              >
                Verification Email
              </Text>

              <Text
                style={styles.emailValue}
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

          {/* DIVIDER */}

          <View
            style={styles.divider}
          >
            <View
              style={styles.dividerLine}
            />

            <Text
              style={styles.dividerText}
            >
              VERIFICATION CODE
            </Text>

            <View
              style={styles.dividerLine}
            />
          </View>

          {/* OTP */}

          <Text
            style={styles.otpLabel}
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

          {/* DIGIT INDICATOR */}

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

          {/* VERIFY BUTTON */}

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (loading ||
                otp.length !== 6) &&
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

          {/* AUTO VERIFY */}

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

          {/* RESEND */}

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
                disabled={resending}
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

          {/* HELP */}

          <View
            style={styles.helpBox}
          >
            <View
              style={styles.helpIcon}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#777"
              />
            </View>

            <View
              style={styles.helpContent}
            >
              <Text
                style={styles.helpTitle}
              >
                Can't find the email?
              </Text>

              <Text
                style={styles.helpText}
              >
                Check your Spam, Junk, or
                Promotions folder. The
                verification code expires
                after a few minutes.
              </Text>
            </View>
          </View>

          {/* SECURITY */}

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

/* =========================================================
   STYLES
========================================================= */

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
    paddingTop: 18,
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
  },

  backText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFF0F3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE0E6",
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    color: "#222",
  },

  description: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },

  emailCard: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },

  emailIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFF0F3",
    justifyContent: "center",
    alignItems: "center",
  },

  emailInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  emailLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },

  emailValue: {
    fontSize: 13,
    color: "#222",
    fontWeight: "800",
    marginTop: 4,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  otpLabel: {
    textAlign: "center",
    color: "#333",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  otpInput: {
    height: 64,
    borderWidth: 1.5,
    borderColor: "#DCDCDC",
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: 10,
    color: "#222",
    paddingLeft: 10,
  },

  otpInputComplete: {
    borderColor: "#C41E3A",
    backgroundColor: "#FFF7F8",
  },

  digitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 13,
  },

  digitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DADADA",
  },

  digitDotActive: {
    backgroundColor: "#C41E3A",
  },

  verifyButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#C41E3A",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: 18,
  },

  disabledButton: {
    opacity: 0.5,
  },

  verifyText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  autoVerifyBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },

  autoVerifyText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  resendText: {
    fontSize: 13,
    color: "#777",
  },

  resendLink: {
    color: "#C41E3A",
    fontWeight: "800",
    fontSize: 13,
    marginTop: 5,
  },

  countdownText: {
    color: "#999",
    fontWeight: "600",
    fontSize: 13,
    marginTop: 5,
  },

  resendLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 5,
  },

  helpBox: {
    marginTop: 28,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  helpIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  helpContent: {
    flex: 1,
  },

  helpTitle: {
    color: "#555",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 3,
  },

  helpText: {
    color: "#777",
    fontSize: 11,
    lineHeight: 17,
  },

  securityBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  securityText: {
    color: "#777",
    fontSize: 11,
    flex: 1,
  },
});

