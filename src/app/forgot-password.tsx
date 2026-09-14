import React, { useMemo, useState } from "react";

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

const BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "https://groove-blend-charity.ngrok-free.dev"
).replace(/\/+$/, "");

const API_URL = BASE_URL.endsWith("/api")
  ? BASE_URL
  : `${BASE_URL}/api`;

const PRIMARY = "#C41E3A";
const DARK_RED = "#8F1029";

/* ================================================= */
/* FORGOT PASSWORD SCREEN */
/* ================================================= */

export default function ForgotPassword() {
  const [step, setStep] = useState<"username" | "otp" | "password">(
    "username"
  );

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================================================= */
  /* PASSWORD STRENGTH */
  /* ================================================= */

  const passwordStrength = useMemo(() => {
    const password = newPassword;

    let score = 0;

    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    let label = "";
    let color = "#E5E5E5";

    if (!password) {
      label = "";
      color = "#E5E5E5";
    } else if (score <= 2) {
      label = "Weak";
      color = "#D32F2F";
    } else if (score === 3) {
      label = "Fair";
      color = "#F57C00";
    } else if (score === 4) {
      label = "Good";
      color = "#FBC02D";
    } else {
      label = "Strong";
      color = "#2E7D32";
    }

    return {
      score,
      label,
      color,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial,
    };
  }, [newPassword]);

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  /* ================================================= */
  /* SEND OTP */
  /* ================================================= */

  const handleSendOTP = async () => {
    if (loading) {
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      Alert.alert(
        "Username Required",
        "Please enter your username."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: cleanUsername,
          }),
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        Alert.alert(
          "Server Error",
          "The server returned an invalid response."
        );
        return;
      }

      console.log(
        "FORGOT PASSWORD STATUS:",
        response.status
      );

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        Alert.alert(
          "Unable to Continue",
          data.message ||
            "We could not start password recovery."
        );
        return;
      }

      if (!data.userId) {
        Alert.alert(
          "Recovery Error",
          "The server did not return the account information required for verification."
        );
        return;
      }

      setUsername(cleanUsername);
      setUserId(String(data.userId));
      setMaskedEmail(data.maskedEmail || "");
      setStep("otp");

      Alert.alert(
        "Verification Code Sent",
        data.maskedEmail
          ? `A verification code has been sent to ${data.maskedEmail}.`
          : "A verification code has been sent to your registered email."
      );
    } catch (error) {
      console.error(
        "FORGOT PASSWORD SEND OTP ERROR:",
        error
      );

      Alert.alert(
        "Connection Error",
        "Unable to connect to the TUP-OrderUp server.\n\nMake sure:\n\n• Your backend is running\n• Your device and computer are on the same Wi-Fi\n• Your API URL is correct"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* VERIFY OTP */
  /* ================================================= */

  const handleVerifyOTP = async () => {
    if (loading) {
      return;
    }

    const cleanOTP = otp.trim();

    if (!cleanOTP) {
      Alert.alert(
        "OTP Required",
        "Please enter the 6-digit verification code."
      );
      return;
    }

    if (!/^\d{6}$/.test(cleanOTP)) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit verification code."
      );
      return;
    }

    if (!userId) {
      Alert.alert(
        "Recovery Error",
        "Your password recovery session has expired. Please start again."
      );

      setStep("username");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/forgot-password/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId,
            otp: cleanOTP,
          }),
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        Alert.alert(
          "Server Error",
          "The server returned an invalid response."
        );
        return;
      }

      console.log(
        "FORGOT PASSWORD VERIFY STATUS:",
        response.status
      );

      console.log(
        "FORGOT PASSWORD VERIFY RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        Alert.alert(
          "Verification Failed",
          data.message ||
            "The verification code is incorrect or expired."
        );
        return;
      }

      setOtp("");
      setStep("password");
    } catch (error) {
      console.error(
        "FORGOT PASSWORD VERIFY ERROR:",
        error
      );

      Alert.alert(
        "Connection Error",
        "Unable to connect to the TUP-OrderUp server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* RESET PASSWORD */
  /* ================================================= */

  const handleResetPassword = async () => {
    if (loading) {
      return;
    }

    const cleanPassword = newPassword.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanPassword) {
      Alert.alert(
        "Password Required",
        "Please enter your new password."
      );
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Your new password must be at least 6 characters."
      );
      return;
    }

    if (!cleanConfirmPassword) {
      Alert.alert(
        "Confirm Password",
        "Please confirm your new password."
      );
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    if (!userId) {
      Alert.alert(
        "Recovery Error",
        "Your password recovery session is invalid. Please start again."
      );

      setStep("username");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/forgot-password/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId,
            newPassword: cleanPassword,
          }),
        }
      );

      let data: any = {};

      try {
        data = await response.json();
      } catch {
        Alert.alert(
          "Server Error",
          "The server returned an invalid response."
        );
        return;
      }

      console.log(
        "FORGOT PASSWORD RESET STATUS:",
        response.status
      );

      console.log(
        "FORGOT PASSWORD RESET RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        Alert.alert(
          "Password Reset Failed",
          data.message ||
            "Unable to reset your password."
        );
        return;
      }

      /* --------------------------------------------- */
      /* CLEAR SAVED PASSWORD IF REMEMBER ME EXISTS */
      /* --------------------------------------------- */

      try {
        await AsyncStorage.multiRemove([
          "@tuporderup_remember_me",
          "@tuporderup_saved_username",
          "@tuporderup_saved_password",
        ]);
      } catch (storageError) {
        console.error(
          "CLEAR SAVED PASSWORD ERROR:",
          storageError
        );
      }

      Alert.alert(
        "Password Reset Successful",
        "Your password has been changed successfully. You can now sign in using your new password.",
        [
          {
            text: "Go to Login",
            onPress: () => {
              router.replace("/login");
            },
          },
        ],
        {
          cancelable: false,
        }
      );
    } catch (error) {
      console.error(
        "FORGOT PASSWORD RESET ERROR:",
        error
      );

      Alert.alert(
        "Connection Error",
        "Unable to connect to the TUP-OrderUp server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================================= */
  /* BACK */
  /* ================================================= */

  const handleBack = () => {
    if (loading) {
      return;
    }

    if (step === "otp") {
      setOtp("");
      setStep("username");
      return;
    }

    if (step === "password") {
      setNewPassword("");
      setConfirmPassword("");
      setStep("otp");
      return;
    }

    router.back();
  };

  /* ================================================= */
  /* STEP TITLE */
  /* ================================================= */

  const getTitle = () => {
    if (step === "username") {
      return "Forgot Password?";
    }

    if (step === "otp") {
      return "Verify Your Account";
    }

    return "Create New Password";
  };

  const getDescription = () => {
    if (step === "username") {
      return "Enter your username to receive a verification code.";
    }

    if (step === "otp") {
      return maskedEmail
        ? `Enter the 6-digit code sent to ${maskedEmail}.`
        : "Enter the 6-digit verification code sent to your email.";
    }

    return "Create a new secure password for your account.";
  };

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <SafeAreaView style={styles.safeArea}>
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BACK BUTTON */}

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#333333"
            />

            <Text style={styles.backText}>
              Back
            </Text>
          </TouchableOpacity>

          {/* HEADER */}

          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons
                name={
                  step === "username"
                    ? "lock-open-outline"
                    : step === "otp"
                    ? "shield-checkmark-outline"
                    : "key-outline"
                }
                size={32}
                color={PRIMARY}
              />
            </View>

            <Text style={styles.appName}>
              TUP-OrderUp
            </Text>

            <Text style={styles.subtitle}>
              Secure account recovery
            </Text>
          </View>

          {/* CARD */}

          <View style={styles.card}>
            {/* PROGRESS */}

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressStep,
                  styles.progressActive,
                ]}
              >
                <Text
                  style={styles.progressNumberActive}
                >
                  1
                </Text>
              </View>

              <View
                style={[
                  styles.progressLine,
                  step !== "username" &&
                    styles.progressLineActive,
                ]}
              />

              <View
                style={[
                  styles.progressStep,
                  step !== "username" &&
                    styles.progressActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressNumber,
                    step !== "username" &&
                      styles.progressNumberActive,
                  ]}
                >
                  2
                </Text>
              </View>

              <View
                style={[
                  styles.progressLine,
                  step === "password" &&
                    styles.progressLineActive,
                ]}
              />

              <View
                style={[
                  styles.progressStep,
                  step === "password" &&
                    styles.progressActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressNumber,
                    step === "password" &&
                      styles.progressNumberActive,
                  ]}
                >
                  3
                </Text>
              </View>
            </View>

            {/* TITLE */}

            <Text style={styles.title}>
              {getTitle()}
            </Text>

            <Text style={styles.description}>
              {getDescription()}
            </Text>

            {/* ====================================== */}
            {/* STEP 1 */}
            {/* ====================================== */}

            {step === "username" && (
              <View>
                <Text style={styles.label}>
                  USERNAME
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    loading &&
                      styles.inputDisabled,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={21}
                    color="#777777"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#A0A0A0"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={
                      handleSendOTP
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleSendOTP}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        SENDING CODE...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        SEND VERIFICATION CODE
                      </Text>

                      <Ionicons
                        name="arrow-forward"
                        size={19}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* ====================================== */}
            {/* STEP 2 */}
            {/* ====================================== */}

            {step === "otp" && (
              <View>
                <Text style={styles.label}>
                  VERIFICATION CODE
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    loading &&
                      styles.inputDisabled,
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={21}
                    color="#777777"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={[
                      styles.input,
                      styles.otpInput,
                    ]}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#A0A0A0"
                    value={otp}
                    onChangeText={(value) =>
                      setOtp(
                        value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={
                      handleVerifyOTP
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        VERIFYING...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        VERIFY CODE
                      </Text>

                      <Ionicons
                        name="checkmark"
                        size={20}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.helperText}>
                  Check your registered email for
                  your verification code.
                </Text>
              </View>
            )}

            {/* ====================================== */}
            {/* STEP 3 */}
            {/* ====================================== */}

            {step === "password" && (
              <View>
                {/* NEW PASSWORD */}

                <Text style={styles.label}>
                  NEW PASSWORD
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    loading &&
                      styles.inputDisabled,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={21}
                    color="#777777"
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter new password"
                    placeholderTextColor="#A0A0A0"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={
                      !showNewPassword
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }
                    disabled={loading}
                  >
                    <Ionicons
                      name={
                        showNewPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={21}
                      color="#777777"
                    />
                  </TouchableOpacity>
                </View>

                {/* PASSWORD STRENGTH */}

                {newPassword.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthHeader}>
                      <Text style={styles.strengthTitle}>
                        PASSWORD STRENGTH
                      </Text>

                      <Text
                        style={[
                          styles.strengthLabel,
                          {
                            color:
                              passwordStrength.color,
                          },
                        ]}
                      >
                        {passwordStrength.label.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.strengthBarBackground}>
                      <View
                        style={[
                          styles.strengthBar,
                          {
                            width: `${
                              (passwordStrength.score /
                                5) *
                              100
                            }%`,
                            backgroundColor:
                              passwordStrength.color,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.requirements}>
                      <PasswordRequirement
                        valid={
                          passwordStrength.hasMinLength
                        }
                        text="At least 6 characters"
                      />

                      <PasswordRequirement
                        valid={
                          passwordStrength.hasUppercase
                        }
                        text="One uppercase letter"
                      />

                      <PasswordRequirement
                        valid={
                          passwordStrength.hasLowercase
                        }
                        text="One lowercase letter"
                      />

                      <PasswordRequirement
                        valid={
                          passwordStrength.hasNumber
                        }
                        text="One number"
                      />

                      <PasswordRequirement
                        valid={
                          passwordStrength.hasSpecial
                        }
                        text="One special character"
                      />
                    </View>
                  </View>
                )}

                {!newPassword && (
                  <Text style={styles.passwordHint}>
                    Use at least 6 characters for
                    your new password.
                  </Text>
                )}

                {/* CONFIRM PASSWORD */}

                <Text
                  style={[
                    styles.label,
                    styles.confirmLabel,
                  ]}
                >
                  CONFIRM PASSWORD
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    loading &&
                      styles.inputDisabled,
                    passwordsMatch &&
                      styles.inputSuccess,
                    confirmPassword.length > 0 &&
                      newPassword !==
                        confirmPassword &&
                      styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={21}
                    color={
                      passwordsMatch
                        ? "#2E7D32"
                        : confirmPassword.length >
                          0 &&
                          newPassword !==
                            confirmPassword
                        ? "#D32F2F"
                        : "#777777"
                    }
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Confirm new password"
                    placeholderTextColor="#A0A0A0"
                    value={confirmPassword}
                    onChangeText={
                      setConfirmPassword
                    }
                    secureTextEntry={
                      !showConfirmPassword
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={
                      handleResetPassword
                    }
                  />

                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    disabled={loading}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword
                          ? "eye-off-outline"
                          : "eye-outline"
                      }
                      size={21}
                      color="#777777"
                    />
                  </TouchableOpacity>
                </View>

                {/* MATCH STATUS */}

                {confirmPassword.length > 0 && (
                  <View style={styles.matchStatus}>
                    <Ionicons
                      name={
                        passwordsMatch
                          ? "checkmark-circle"
                          : "alert-circle"
                      }
                      size={15}
                      color={
                        passwordsMatch
                          ? "#2E7D32"
                          : "#D32F2F"
                      }
                    />

                    <Text
                      style={[
                        styles.matchText,
                        {
                          color: passwordsMatch
                            ? "#2E7D32"
                            : "#D32F2F",
                        },
                      ]}
                    >
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </Text>
                  </View>
                )}

                {/* RESET BUTTON */}

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        RESETTING PASSWORD...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={
                          styles.primaryButtonText
                        }
                      >
                        RESET PASSWORD
                      </Text>

                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="#FFFFFF"
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* FOOTER */}

          <Text style={styles.footer}>
            TUP-OrderUp • Secure Account Recovery
          </Text>

          {__DEV__ && (
            <Text style={styles.apiText}>
              API: {API_URL}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================================================= */
/* PASSWORD REQUIREMENT COMPONENT */
/* ================================================= */

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <View style={styles.requirementRow}>
      <Ionicons
        name={
          valid
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={15}
        color={valid ? "#2E7D32" : "#B5B5B5"}
      />

      <Text
        style={[
          styles.requirementText,
          valid && styles.requirementTextValid,
        ]}
      >
        {text}
      </Text>
    </View>
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
    paddingVertical: 25,
    justifyContent: "center",
  },

  /* =============================================== */
  /* BACK */
  /* =============================================== */

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 25,
    paddingVertical: 5,
  },

  backText: {
    marginLeft: 7,
    fontSize: 14,
    color: "#333333",
    fontWeight: "600",
  },

  /* =============================================== */
  /* HEADER */
  /* =============================================== */

  header: {
    alignItems: "center",
    marginBottom: 28,
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

  /* =============================================== */
  /* PROGRESS */
  /* =============================================== */

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,

    borderWidth: 1.5,
    borderColor: "#D8D8D8",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  progressActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  progressNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: "#999999",
  },

  progressNumberActive: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  progressLine: {
    width: 45,
    height: 2,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 5,
  },

  progressLineActive: {
    backgroundColor: PRIMARY,
  },

  /* =============================================== */
  /* TEXT */
  /* =============================================== */

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#222222",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    marginTop: 6,
    marginBottom: 25,
  },

  /* =============================================== */
  /* INPUT */
  /* =============================================== */

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

  inputDisabled: {
    opacity: 0.65,
  },

  inputSuccess: {
    borderColor: "#2E7D32",
    backgroundColor: "#F8FFF9",
  },

  inputError: {
    borderColor: "#D32F2F",
    backgroundColor: "#FFF9F9",
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

  otpInput: {
    letterSpacing: 5,
    fontWeight: "800",
  },

  eyeButton: {
    paddingHorizontal: 15,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =============================================== */
  /* PASSWORD STRENGTH */
  /* =============================================== */

  strengthContainer: {
    marginTop: 12,
    paddingHorizontal: 2,
  },

  strengthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  strengthTitle: {
    fontSize: 9,
    fontWeight: "800",
    color: "#888888",
    letterSpacing: 0.8,
  },

  strengthLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  strengthBarBackground: {
    width: "100%",
    height: 5,
    borderRadius: 5,
    backgroundColor: "#E9E9E9",
    overflow: "hidden",
  },

  strengthBar: {
    height: "100%",
    borderRadius: 5,
  },

  requirements: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 7,
    columnGap: 14,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "43%",
  },

  requirementText: {
    marginLeft: 5,
    fontSize: 10,
    color: "#999999",
  },

  requirementTextValid: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  passwordHint: {
    fontSize: 11,
    color: "#999999",
    marginTop: 6,
  },

  /* =============================================== */
  /* CONFIRM PASSWORD */
  /* =============================================== */

  confirmLabel: {
    marginTop: 20,
  },

  matchStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginLeft: 2,
  },

  matchText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "600",
  },

  /* =============================================== */
  /* BUTTON */
  /* =============================================== */

  primaryButton: {
    height: 56,
    backgroundColor: PRIMARY,
    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    marginTop: 22,

    shadowColor: PRIMARY,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  /* =============================================== */
  /* HELPERS */
  /* =============================================== */

  helperText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 11,
    color: "#999999",
    lineHeight: 17,
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

  apiText: {
    textAlign: "center",
    marginTop: 8,
    color: "#BBBBBB",
    fontSize: 8,
  },
});