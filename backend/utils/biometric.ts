import * as LocalAuthentication from "expo-local-authentication";

export async function checkBiometricAvailable(): Promise<boolean> {
  try {
    const hasHardware =
      await LocalAuthentication.hasHardwareAsync();

    if (!hasHardware) {
      return false;
    }

    const isEnrolled =
      await LocalAuthentication.isEnrolledAsync();

    return isEnrolled;
  } catch (error) {
    console.log("Biometric check error:", error);
    return false;
  }
}

export async function authenticateBiometric(): Promise<boolean> {
  try {
    const available = await checkBiometricAvailable();

    if (!available) {
      return false;
    }

    const result =
      await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

    return result.success;
  } catch (error) {
    console.log("Biometric authentication error:", error);
    return false;
  }
}

export async function enableBiometric(): Promise<boolean> {
  try {
    const available = await checkBiometricAvailable();

    if (!available) {
      return false;
    }

    const result =
      await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable Face ID / Biometric Login",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

    return result.success;
  } catch (error) {
    console.log("Enable biometric error:", error);
    return false;
  }
}