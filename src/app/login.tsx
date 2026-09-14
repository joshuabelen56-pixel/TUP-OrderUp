import React, { useEffect, useState } from "react";

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
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* =================================================
   CONFIGURATION
================================================= */

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "https://groove-blend-charity.ngrok-free.dev"
).replace(/\/+$/, "");

const API_URL = BASE_URL.endsWith("/api")
  ? BASE_URL
  : `${BASE_URL}/api`;

const USER_STORAGE_KEY = "@tuporderup_user";

const REMEMBER_ME_KEY =
  "@tuporderup_remember_me";

const SAVED_USERNAME_KEY =
  "@tuporderup_saved_username";

const SAVED_PASSWORD_KEY =
  "@tuporderup_saved_password";

/*
 * This key tells the Security page that the user
 * has successfully completed the username/password
 * login flow.
 *
 * The biometric verification itself happens on
 * security.tsx using expo-local-authentication.
 */
const SECURITY_PENDING_KEY =
  "@tuporderup_security_pending";

/* =================================================
   TUPC / TUP LOGO
================================================= */

const TUPC_LOGO = require("../../assets/main-image/logo.png");

/* =================================================
   COLORS
================================================= */

const CARDINAL = "#A6192E";
const CARDINAL_DARK = "#7D1021";
const CARDINAL_DEEP = "#570B17";
const CARDINAL_DEEPER = "#430812";
const CARDINAL_LIGHT = "#F8E7EA";

const WHITE = "#FFFFFF";

const TEXT_DARK = "#242124";
const TEXT_MUTED = "#777276";

const BORDER = "#E5E0E1";
const INPUT_BG = "#FBFAFA";

const GOLD = "#D8B56A";

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

type LoginResponse = {
  success?: boolean;
  message?: string;

  user?: LoginUser;

  otpRequired?: boolean;

  userId?: string;

  maskedEmail?: string;
};

/* =================================================
   LOGIN SCREEN
================================================= */

export default function Login() {
  /* =================================================
     BASIC LOGIN STATE
  ================================================= */

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  /* =================================================
     SAVED ACCOUNT STATE
  ================================================= */

  const [
    savedAccountUsername,
    setSavedAccountUsername,
  ] = useState("");

  const [
    savedAccountPassword,
    setSavedAccountPassword,
  ] = useState("");

  const [
    showSavedAccount,
    setShowSavedAccount,
  ] = useState(false);

  /* =================================================
     LOAD REMEMBERED LOGIN
  ================================================= */

  useEffect(() => {
    const loadRememberedLogin =
      async () => {
        try {
          const remembered =
            await AsyncStorage.getItem(
              REMEMBER_ME_KEY
            );

          if (remembered !== "true") {
            return;
          }

          const savedUsername =
            await AsyncStorage.getItem(
              SAVED_USERNAME_KEY
            );

          const savedPassword =
            await AsyncStorage.getItem(
              SAVED_PASSWORD_KEY
            );

          if (
            savedUsername &&
            savedPassword
          ) {
            setSavedAccountUsername(
              savedUsername
            );

            setSavedAccountPassword(
              savedPassword
            );

            setRememberMe(true);

            console.log(
              "✅ REMEMBER ME: Saved account available"
            );
          }
        } catch (error) {
          console.error(
            "REMEMBER ME LOAD ERROR:",
            error
          );
        }
      };

    loadRememberedLogin();
  }, []);

  /* =================================================
     SELECT SAVED ACCOUNT
  ================================================= */

  const handleSelectSavedAccount =
    () => {
      if (
        !savedAccountUsername ||
        !savedAccountPassword
      ) {
        return;
      }

      setUsername(
        savedAccountUsername
      );

      setPassword(
        savedAccountPassword
      );

      setRememberMe(true);

      setShowSavedAccount(false);

      console.log(
        "✅ REMEMBER ME: Saved account selected"
      );
    };

  /* =================================================
     REMOVE SAVED ACCOUNT
  ================================================= */

  const handleRemoveSavedAccount =
    async () => {
      try {
        await AsyncStorage.multiRemove([
          REMEMBER_ME_KEY,
          SAVED_USERNAME_KEY,
          SAVED_PASSWORD_KEY,
        ]);

        setSavedAccountUsername("");
        setSavedAccountPassword("");
        setRememberMe(false);
        setShowSavedAccount(false);

        console.log(
          "🗑️ REMEMBER ME: Saved account removed"
        );
      } catch (error) {
        console.error(
          "REMOVE SAVED ACCOUNT ERROR:",
          error
        );
      }
    };

  /* =================================================
     ROLE NORMALIZATION
  ================================================= */

  const getNormalizedRole = (
    user?: LoginUser | null
  ) => {
    const role = String(
      user?.role || ""
    )
      .trim()
      .toLowerCase();

    const accountType = String(
      user?.accountType || ""
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
      return role === "staff"
        ? "staff"
        : "admin";
    }

    return "user";
  };

  /* =================================================
     FINAL DASHBOARD NAVIGATION

     IMPORTANT:

     This function is NO LONGER called directly
     after username/password login.

     It is saved for the Security page to use
     after biometric verification.
  ================================================= */

  const navigateByRole = (
    user: LoginUser
  ) => {
    const normalizedRole =
      getNormalizedRole(user);

    console.log(
      "================================"
    );

    console.log(
      "FINAL DASHBOARD NAVIGATION"
    );

    console.log(
      "USER:",
      user.username
    );

    console.log(
      "ROLE:",
      normalizedRole
    );

    console.log(
      "================================"
    );

    /* =================================================
       SELLER
    ================================================= */

    if (
      normalizedRole === "seller"
    ) {
      router.replace(
        "/seller" as any
      );

      return;
    }

    /* =================================================
       ADMIN / STAFF
    ================================================= */

    if (
      normalizedRole === "admin" ||
      normalizedRole === "staff"
    ) {
      router.replace(
        "/admin" as any
      );

      return;
    }

    /* =================================================
       CUSTOMER
    ================================================= */

    router.replace(
      "/tabs"
    );
  };

  /* =================================================
     HANDLE LOGIN
  ================================================= */

  const handleLogin =
    async () => {
      if (loading) {
        return;
      }

      /* ================================================
         CLEAN INPUT
      ================================================ */

      const cleanUsername =
        username
          .trim()
          .toLowerCase();

      const cleanPassword =
        password.trim();

      /* ================================================
         VALIDATION
      ================================================ */

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

      /* ================================================
         API CHECK
      ================================================ */

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
          "TUPC-ORDERUP LOGIN"
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

        /* ==============================================
           CLEAR OLD PENDING OTP SESSION
        ============================================== */

        await AsyncStorage.multiRemove([
          "pending_otp_user_id",
          "pending_otp_email",
          "pending_otp_masked_email",
          "pending_otp_channels",
          "pending_otp_contacts",
        ]);

        /* ==============================================
           CLEAR OLD SECURITY SESSION
        ============================================== */

        await AsyncStorage.removeItem(
          SECURITY_PENDING_KEY
        );

        /* ==============================================
           SEND LOGIN REQUEST
        ============================================== */

        const response =
          await fetch(
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

        /* ==============================================
           READ RESPONSE SAFELY
        ============================================== */

        let data: LoginResponse =
          {};

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

        /* ==============================================
           LOGIN FAILED
        ============================================== */

        if (!response.ok) {
          Alert.alert(
            "Login Failed",
            data.message ||
              "Invalid username or password."
          );

          return;
        }

        /* ==============================================
           GMAIL OTP FLOW
        ============================================== */

        if (
          data.success &&
          data.otpRequired &&
          data.userId
        ) {
          console.log(
            "================================"
          );

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

          console.log(
            "================================"
          );

          /* --------------------------------------------
             SAVE PENDING OTP USER ID
          -------------------------------------------- */

          await AsyncStorage.setItem(
            "pending_otp_user_id",
            data.userId
          );

          /* --------------------------------------------
             SAVE REMEMBER ME STATE
          -------------------------------------------- */

          await AsyncStorage.setItem(
            "pending_otp_remember_me",
            rememberMe
              ? "true"
              : "false"
          );

          /* --------------------------------------------
             SAVE LOGIN CREDENTIALS FOR OTP
          -------------------------------------------- */

          if (rememberMe) {
            await AsyncStorage.setItem(
              "pending_otp_username",
              cleanUsername
            );

            await AsyncStorage.setItem(
              "pending_otp_password",
              cleanPassword
            );
          } else {
            await AsyncStorage.multiRemove([
              "pending_otp_username",
              "pending_otp_password",
            ]);
          }

          /* --------------------------------------------
             SAVE MASKED EMAIL
          -------------------------------------------- */

          await AsyncStorage.setItem(
            "pending_otp_masked_email",
            data.maskedEmail || ""
          );

          /* --------------------------------------------
             SAVE EMAIL COMPATIBILITY KEY
          -------------------------------------------- */

          await AsyncStorage.setItem(
            "pending_otp_email",
            data.maskedEmail || ""
          );

          /* --------------------------------------------
             CLEAR LOGIN FORM
          -------------------------------------------- */

          setUsername("");
          setPassword("");

          /* --------------------------------------------
             GO TO OTP SCREEN
          -------------------------------------------- */

          console.log(
            "REDIRECTING TO OTP SCREEN"
          );

          router.push(
            "../otp"
          );

          return;
        }

        /* ==============================================
           DIRECT LOGIN WITHOUT OTP
        ============================================== */

        if (
          data.user &&
          (
            data.user.id ||
            data.user._id
          )
        ) {
          console.log(
            "DIRECT LOGIN WITHOUT OTP"
          );

          /* --------------------------------------------
             CHECK ACCOUNT STATUS
          -------------------------------------------- */

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

          /* --------------------------------------------
             SAVE USER SESSION
          -------------------------------------------- */

          try {
            await AsyncStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(
                data.user
              )
            );

            console.log(
              "✅ USER SESSION SAVED"
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
              "Login was successful, but the app could not save your session."
            );

            return;
          }

          /* --------------------------------------------
             SAVE REMEMBER ME
          -------------------------------------------- */

          if (rememberMe) {
            await AsyncStorage.multiSet([
              [
                REMEMBER_ME_KEY,
                "true",
              ],
              [
                SAVED_USERNAME_KEY,
                cleanUsername,
              ],
              [
                SAVED_PASSWORD_KEY,
                cleanPassword,
              ],
            ]);
          } else {
            await AsyncStorage.multiRemove([
              REMEMBER_ME_KEY,
              SAVED_USERNAME_KEY,
              SAVED_PASSWORD_KEY,
            ]);
          }

          /* --------------------------------------------
             SAVE SECURITY PENDING USER

             The Security page will read the saved
             USER_STORAGE_KEY after this login.

             We mark that password authentication
             has already succeeded.
          -------------------------------------------- */

          await AsyncStorage.setItem(
            SECURITY_PENDING_KEY,
            "true"
          );

          /* --------------------------------------------
             CLEAR LOGIN FORM
          -------------------------------------------- */

          setUsername("");
          setPassword("");

          /* --------------------------------------------
             GO TO SECURITY PAGE

             IMPORTANT:

             DO NOT GO TO DASHBOARD HERE.

             The user MUST pass the biometric
             verification first.
          -------------------------------------------- */

          console.log(
            "================================"
          );

          console.log(
            "PASSWORD LOGIN SUCCESS"
          );

          console.log(
            "REDIRECTING TO SECURITY PAGE"
          );

          console.log(
            "================================"
          );

          router.replace(
            "/security"
          );

          return;
        }

        /* ==============================================
           UNEXPECTED SERVER RESPONSE
        ============================================== */

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
        /* ==============================================
           NETWORK ERROR
        ============================================== */

        console.error(
          "LOGIN CONNECTION ERROR:",
          error
        );

        Alert.alert(
          "Connection Error",
          "Unable to connect to the TUPC-OrderUp server.\n\nMake sure:\n\n• Your backend is running\n• Your phone and computer are on the same Wi-Fi\n• Your API URL is correct\n• Port 5000 is accessible"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =================================================
     REGISTER
  ================================================= */

  const handleRegister =
    () => {
      if (loading) {
        return;
      }

      router.push(
        "/register"
      );
    };

  /* =================================================
     FORGOT PASSWORD
  ================================================= */

  const handleForgotPassword =
    () => {
      if (loading) {
        return;
      }

      router.push(
        "../forgot-password"
      );
    };

  /* =================================================
     REMEMBER ME
  ================================================= */

  const handleRememberMeToggle =
    async () => {
      const nextValue =
        !rememberMe;

      setRememberMe(
        nextValue
      );

      if (!nextValue) {
        try {
          await AsyncStorage.multiRemove([
            REMEMBER_ME_KEY,
            SAVED_USERNAME_KEY,
            SAVED_PASSWORD_KEY,
          ]);

          setSavedAccountUsername("");
          setSavedAccountPassword("");
          setShowSavedAccount(false);

          console.log(
            "REMEMBER ME DISABLED"
          );
        } catch (error) {
          console.error(
            "REMEMBER ME CLEAR ERROR:",
            error
          );
        }
      }
    };

  /* =================================================
     UI
  ================================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          CARDINAL_DEEPER
        }
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
          style={styles.scroll}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View
            style={styles.screen}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <View
              style={
                styles.topSection
              }
            >
              {/* Decorative circles */}

              <View
                style={
                  styles.decorCircleOne
                }
              />

              <View
                style={
                  styles.decorCircleTwo
                }
              />

              <View
                style={
                  styles.decorCircleThree
                }
              />

              <View
                style={
                  styles.decorLine
                }
              />

              {/* Logo */}

              <View
                style={
                  styles.logoContainer
                }
              >
                <Image
                  source={
                    TUPC_LOGO
                  }
                  style={
                    styles.logo
                  }
                  resizeMode="contain"
                />
              </View>

              {/* Brand */}

              <Text
                style={
                  styles.brand
                }
              >
                TUPC-OrderUp
              </Text>

              <Text
                style={
                  styles.portal
                }
              >
                CAMPUS ORDERING PORTAL
              </Text>
            </View>

            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <View
              style={
                styles.loginPanel
              }
            >
              {/* CARD TOP ACCENT */}

              <View
                style={
                  styles.cardAccent
                }
              />

              {/* TITLE */}

              <View
                style={
                  styles.titleArea
                }
              >
                <Text
                  style={
                    styles.title
                  }
                >
                  Sign In
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Access your TUPC-OrderUp account
                </Text>
              </View>

              {/* =================================================
                  USERNAME
              ================================================= */}

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
                      styles.inputDisabled,
                  ]}
                >
                  <View
                    style={
                      styles.iconBox
                    }
                  >
                    <Ionicons
                      name="person-outline"
                      size={21}
                      color={
                        CARDINAL
                      }
                    />
                  </View>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter your username"
                    placeholderTextColor="#A4A0A1"
                    value={
                      username
                    }
                    onChangeText={(
                      value
                    ) => {
                      setUsername(
                        value
                      );

                      if (
                        value !==
                        savedAccountUsername
                      ) {
                        setShowSavedAccount(
                          false
                        );
                      }
                    }}
                    onFocus={() => {
                      if (
                        savedAccountUsername &&
                        savedAccountPassword &&
                        !loading
                      ) {
                        setShowSavedAccount(
                          true
                        );
                      }
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={
                      !loading
                    }
                    returnKeyType="next"
                    selectionColor={
                      CARDINAL
                    }
                  />
                </View>

                {/* =================================================
                    SAVED ACCOUNT
                ================================================= */}

                {showSavedAccount &&
                  savedAccountUsername &&
                  savedAccountPassword && (
                    <View
                      style={
                        styles.savedAccountContainer
                      }
                    >
                      <View
                        style={
                          styles.savedAccountHeader
                        }
                      >
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={16}
                          color={
                            CARDINAL
                          }
                        />

                        <Text
                          style={
                            styles.savedAccountHeaderText
                          }
                        >
                          SAVED ACCOUNT
                        </Text>
                      </View>

                      <View
                        style={
                          styles.savedAccountRow
                        }
                      >
                        <TouchableOpacity
                          style={
                            styles.savedAccountSelect
                          }
                          onPress={
                            handleSelectSavedAccount
                          }
                          activeOpacity={
                            0.75
                          }
                        >
                          <View
                            style={
                              styles.savedAccountIcon
                            }
                          >
                            <Ionicons
                              name="person"
                              size={18}
                              color={
                                CARDINAL
                              }
                            />
                          </View>

                          <View
                            style={
                              styles.savedAccountInfo
                            }
                          >
                            <Text
                              style={
                                styles.savedAccountUsername
                              }
                            >
                              {
                                savedAccountUsername
                              }
                            </Text>

                            <Text
                              style={
                                styles.savedAccountSubtext
                              }
                            >
                              Tap to use saved account
                            </Text>
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999999"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={
                            styles.savedAccountRemove
                          }
                          onPress={
                            handleRemoveSavedAccount
                          }
                          activeOpacity={
                            0.7
                          }
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#999999"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
              </View>

              {/* =================================================
                  PASSWORD
              ================================================= */}

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
                      styles.inputDisabled,
                  ]}
                >
                  <View
                    style={
                      styles.iconBox
                    }
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={21}
                      color={
                        CARDINAL
                      }
                    />
                  </View>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter your password"
                    placeholderTextColor="#A4A0A1"
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
                    autoCorrect={false}
                    editable={
                      !loading
                    }
                    returnKeyType="done"
                    selectionColor={
                      CARDINAL
                    }
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

              {/* =================================================
                  OPTIONS
              ================================================= */}

              <View
                style={
                  styles.loginOptions
                }
              >
                <TouchableOpacity
                  style={
                    styles.rememberMeButton
                  }
                  onPress={
                    handleRememberMeToggle
                  }
                  disabled={
                    loading
                  }
                  activeOpacity={
                    0.7
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={
                          WHITE
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={
                      styles.rememberMeText
                    }
                  >
                    Remember me
                  </Text>
                </TouchableOpacity>

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
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* =================================================
                  SIGN IN BUTTON

                  IMPORTANT:

                  This does ONLY username/password
                  authentication.

                  It does NOT show biometric here.

                  Successful login goes to:
                  /security
              ================================================= */}

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
                  0.85
                }
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={
                        WHITE
                      }
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
                      SIGN IN
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={21}
                      color={
                        WHITE
                      }
                    />
                  </>
                )}
              </TouchableOpacity>

              {/* =================================================
                  REGISTER
              ================================================= */}

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
                    Create an account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* =================================================
                UNIVERSITY NAME
            ================================================= */}

            <View
              style={
                styles.universityFooter
              }
            >
              <View
                style={
                  styles.footerDivider
                }
              />

              <Text
                style={
                  styles.footerUniversity
                }
              >
                TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({
  /* =================================================
     SCREEN
  ================================================= */

  safeArea: {
    flex: 1,
    backgroundColor:
      CARDINAL_DEEPER,
  },

  keyboard: {
    flex: 1,
    backgroundColor:
      CARDINAL_DEEPER,
  },

  scroll: {
    flex: 1,
    backgroundColor:
      CARDINAL_DEEPER,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 18,
  },

  screen: {
    flexGrow: 1,
    backgroundColor:
      CARDINAL_DEEPER,
    overflow: "hidden",
  },

  /* =================================================
     TOP SECTION
  ================================================= */

  topSection: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      CARDINAL_DEEPER,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    overflow: "hidden",
  },

  /* =================================================
     DECORATION
  ================================================= */

  decorCircleOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    right: -165,
    top: -170,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.07)",
  },

  decorCircleTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    left: -135,
    bottom: -135,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.06)",
  },

  decorCircleThree: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    right: 25,
    bottom: 35,
    borderWidth: 1,
    borderColor:
      "rgba(216,181,106,0.12)",
  },

  decorLine: {
    position: "absolute",
    width: 650,
    height: 1,
    bottom: 25,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    transform: [
      {
        rotate: "-7deg",
      },
    ],
  },

  /* =================================================
     LOGO
  ================================================= */

  logoContainer: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor:
      WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 3,
    borderColor:
      "rgba(216,181,106,0.65)",
    elevation: 9,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 11,
  },

  logo: {
    width: 98,
    height: 98,
  },

  /* =================================================
     BRAND
  ================================================= */

  brand: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  portal: {
    color:
      "rgba(255,255,255,0.68)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2.4,
    marginTop: 7,
  },

  /* =================================================
     LOGIN PANEL
  ================================================= */

  loginPanel: {
    backgroundColor:
      WHITE,
    marginHorizontal: 14,
    marginTop: -20,
    borderRadius: 27,
    paddingHorizontal: 25,
    paddingTop: 27,
    paddingBottom: 25,
    zIndex: 10,
    elevation: 11,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.17,
    shadowRadius: 17,
  },

  /* =================================================
     CARD ACCENT
  ================================================= */

  cardAccent: {
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor:
      CARDINAL,
    marginBottom: 11,
  },

  /* =================================================
     TITLE
  ================================================= */

  titleArea: {
    marginBottom: 25,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color:
      TEXT_DARK,
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 13,
    color:
      TEXT_MUTED,
    marginTop: 5,
  },

  /* =================================================
     INPUT
  ================================================= */

  inputGroup: {
    marginBottom: 19,
  },

  label: {
    fontSize: 10,
    fontWeight: "800",
    color:
      "#5E595B",
    letterSpacing: 1.3,
    marginBottom: 7,
  },

  inputWrapper: {
    height: 57,
    borderRadius: 13,
    borderWidth: 1,
    borderColor:
      BORDER,
    backgroundColor:
      INPUT_BG,
    flexDirection: "row",
    alignItems: "center",
  },

  inputDisabled: {
    opacity: 0.6,
  },

  iconBox: {
    width: 49,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color:
      TEXT_DARK,
    paddingHorizontal: 4,
  },

  eyeButton: {
    width: 49,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =================================================
     SAVED ACCOUNT
  ================================================= */

  savedAccountContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor:
      "#E7DADD",
    borderRadius: 13,
    backgroundColor:
      "#FFF9FA",
    overflow: "hidden",
  },

  savedAccountHeader: {
    height: 37,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor:
      "#F0E4E6",
  },

  savedAccountHeaderText: {
    fontSize: 9,
    fontWeight: "800",
    color:
      CARDINAL,
    letterSpacing: 1,
  },

  savedAccountRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  savedAccountSelect: {
    flex: 1,
    minHeight: 63,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
  },

  savedAccountIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor:
      CARDINAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  savedAccountInfo: {
    flex: 1,
  },

  savedAccountUsername: {
    fontSize: 14,
    fontWeight: "800",
    color:
      TEXT_DARK,
  },

  savedAccountSubtext: {
    fontSize: 10.5,
    color:
      "#8B8587",
    marginTop: 2,
  },

  savedAccountRemove: {
    width: 49,
    minHeight: 63,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor:
      "#F0E4E6",
  },

  /* =================================================
     OPTIONS
  ================================================= */

  loginOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginTop: -2,
    marginBottom: 20,
  },

  rememberMeButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor:
      "#CFC8CA",
    backgroundColor:
      WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  checkboxChecked: {
    backgroundColor:
      CARDINAL,
    borderColor:
      CARDINAL,
  },

  rememberMeText: {
    fontSize: 12,
    color:
      "#666163",
    fontWeight: "600",
  },

  forgotButton: {
    alignSelf: "center",
  },

  forgotText: {
    color:
      CARDINAL,
    fontSize: 12,
    fontWeight: "700",
  },

  /* =================================================
     LOGIN BUTTON
  ================================================= */

  loginButton: {
    height: 57,
    backgroundColor:
      CARDINAL,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 4,
    shadowColor:
      CARDINAL,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color:
      WHITE,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  /* =================================================
     REGISTER
  ================================================= */

  registerContainer: {
    flexDirection: "row",
    justifyContent:
      "center",
    alignItems: "center",
    marginTop: 18,
  },

  noAccount: {
    fontSize: 12,
    color:
      "#858083",
    marginRight: 5,
  },

  registerText: {
    fontSize: 12,
    color:
      CARDINAL,
    fontWeight: "800",
  },

  /* =================================================
     UNIVERSITY FOOTER
  ================================================= */

  universityFooter: {
    alignItems: "center",
    justifyContent:
      "center",
    paddingTop: 22,
    paddingBottom: 8,
    paddingHorizontal: 28,
  },

  footerDivider: {
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor:
      "rgba(216,181,106,0.7)",
    marginBottom: 9,
  },

  footerUniversity: {
    fontSize: 8.5,
    fontWeight: "800",
    color:
      "rgba(255,255,255,0.72)",
    letterSpacing: 1.1,
    textAlign: "center",
  },
});