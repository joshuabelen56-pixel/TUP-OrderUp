import * as LocalAuthentication from "expo-local-authentication";

export async function isBiometricAvailable(): Promise<boolean> {
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
    console.error("BIOMETRIC CHECK ERROR:", error);
    return false;
  }
}

export async function authenticateBiometric(): Promise<boolean> {
  try {
    const available = await isBiometricAvailable();

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
    console.error("BIOMETRIC AUTH ERROR:", error);
    return false;
  }
}

export async function enrollBiometric(): Promise<boolean> {
  try {
    const available = await isBiometricAvailable();

    if (!available) {
      return false;
    }

    const result =
      await LocalAuthentication.authenticateAsync({
        promptMessage: "Enable biometric login",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

    return result.success;
  } catch (error) {
    console.error("BIOMETRIC ENROLL ERROR:", error);
    return false;
  }
}