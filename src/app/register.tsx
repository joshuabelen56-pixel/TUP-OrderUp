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
  Image,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { router } from "expo-router";


// =====================================================
// TYPES
// =====================================================

type AccountType = "Client" | "Seller";

type TUPAffiliation =
  | "Student"
  | "Faculty"
  | "Staff"
  | "Others";

const ACCOUNT_TYPES: AccountType[] = [
  "Client",
  "Seller",
];

const TUP_AFFILIATIONS: TUPAffiliation[] = [
  "Student",
  "Faculty",
  "Staff",
  "Others",
];

const GOVERNMENT_IDS = [
  "National ID",
  "Driver's License",
  "Passport",
  "UMID",
  "SSS ID",
  "PhilHealth ID",
  "Postal ID",
  "PRC ID",
  "Other Government ID",
];

// =====================================================
// BACKEND URL
// =====================================================

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.18.24:5000";

// =====================================================
// REGISTER SCREEN
// =====================================================

export default function Register() {
  // =====================================================
  // PERSONAL INFORMATION
  // =====================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);

  // =====================================================
  // ACCOUNT TYPE
  // =====================================================

  const [accountType, setAccountType] =
    useState<AccountType>("Client");

  const [tupAffiliation, setTupAffiliation] =
    useState<TUPAffiliation>("Student");

  const [showAffiliationPicker, setShowAffiliationPicker] =
    useState(false);

  // =====================================================
  // DATE PICKER
  // =====================================================

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  // =====================================================
  // STUDENT INFORMATION
  // =====================================================

  const [gsfeEmail, setGsfeEmail] = useState("");
  const [gmailEmail, setGmailEmail] = useState("");
  const [tupIdNumber, setTupIdNumber] = useState("");





  const [tupIdFrontPhoto, setTupIdFrontPhoto] =
    useState<string | null>(null);

  const [tupIdBackPhoto, setTupIdBackPhoto] =
    useState<string | null>(null);

  // =====================================================
  // SELLER INFORMATION
  // =====================================================

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] =
    useState("");

  // =====================================================
  // GOVERNMENT ID
  // =====================================================

  const [governmentIdType, setGovernmentIdType] =
    useState("");

  const [governmentIdNumber, setGovernmentIdNumber] =
    useState("");

  const [showIdPicker, setShowIdPicker] =
    useState(false);

  const [idFrontPhoto, setIdFrontPhoto] =
    useState<string | null>(null);

  const [idBackPhoto, setIdBackPhoto] =
    useState<string | null>(null);

  // =====================================================
  // PASSWORD
  // =====================================================

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] =
  useState("");

  // =====================================================
  // HELPERS
  // =====================================================

  const isClient = accountType === "Client";
  const isSeller = accountType === "Seller";

  const isStudent =
    isClient && tupAffiliation === "Student";

  const needsGovernmentID =
    isSeller ||
    (isClient &&
      tupAffiliation !== "Student");

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "Select your birthday";
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // =====================================================
  // CHANGE ACCOUNT TYPE
  // =====================================================

  const handleAccountTypeChange = (
    type: AccountType
  ) => {
    if (loading) return;

    setAccountType(type);

    setShowAffiliationPicker(false);
    setShowIdPicker(false);

    if (type === "Client") {
      // Clear seller information
      setShopName("");
      setShopDescription("");

      // Default client affiliation
      setTupAffiliation("Student");

      // Clear government ID
      setGovernmentIdType("");
      setGovernmentIdNumber("");
      setIdFrontPhoto(null);
      setIdBackPhoto(null);
    }

    if (type === "Seller") {
      // Clear student information
      setGsfeEmail("");
      setTupIdNumber("");
      setTupIdFrontPhoto(null);
      setTupIdBackPhoto(null);

      // Seller uses government ID
      setGovernmentIdType("");
      setGovernmentIdNumber("");
      setIdFrontPhoto(null);
      setIdBackPhoto(null);
    }
  };

  // =====================================================
  // CHANGE TUP AFFILIATION
  // =====================================================

  const handleAffiliationChange = (
    affiliation: TUPAffiliation
  ) => {
    setTupAffiliation(affiliation);

    setShowAffiliationPicker(false);
    setShowIdPicker(false);

    if (affiliation === "Student") {
      // Student uses TUP ID
      setGmailEmail("");
      setGovernmentIdType("");
      setGovernmentIdNumber("");
      setIdFrontPhoto(null);
      setIdBackPhoto(null);
    } else {
      // Faculty / Staff / Others use Gmail + Government ID
      setGsfeEmail("");
      setTupIdNumber("");
      setTupIdFrontPhoto(null);
      setTupIdBackPhoto(null);
    }
  };

  // =====================================================
  // DATE PICKER
  // =====================================================

  const handleDateChange = (
    _event: any,
    selectedDate?: Date
  ) => {
    if (selectedDate) {
      setBirthday(selectedDate);
    }

    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }
  };

  // =====================================================
  // TAKE PHOTO
  // =====================================================

  const takePhoto = async (
    type:
      | "tupFront"
      | "tupBack"
      | "governmentFront"
      | "governmentBack"
  ) => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access so you can take a photo of your ID."
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        const uri = result.assets[0].uri;

        switch (type) {
          case "tupFront":
            setTupIdFrontPhoto(uri);
            break;

          case "tupBack":
            setTupIdBackPhoto(uri);
            break;

          case "governmentFront":
            setIdFrontPhoto(uri);
            break;

          case "governmentBack":
            setIdBackPhoto(uri);
            break;
        }
      }
    } catch (error) {
      console.error("Camera error:", error);

      Alert.alert(
        "Camera Error",
        "Unable to open the camera."
      );
    }
  };

  // =====================================================
  // CHOOSE PHOTO
  // =====================================================

  const choosePhoto = async (
    type:
      | "tupFront"
      | "tupBack"
      | "governmentFront"
      | "governmentBack"
  ) => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Gallery Permission Required",
          "Please allow gallery access so you can select your ID photo."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        const uri = result.assets[0].uri;

        switch (type) {
          case "tupFront":
            setTupIdFrontPhoto(uri);
            break;

          case "tupBack":
            setTupIdBackPhoto(uri);
            break;

          case "governmentFront":
            setIdFrontPhoto(uri);
            break;

          case "governmentBack":
            setIdBackPhoto(uri);
            break;
        }
      }
    } catch (error) {
      console.error("Gallery error:", error);

      Alert.alert(
        "Gallery Error",
        "Unable to open your gallery."
      );
    }
  };

  // =====================================================
  // PHOTO MENU
  // =====================================================

  const handlePhoto = (
    type:
      | "tupFront"
      | "tupBack"
      | "governmentFront"
      | "governmentBack"
  ) => {
    let title = "";
    let description = "";

    switch (type) {
      case "tupFront":
        title = "TUP ID - Front";
        description =
          "Take or select a clear photo of the FRONT of your TUP ID.";
        break;

      case "tupBack":
        title = "TUP ID - Back";
        description =
          "Take or select a clear photo of the BACK of your TUP ID.";
        break;

      case "governmentFront":
        title = "Government ID - Front";
        description =
          "Take or select a clear photo of the FRONT of your government ID.";
        break;

      case "governmentBack":
        title = "Government ID - Back";
        description =
          "Take or select a clear photo of the BACK of your government ID.";
        break;
    }

    Alert.alert(
      title,
      description,
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(type),
        },
        {
          text: "Choose from Gallery",
          onPress: () => choosePhoto(type),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    // ===================================================
    // PERSONAL INFORMATION
    // ===================================================

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim()
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please enter your first name, last name, and username."
      );
      return false;
    }

    // ===================================================
    // CONTACT NUMBER
    // ===================================================

    const cleanContactNumber =
      contactNumber.replace(/\s+/g, "").trim();

    if (!cleanContactNumber) {
      Alert.alert(
        "Contact Number Required",
        "Please enter your contact number."
      );
      return false;
    }

    if (!/^09\d{9}$/.test(cleanContactNumber)) {
      Alert.alert(
        "Invalid Contact Number",
        "Please enter a valid Philippine mobile number (e.g. 09123456789)."
      );
      return false;
    }

    // ===================================================
    // BIRTHDAY
    // ===================================================

    if (!birthday) {
      Alert.alert(
        "Birthday Required",
        "Please select your birthday."
      );
      return false;
    }

    // ===================================================
    // CLIENT
    // ===================================================

    if (isClient) {
      if (!tupAffiliation) {
        Alert.alert(
          "TUP Affiliation Required",
          "Please select your TUP affiliation."
        );
        return false;
      }

      // -------------------------------------------------
      // STUDENT
      // -------------------------------------------------

      if (isStudent) {
        if (!gsfeEmail.trim()) {
          Alert.alert(
            "GSFE Account Required",
            "Students are required to provide their GSFE/Gmail account."
          );
          return false;
        }

     const email = gsfeEmail.trim().toLowerCase();

if (!email.includes("@")) {
  Alert.alert(
    "Invalid GSFE Account",
    "Please enter a valid GSFE email address."
  );
  return false;
}

        if (!tupIdNumber.trim()) {
          Alert.alert(
            "TUP ID Number Required",
            "Please enter your TUP ID number."
          );
          return false;
        }

        if (!tupIdFrontPhoto) {
          Alert.alert(
            "TUP ID Front Required",
            "Please provide a clear photo of the FRONT of your TUP ID."
          );
          return false;
        }

        if (!tupIdBackPhoto) {
          Alert.alert(
            "TUP ID Back Required",
            "Please provide a clear photo of the BACK of your TUP ID."
          );
          return false;
        }
      }

      // -------------------------------------------------
      // FACULTY / STAFF / OTHERS
      // -------------------------------------------------

      if (needsGovernmentID) {
        // -------------------------------------------------
      // GMAIL - FACULTY / STAFF / OTHERS
      // -------------------------------------------------

      if (!gmailEmail.trim()) {
        Alert.alert(
          "Gmail Required",
          "Please enter your Gmail address."
        );
        return false;
      }

      const email = gmailEmail.trim().toLowerCase();

      if (!/^[^\s@]+@gmail\.com$/.test(email)) {
        Alert.alert(
          "Invalid Gmail",
          "Please enter a valid Gmail address."
        );
        return false;
      }

  // -------------------------------------------------
  // GOVERNMENT ID
  // -------------------------------------------------

        if (!governmentIdType) {
          Alert.alert(
            "Government ID Required",
            "Please select one government ID."
          );
          return false;
        }

        if (!governmentIdNumber.trim()) {
          Alert.alert(
            "Government ID Number Required",
            "Please enter your government ID number."
          );
          return false;
        }

        if (!idFrontPhoto) {
          Alert.alert(
            "Government ID Front Required",
            "Please provide a clear photo of the FRONT of your government ID."
          );
          return false;
        }

        if (!idBackPhoto) {
          Alert.alert(
            "Government ID Back Required",
            "Please provide a clear photo of the BACK of your government ID."
          );
          return false;
        }
      }
    }

    // ===================================================
    // SELLER
    // ===================================================

    if (isSeller) {
      if (!shopName.trim()) {
        Alert.alert(
          "Shop Name Required",
          "Please enter your shop name."
        );
        return false;
      }

      if (shopName.trim().length < 3) {
        Alert.alert(
          "Invalid Shop Name",
          "Your shop name must contain at least 3 characters."
        );
        return false;
      }

      if (!shopDescription.trim()) {
        Alert.alert(
          "Shop Description Required",
          "Please tell customers a little about your shop."
        );
        return false;
      }

      if (!governmentIdType) {
        Alert.alert(
          "Government ID Required",
          "Please select one government ID for seller verification."
        );
        return false;
      }

      if (!governmentIdNumber.trim()) {
        Alert.alert(
          "Government ID Number Required",
          "Please enter your government ID number."
        );
        return false;
      }

      if (!idFrontPhoto) {
        Alert.alert(
          "Government ID Front Required",
          "Please provide a clear photo of the FRONT of your government ID."
        );
        return false;
      }

      if (!idBackPhoto) {
        Alert.alert(
          "Government ID Back Required",
          "Please provide a clear photo of the BACK of your government ID."
        );
        return false;
      }
    }

    // ===================================================
    // PASSWORD
    // ===================================================

    if (
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        "Password Required",
        "Please enter and confirm your password."
      );
      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least 8 characters."
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Your passwords do not match."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // REGISTER TO MONGODB
  // =====================================================

  const handleRegister = async () => {
    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

try {
  setLoading(true);
  setLoadingMessage(
  isClient && !isStudent
    ? "VERIFYING ID..."
    : "CREATING ACCOUNT..."
);

  // =================================================
  // AUTOMATIC GOVERNMENT ID VERIFICATION
  // FACULTY / STAFF / OTHERS ONLY
  // =================================================

  if (isSeller || (isClient && !isStudent)) {
    console.log("=================================");
    console.log("STARTING GOVERNMENT ID VERIFICATION");
    console.log("=================================");

    const verificationFormData = new FormData();

    verificationFormData.append(
      "firstName",
      firstName.trim()
    );

    verificationFormData.append(
      "lastName",
      lastName.trim()
    );

    verificationFormData.append(
      "governmentIdType",
      governmentIdType
    );

    verificationFormData.append(
      "governmentIdNumber",
      governmentIdNumber.trim()
    );

    // -----------------------------------------------
    // GOVERNMENT ID FRONT
    // -----------------------------------------------

    if (!idFrontPhoto) {
      throw new Error(
        "Government ID front photo is missing."
      );
    }

const governmentFrontFile =
  new File(idFrontPhoto);

if (!governmentFrontFile.exists) {
  throw new Error(
    "Government ID front photo file does not exist."
  );
}

verificationFormData.append(
  "governmentIdFront",
  governmentFrontFile as any
);

    // -----------------------------------------------
    // GOVERNMENT ID BACK
    // -----------------------------------------------

    if (!idBackPhoto) {
      throw new Error(
        "Government ID back photo is missing."
      );
    }

const governmentBackFile =
  new File(idBackPhoto);

if (!governmentBackFile.exists) {
  throw new Error(
    "Government ID back photo file does not exist."
  );
}

verificationFormData.append(
  "governmentIdBack",
  governmentBackFile as any
);

    console.log(
      "Verifying Faculty / Staff / Others identity..."
    );

    const verificationResponse = await fetch(
      `${API_URL}/api/verify-government-id`,
      {
        method: "POST",
        body: verificationFormData,
      }
    );

    let verificationData: any = null;

    try {
      verificationData =
        await verificationResponse.json();
    } catch {
      verificationData = null;
    }

    console.log(
      "Government ID verification status:",
      verificationResponse.status
    );

    console.log(
      "Government ID verification response:",
      verificationData
    );

    // -----------------------------------------------
    // VERIFICATION REQUEST ERROR
    // -----------------------------------------------

    if (!verificationResponse.ok) {
      throw new Error(
        verificationData?.message ||
          "Government ID verification failed."
      );
    }

    // -----------------------------------------------
    // 3-WAY AUTHENTICATION
    // -----------------------------------------------

    const firstNameMatch =
      verificationData?.matches?.firstName === true;

    const lastNameMatch =
      verificationData?.matches?.lastName === true;

    const idNumberMatch =
      verificationData?.matches?.idNumber === true;

    console.log("=================================");
    console.log("GOVERNMENT ID AUTHENTICATION RESULT");
    console.log("=================================");
    console.log(
      "First Name:",
      firstNameMatch ? "MATCH" : "NO MATCH"
    );
    console.log(
      "Last Name:",
      lastNameMatch ? "MATCH" : "NO MATCH"
    );
    console.log(
      "ID Number:",
      idNumberMatch ? "MATCH" : "NO MATCH"
    );
    console.log("=================================");

    // -----------------------------------------------
    // MUST BE 3/3
    // -----------------------------------------------

    if (
      !firstNameMatch ||
      !lastNameMatch ||
      !idNumberMatch
    ) {
      let failedChecks: string[] = [];

      if (!firstNameMatch) {
        failedChecks.push("First Name");
      }

      if (!lastNameMatch) {
        failedChecks.push("Last Name");
      }

      if (!idNumberMatch) {
        failedChecks.push(
          "Government ID Number"
        );
      }

      throw new Error(
        `Government ID verification failed.\n\n` +
        `The following information did not match your ID:\n` +
        `• ${failedChecks.join("\n• ")}\n\n` +
        `Please make sure your information matches the details shown on your government ID.`
      );
    }

    // -----------------------------------------------
    // SUCCESS — 3/3
    // -----------------------------------------------

    console.log(
      "Government ID verification PASSED: 3/3"
    );
  }

  // =================================================
  // CREATE REGISTRATION FORM DATA
  // =================================================

  console.log(
    "Sending registration to:",
    `${API_URL}/api/users`
  );

  const formData = new FormData();

      // =================================================
      // PERSONAL INFORMATION
      // =================================================

      formData.append(
        "firstName",
        firstName.trim()
      );

      formData.append(
        "lastName",
        lastName.trim()
      );

      formData.append(
        "username",
        username.trim()
      );

      formData.append(
        "contactNumber",
        contactNumber
          .replace(/\s+/g, "")
          .trim()
      );

      formData.append(
        "birthday",
        birthday!.toISOString()
      );

      // =================================================
      // ACCOUNT TYPE
      // =================================================

      formData.append(
        "accountType",
        accountType
      );

      // =================================================
      // CLIENT DATA
      // =================================================

      if (isClient) {
        formData.append(
          "tupAffiliation",
          tupAffiliation
        );

        // -----------------------------------------------
        // STUDENT
        // -----------------------------------------------

        if (isStudent) {
          formData.append(
            "gsfeEmail",
            gsfeEmail
              .trim()
              .toLowerCase()
          );

          formData.append(
            "tupIdNumber",
            tupIdNumber.trim()
          );
        }

        // -----------------------------------------------
        // FACULTY / STAFF / OTHERS
        // -----------------------------------------------

          if (needsGovernmentID) {

            formData.append(
              "gmailEmail",
              gmailEmail
                .trim()
                .toLowerCase()
            );

            formData.append(
              "governmentIdType",
              governmentIdType
            );

            formData.append(
              "governmentIdNumber",
              governmentIdNumber.trim()
            );
          }
      }

      // =================================================
      // SELLER DATA
      // =================================================

      if (isSeller) {
        formData.append(
          "shopName",
          shopName.trim()
        );

        formData.append(
          "shopDescription",
          shopDescription.trim()
        );

        formData.append(
          "governmentIdType",
          governmentIdType
        );

        formData.append(
          "governmentIdNumber",
          governmentIdNumber.trim()
        );

        /*
         * IMPORTANT:
         *
         * DO NOT send accountStatus here.
         *
         * Backend decides:
         *
         * Client -> Approved
         * Seller -> Pending
         */
      }

      // =================================================
      // PASSWORD
      // =================================================

      formData.append(
        "password",
        password
      );

      // =================================================
      // FRONT + BACK ID PHOTOS
      // =================================================

      if (isStudent) {
        // ===============================================
        // TUP ID FRONT
        // ===============================================

        if (!tupIdFrontPhoto) {
          throw new Error(
            "TUP ID front photo is missing."
          );
        }

        const tupFrontFile =
          new File(tupIdFrontPhoto);

        if (!tupFrontFile.exists) {
          throw new Error(
            "TUP ID front photo file does not exist."
          );
        }

        console.log(
          "TUP ID FRONT:",
          tupFrontFile.name
        );

        formData.append(
          "tupIdFrontPhoto",
          tupFrontFile as any
        );

        // ===============================================
        // TUP ID BACK
        // ===============================================

        if (!tupIdBackPhoto) {
          throw new Error(
            "TUP ID back photo is missing."
          );
        }

        const tupBackFile =
          new File(tupIdBackPhoto);

        if (!tupBackFile.exists) {
          throw new Error(
            "TUP ID back photo file does not exist."
          );
        }

        console.log(
          "TUP ID BACK:",
          tupBackFile.name
        );

        formData.append(
          "tupIdBackPhoto",
          tupBackFile as any
        );
      } else {
        // ===============================================
        // GOVERNMENT ID FRONT
        // ===============================================

        if (!idFrontPhoto) {
          throw new Error(
            "Government ID front photo is missing."
          );
        }

        const governmentFrontFile =
          new File(idFrontPhoto);

        if (!governmentFrontFile.exists) {
          throw new Error(
            "Government ID front photo file does not exist."
          );
        }

        console.log(
          "GOVERNMENT ID FRONT:",
          governmentFrontFile.name
        );

        formData.append(
          "governmentIdFrontPhoto",
          governmentFrontFile as any
        );

        // ===============================================
        // GOVERNMENT ID BACK
        // ===============================================

        if (!idBackPhoto) {
          throw new Error(
            "Government ID back photo is missing."
          );
        }

        const governmentBackFile =
          new File(idBackPhoto);

        if (!governmentBackFile.exists) {
          throw new Error(
            "Government ID back photo file does not exist."
          );
        }

        console.log(
          "GOVERNMENT ID BACK:",
          governmentBackFile.name
        );

        formData.append(
          "governmentIdBackPhoto",
          governmentBackFile as any
        );
      }

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "Front/back ID photos added to FormData."
      );

      // =================================================
      // SEND REQUEST
      // =================================================

      const response = await fetch(
        `${API_URL}/api/users`,
        {
          method: "POST",
          body: formData,
        }
      );

      // =================================================
      // SERVER RESPONSE
      // =================================================

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      console.log(
        "Server status:",
        response.status
      );

      console.log(
        "Server response:",
        data
      );

      // =================================================
      // SERVER ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Registration failed (${response.status}).`
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      if (isSeller) {
        Alert.alert(
          "Seller Application Submitted",
          "Your seller account has been created and is now pending admin review. You can start selling once your seller account is approved.",
          [
            {
              text: "Continue to Login",
              onPress: () => {
                router.replace("../login");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Account Created",
          "Your client account has been created successfully. You can now continue to login.",
          [
            {
              text: "Continue to Login",
              onPress: () => {
                router.replace("../login");
              },
            },
          ]
        );
      }

      // =================================================
      // CLEAR FORM
      // =================================================

      setFirstName("");
      setLastName("");
      setUsername("");
      setContactNumber("");
      setBirthday(null);

      setAccountType("Client");
      setTupAffiliation("Student");

      setShowAffiliationPicker(false);
      setShowIdPicker(false);
      setShowDatePicker(false);

      // Student
      setGsfeEmail("");
      setGmailEmail("");
      setTupIdNumber("");
      setTupIdFrontPhoto(null);
      setTupIdBackPhoto(null);

      // Seller
      setShopName("");
      setShopDescription("");

      // Government ID
      setGovernmentIdType("");
      setGovernmentIdNumber("");
      setIdFrontPhoto(null);
      setIdBackPhoto(null);

      // Password
      setPassword("");
      setConfirmPassword("");

      setShowPassword(false);
      setShowConfirmPassword(false);

    } catch (error: any) {
      console.error(
        "REGISTRATION ERROR:",
        error
      );

      let message =
        error?.message ||
        "Unable to connect to the server.";

      if (
        message
          .toLowerCase()
          .includes("network request failed")
      ) {
        message =
          "Cannot connect to the backend.\n\n" +
          "Please make sure:\n" +
          "• MongoDB is running\n" +
          "• Your backend is running\n" +
          "• Your phone and PC are on the same Wi-Fi\n" +
          "• EXPO_PUBLIC_API_URL uses your PC's IP address";
      }

      Alert.alert(
        "Registration Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };



  return (




  // =====================================================
  // RENDER
  // =====================================================


    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#8F1029"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
          showsVerticalScrollIndicator={false}
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <View style={styles.cardinalHeader}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  router.replace("../login")
                }
                disabled={loading}
              >
                <Ionicons
                  name="arrow-back"
                  size={21}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <View style={styles.headerText}>
                <Text
                  style={styles.headerTitle}
                >
                  Create Account
                </Text>

                <Text
                  style={styles.headerSubtitle}
                >
                  TUP-OrderUp
                </Text>
              </View>

              <View style={styles.headerIcon}>
                <Ionicons
                  name="bag-handle"
                  size={25}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View
              style={styles.headerAccent}
            />
          </View>

          {/* ================================================= */}
          {/* INTRO */}
          {/* ================================================= */}

          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons
                name={
                  isSeller
                    ? "storefront-outline"
                    : "person-add-outline"
                }
                size={29}
                color="#C41E3A"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.introTitle}>
                Let's get started.
              </Text>

              <Text style={styles.introText}>
                Create your TUP-OrderUp account
                by choosing the account type
                that best fits your needs.
              </Text>
            </View>
          </View>

          {/* ================================================= */}
          {/* ACCOUNT TYPE */}
          {/* ================================================= */}

          <View
            style={
              styles.accountTypeSection
            }
          >
            <Text
              style={
                styles.accountTypeLabel
              }
            >
              ACCOUNT TYPE
            </Text>

            <Text
              style={
                styles.accountTypeSubtitle
              }
            >
              Choose how you will use
              TUP-OrderUp.
            </Text>

            <View
              style={
                styles.accountTypeRow
              }
            >
              {ACCOUNT_TYPES.map((type) => {
                const selected =
                  accountType === type;

                const isClientType =
                  type === "Client";

                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.accountTypeCard,
                      selected &&
                        styles.accountTypeCardSelected,
                    ]}
                    onPress={() =>
                      handleAccountTypeChange(
                        type
                      )
                    }
                    activeOpacity={0.85}
                    disabled={loading}
                  >
                    <View
                      style={[
                        styles.accountTypeIcon,
                        selected &&
                          styles.accountTypeIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={
                          isClientType
                            ? "person-outline"
                            : "storefront-outline"
                        }
                        size={25}
                        color={
                          selected
                            ? "#FFFFFF"
                            : "#C41E3A"
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.accountTypeTitle,
                        selected &&
                          styles.accountTypeTitleSelected,
                      ]}
                    >
                      {type}
                    </Text>

                    <Text
                      style={[
                        styles.accountTypeDescription,
                        selected &&
                          styles.accountTypeDescriptionSelected,
                      ]}
                    >
                      {isClientType
                        ? "Order products and services"
                        : "Sell products on campus"}
                    </Text>

                    {selected && (
                      <View
                        style={
                          styles.selectedCheck
                        }
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#C41E3A"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================================================= */}
          {/* SECTION 01 - PERSONAL INFORMATION */}
          {/* ================================================= */}

          <View style={styles.section}>
            <SectionHeader
              number="01"
              title="Personal Information"
              subtitle="Tell us about yourself"
            />

            <InputField
              label="FIRST NAME *"
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
              icon="person-outline"
              autoCapitalize="words"
            />

            <InputField
              label="LAST NAME *"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              icon="person-outline"
              autoCapitalize="words"
            />

            <InputField
              label="USERNAME *"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              icon="at-outline"
              autoCapitalize="none"
            />

            <InputField
              label="CONTACT NUMBER *"
              placeholder="09XXXXXXXXX"
              value={contactNumber}
              onChangeText={setContactNumber}
              icon="call-outline"
              keyboardType="phone-pad"
              autoCapitalize="none"
              maxLength={11}
            />

            {/* BIRTHDAY */}

            <Text style={styles.label}>
              BIRTHDAY *
            </Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() =>
                setShowDatePicker(true)
              }
              disabled={loading}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#777777"
                style={styles.inputIcon}
              />

              <Text
                style={[
                  styles.dateText,
                  !birthday &&
                    styles.placeholder,
                ]}
              >
                {formatDate(birthday)}
              </Text>

              <Ionicons
                name="chevron-down"
                size={18}
                color="#888888"
                style={styles.rightIcon}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  birthday ||
                  new Date(2000, 0, 1)
                }
                mode="date"
                display={
                  Platform.OS === "ios"
                    ? "spinner"
                    : "default"
                }
                maximumDate={new Date()}
                onChange={handleDateChange}
                onDismiss={() =>
                  setShowDatePicker(false)
                }
              />
            )}
          </View>

          {/* ================================================= */}
          {/* CLIENT - TUP AFFILIATION */}
          {/* ================================================= */}

          {isClient && (
            <View style={styles.section}>
              <SectionHeader
                number="02"
                title="TUP Affiliation"
                subtitle="Tell us how you are connected to TUP"
              />

              <Text style={styles.label}>
                TUP AFFILIATION *
              </Text>

              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() =>
                  setShowAffiliationPicker(
                    !showAffiliationPicker
                  )
                }
                disabled={loading}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#777777"
                  style={styles.inputIcon}
                />

                <Text
                  style={styles.dateText}
                >
                  {tupAffiliation}
                </Text>

                <Ionicons
                  name={
                    showAffiliationPicker
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={18}
                  color="#888888"
                  style={styles.rightIcon}
                />
              </TouchableOpacity>

              {showAffiliationPicker && (
                <View
                  style={styles.dropdown}
                >
                  {TUP_AFFILIATIONS.map(
                    (item, index) => (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.dropdownItem,
                          index ===
                            TUP_AFFILIATIONS.length -
                              1 &&
                            styles.lastDropdownItem,
                          tupAffiliation ===
                            item &&
                            styles.selectedDropdownItem,
                        ]}
                        onPress={() =>
                          handleAffiliationChange(
                            item
                          )
                        }
                      >
                        <View
                          style={
                            styles.roleOptionLeft
                          }
                        >
                          <Ionicons
                            name={
                              item ===
                              "Student"
                                ? "school-outline"
                                : item ===
                                  "Faculty"
                                ? "person-outline"
                                : item ===
                                  "Staff"
                                ? "briefcase-outline"
                                : "people-outline"
                            }
                            size={18}
                            color={
                              tupAffiliation ===
                              item
                                ? "#C41E3A"
                                : "#777777"
                            }
                          />

                          <Text
                            style={[
                              styles.dropdownText,
                              tupAffiliation ===
                                item &&
                                styles.selectedDropdownText,
                            ]}
                          >
                            {item}
                          </Text>
                        </View>

                        {tupAffiliation ===
                          item && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#C41E3A"
                          />
                        )}
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}

              {/* ================================================= */}
              {/* STUDENT */}
              {/* ================================================= */}

              {isStudent && (
                <>
                  <View
                    style={
                      styles.dynamicBox
                    }
                  >
                    <View
                      style={
                        styles.dynamicBoxIcon
                      }
                    >
                      <Ionicons
                        name="school-outline"
                        size={21}
                        color="#C41E3A"
                      />
                    </View>

                    <View
                      style={{ flex: 1 }}
                    >
                      <Text
                        style={
                          styles.dynamicBoxTitle
                        }
                      >
                        Student Account
                      </Text>

                      <Text
                        style={
                          styles.dynamicBoxText
                        }
                      >
                        Students must provide
                        their GSFE/Gmail account
                        and TUP ID for
                        verification.
                      </Text>
                    </View>
                  </View>

                  <InputField
                    label="GSFE ACCOUNT *"
                    placeholder="example@gsfe.com"
                    value={gsfeEmail}
                    onChangeText={setGsfeEmail}
                    icon="logo-google"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <InputField
                    label="TUP ID NUMBER *"
                    placeholder="Enter your TUP ID number"
                    value={tupIdNumber}
                    onChangeText={setTupIdNumber}
                    icon="card-outline"
                    autoCapitalize="characters"
                  />

                  {/* TUP ID FRONT */}

                  <Text style={styles.label}>
                    TUP ID FRONT *
                  </Text>

                  <PhotoPicker
                    photo={tupIdFrontPhoto}
                    title="Take a Photo of the Front"
                    buttonText="ADD TUP ID FRONT"
                    onPress={() =>
                      handlePhoto("tupFront")
                    }
                  />

                  {/* TUP ID BACK */}

                  <Text style={styles.label}>
                    TUP ID BACK *
                  </Text>

                  <PhotoPicker
                    photo={tupIdBackPhoto}
                    title="Take a Photo of the Back"
                    buttonText="ADD TUP ID BACK"
                    onPress={() =>
                      handlePhoto("tupBack")
                    }
                  />

                  <View
                    style={styles.securityBox}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={19}
                      color="#C41E3A"
                    />

                    <Text
                      style={
                        styles.securityText
                      }
                    >
                      Both the FRONT and BACK of
                      your TUP ID are required.
                      Make sure all details are
                      clear, readable, and
                      completely visible.
                    </Text>
                  </View>
                </>
              )}

              {/* ================================================= */}
              {/* FACULTY / STAFF / OTHERS */}
              {/* ================================================= */}

              {isClient && !isStudent && (
                <>
                  <View
                    style={
                      styles.dynamicBox
                    }
                  >
                    <View
                      style={
                        styles.dynamicBoxIcon
                      }
                    >
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={21}
                        color="#C41E3A"
                      />
                    </View>

                    <View
                      style={{ flex: 1 }}
                    >
                      <Text
                        style={
                          styles.dynamicBoxTitle
                        }
                      >
                        {tupAffiliation}{" "}
                        Account
                      </Text>

                      <Text
                        style={
                          styles.dynamicBoxText
                        }
                      >
                        A valid government ID
                        is required to verify
                        your account.
                      </Text>
                    </View>
                  </View>
                  
                  <InputField
                    label="GMAIL ADDRESS *"
                    placeholder="example@gmail.com"
                    value={gmailEmail}
                    onChangeText={setGmailEmail}
                    icon="logo-google"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Text style={styles.label}>
                    GOVERNMENT ID TYPE *
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.inputWrapper
                    }
                    onPress={() =>
                      setShowIdPicker(
                        !showIdPicker
                      )
                    }
                    disabled={loading}
                  >
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color="#777777"
                      style={
                        styles.inputIcon
                      }
                    />

                    <Text
                      style={[
                        styles.dateText,
                        !governmentIdType &&
                          styles.placeholder,
                      ]}
                    >
                      {governmentIdType ||
                        "Select government ID"}
                    </Text>

                    <Ionicons
                      name={
                        showIdPicker
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color="#888888"
                      style={
                        styles.rightIcon
                      }
                    />
                  </TouchableOpacity>

                  {showIdPicker && (
                    <View
                      style={
                        styles.dropdown
                      }
                    >
                      {GOVERNMENT_IDS.map(
                        (item, index) => (
                          <TouchableOpacity
                            key={item}
                            style={[
                              styles.dropdownItem,
                              index ===
                                GOVERNMENT_IDS.length -
                                  1 &&
                                styles.lastDropdownItem,
                              governmentIdType ===
                                item &&
                                styles.selectedDropdownItem,
                            ]}
                            onPress={() => {
                              setGovernmentIdType(
                                item
                              );
                              setShowIdPicker(
                                false
                              );
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownText,
                                governmentIdType ===
                                  item &&
                                  styles.selectedDropdownText,
                              ]}
                            >
                              {item}
                            </Text>

                            {governmentIdType ===
                              item && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#C41E3A"
                              />
                            )}
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  )}

                  <InputField
                    label="GOVERNMENT ID NUMBER *"
                    placeholder="Enter your ID number"
                    value={governmentIdNumber}
                    onChangeText={
                      setGovernmentIdNumber
                    }
                    icon="keypad-outline"
                    autoCapitalize="characters"
                  />

                  {/* GOVERNMENT ID FRONT */}

                  <Text style={styles.label}>
                    GOVERNMENT ID FRONT *
                  </Text>

                  <PhotoPicker
                    photo={idFrontPhoto}
                    title="Take a Photo of the Front"
                    buttonText="ADD ID FRONT"
                    onPress={() =>
                      handlePhoto(
                        "governmentFront"
                      )
                    }
                  />

                  {/* GOVERNMENT ID BACK */}

                  <Text style={styles.label}>
                    GOVERNMENT ID BACK *
                  </Text>

                  

                  <PhotoPicker
                    photo={idBackPhoto}
                    title="Take a Photo of the Back"
                    buttonText="ADD ID BACK"
                    onPress={() =>
                      handlePhoto(
                        "governmentBack"
                      )
                    }
                  />

                  

                  <View
                    style={styles.securityBox}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={19}
                      color="#C41E3A"
                    />

                    <Text
                      style={
                        styles.securityText
                      }
                    >
                      Both the FRONT and BACK of
                      your government ID are
                      required. Make sure all
                      details are clear, readable,
                      and completely visible.
                    </Text>
                  </View>
                </>
              )}

              {/* CLIENT STATUS */}

              <View
                style={styles.approvedBox}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color="#2E7D32"
                />

                <Text
                  style={styles.approvedText}
                >
                  Client accounts are
                  automatically set to Approved
                  after successful registration.
                </Text>
              </View>
            </View>
          )}

          {/* ================================================= */}
          {/* SELLER INFORMATION */}
          {/* ================================================= */}

          {isSeller && (
            <>
              <View style={styles.section}>
                <SectionHeader
                  number="02"
                  title="Seller Information"
                  subtitle="Set up your shop"
                />

                <View
                  style={
                    styles.sellerIntroBox
                  }
                >
                  <View
                    style={
                      styles.sellerIntroIcon
                    }
                  >
                    <Ionicons
                      name="storefront"
                      size={22}
                      color="#C41E3A"
                    />
                  </View>

                  <View
                    style={{ flex: 1 }}
                  >
                    <Text
                      style={
                        styles.sellerIntroTitle
                      }
                    >
                      Become a TUP-OrderUp
                      Seller
                    </Text>

                    <Text
                      style={
                        styles.sellerIntroText
                      }
                    >
                      Create your shop and
                      sell products to the TUP
                      community. Your seller
                      application will be
                      reviewed by an
                      administrator.
                    </Text>
                  </View>
                </View>

                <InputField
                  label="SHOP NAME *"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChangeText={setShopName}
                  icon="storefront-outline"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>
                  SHOP DESCRIPTION *
                </Text>

                <View
                  style={[
                    styles.inputWrapper,
                    styles.textAreaWrapper,
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#777777"
                    style={[
                      styles.inputIcon,
                      styles.textAreaIcon,
                    ]}
                  />

                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                    ]}
                    placeholder="Tell customers what your shop sells..."
                    placeholderTextColor="#A0A0A0"
                    value={shopDescription}
                    onChangeText={
                      setShopDescription
                    }
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                <View
                  style={styles.pendingBox}
                >
                  <Ionicons
                    name="time-outline"
                    size={19}
                    color="#C41E3A"
                  />

                  <Text
                    style={
                      styles.pendingText
                    }
                  >
                    Seller accounts are
                    initially Pending. An
                    administrator must review
                    and approve your application
                    before you can start
                    selling.
                  </Text>
                </View>
              </View>

              {/* ================================================= */}
              {/* SELLER VERIFICATION */}
              {/* ================================================= */}

              <View style={styles.section}>
                <SectionHeader
                  number="03"
                  title="Seller Verification"
                  subtitle="Verify your seller identity"
                />

                <InputField
                  label="GMAIL ADDRESS *"
                  placeholder="example@gmail.com"
                  value={gmailEmail}
                  onChangeText={setGmailEmail}
                  icon="logo-google"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>
                  GOVERNMENT ID TYPE *
                </Text>

                <TouchableOpacity
                  style={
                    styles.inputWrapper
                  }
                  onPress={() =>
                    setShowIdPicker(
                      !showIdPicker
                    )
                  }
                  disabled={loading}
                >
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color="#777777"
                    style={
                      styles.inputIcon
                    }
                  />

                  <Text
                    style={[
                      styles.dateText,
                      !governmentIdType &&
                        styles.placeholder,
                    ]}
                  >
                    {governmentIdType ||
                      "Select government ID"}
                  </Text>

                  <Ionicons
                    name={
                      showIdPicker
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color="#888888"
                    style={
                      styles.rightIcon
                    }
                  />
                </TouchableOpacity>

                {showIdPicker && (
                  <View
                    style={styles.dropdown}
                  >
                    {GOVERNMENT_IDS.map(
                      (item, index) => (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.dropdownItem,
                            index ===
                              GOVERNMENT_IDS.length -
                                1 &&
                              styles.lastDropdownItem,
                            governmentIdType ===
                              item &&
                              styles.selectedDropdownItem,
                          ]}
                          onPress={() => {
                            setGovernmentIdType(
                              item
                            );
                            setShowIdPicker(
                              false
                            );
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownText,
                              governmentIdType ===
                                item &&
                                styles.selectedDropdownText,
                            ]}
                          >
                            {item}
                          </Text>

                          {governmentIdType ===
                            item && (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#C41E3A"
                            />
                          )}
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                )}

                <InputField
                  label="GOVERNMENT ID NUMBER *"
                  placeholder="Enter your ID number"
                  value={governmentIdNumber}
                  onChangeText={
                    setGovernmentIdNumber
                  }
                  icon="keypad-outline"
                  autoCapitalize="characters"
                />

                {/* GOVERNMENT ID FRONT */}

                <Text style={styles.label}>
                  GOVERNMENT ID FRONT *
                </Text>

                <PhotoPicker
                  photo={idFrontPhoto}
                  title="Take a Photo of the Front"
                  buttonText="ADD ID FRONT"
                  onPress={() =>
                    handlePhoto(
                      "governmentFront"
                    )
                  }
                />

                {/* GOVERNMENT ID BACK */}

                <Text style={styles.label}>
                  GOVERNMENT ID BACK *
                </Text>

                <PhotoPicker
                  photo={idBackPhoto}
                  title="Take a Photo of the Back"
                  buttonText="ADD ID BACK"
                  onPress={() =>
                    handlePhoto(
                      "governmentBack"
                    )
                  }
                />


                <View
                  style={
                    styles.securityBox
                  }
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={19}
                    color="#C41E3A"
                  />

                  <Text
                    style={
                      styles.securityText
                    }
                  >
                    Both the FRONT and BACK of
                    your government ID are
                    required. Make sure all
                    details are clear, readable,
                    and completely visible.
                  </Text>
                </View>

                <View
                  style={styles.infoBox}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={19}
                    color="#C41E3A"
                  />

                  <Text
                    style={styles.infoText}
                  >
                    Your government ID will be
                    reviewed by the administrator
                    before your seller account can
                    be approved.
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* ================================================= */}
          {/* ACCOUNT SECURITY */}
          {/* ================================================= */}

          <View style={styles.section}>
            <SectionHeader
              number={
                isSeller ? "04" : "03"
              }
              title="Account Security"
              subtitle="Create a secure password"
            />

            {/* PASSWORD */}

            <Text style={styles.label}>
              PASSWORD *
            </Text>

            <View
              style={styles.inputWrapper}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#777777"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="At least 8 characters"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color="#777777"
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}

            <Text style={styles.label}>
              CONFIRM PASSWORD *
            </Text>

            <View
              style={styles.inputWrapper}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#777777"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#A0A0A0"
                value={confirmPassword}
                onChangeText={
                  setConfirmPassword
                }
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color="#777777"
                />
              </TouchableOpacity>
            </View>

            <View
              style={styles.passwordHint}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#777777"
              />

              <Text
                style={
                  styles.passwordHintText
                }
              >
                Use at least 8 characters
                for better security.
              </Text>
            </View>
          </View>

          {/* ================================================= */}
          {/* SELLER FINAL NOTICE */}
          {/* ================================================= */}

          {isSeller && (
            <View
              style={styles.sellerNotice}
            >
              <View
                style={
                  styles.sellerNoticeIcon
                }
              >
                <Ionicons
                  name="time-outline"
                  size={21}
                  color="#C41E3A"
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.sellerNoticeTitle
                  }
                >
                  Pending Admin Approval
                </Text>

                <Text
                  style={
                    styles.sellerNoticeText
                  }
                >
                  Your seller account will be
                  created with a Pending status.
                  An administrator must review
                  your application before your
                  seller features are activated.
                </Text>
              </View>
            </View>
          )}

          {/* ================================================= */}
          {/* CLIENT FINAL NOTICE */}
          {/* ================================================= */}

          {isClient && (
            <View
              style={styles.clientNotice}
            >
              <View
                style={
                  styles.clientNoticeIcon
                }
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="#2E7D32"
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.clientNoticeTitle
                  }
                >
                  Client Account
                </Text>

                <Text
                  style={
                    styles.clientNoticeText
                  }
                >
                  Your client account will be
                  set to Approved after
                  successful registration.
                </Text>
              </View>
            </View>
          )}

          {/* ================================================= */}
          {/* REGISTER BUTTON */}
          {/* ================================================= */}

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading &&
                styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
{loading ? (
  <>
    <ActivityIndicator
      size="small"
      color="#FFFFFF"
    />

    <Text style={styles.registerButtonText}>
      {loadingMessage}
    </Text>
  </>
) : (
  <>
    <Text style={styles.registerButtonText}>
      {isSeller
        ? "SUBMIT SELLER APPLICATION"
        : "CREATE CLIENT ACCOUNT"}
    </Text>

    <Ionicons
      name="arrow-forward"
      size={21}
      color="#FFFFFF"
    />
  </>
)}


          </TouchableOpacity>

          {/* ================================================= */}
          {/* LOGIN */}
          {/* ================================================= */}

          <View
            style={styles.loginContainer}
          >
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace("../login")
              }
              disabled={loading}
            >
              <Text
                style={styles.loginLink}
              >
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================================================= */}
          {/* FOOTER */}
          {/* ================================================= */}

          <Text style={styles.footer}>
            TUP-OrderUp
          </Text>

          <Text style={styles.footerSub}>
            Campus Ordering System
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionNumber}>
        <Text
          style={
            styles.sectionNumberText
          }
        >
          {number}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text
          style={
            styles.sectionSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

// =====================================================
// INPUT FIELD
// =====================================================

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType,
  autoCapitalize,
  maxLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad";
  autoCapitalize?:
    | "none"
    | "sentences"
    | "words"
    | "characters";
  maxLength?: number;
}) {
  return (
    <>
      <Text style={styles.label}>
        {label}
      </Text>

      <View
        style={styles.inputWrapper}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#777777"
          style={styles.inputIcon}
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
      </View>
    </>
  );
}

// =====================================================
// PHOTO PICKER
// =====================================================

function PhotoPicker({
  photo,
  title,
  buttonText,
  onPress,
}: {
  photo: string | null;
  title: string;
  buttonText: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.photoBox,
        photo &&
          styles.photoBoxWithImage,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {photo ? (
        <>
          <Image
            source={{
              uri: photo,
            }}
            style={styles.idPreview}
          />

          <View
            style={styles.photoOverlay}
          >
            <View
              style={
                styles.changePhotoButton
              }
            >
              <Ionicons
                name="camera"
                size={17}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.changePhotoText
                }
              >
                Change Photo
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View
            style={styles.cameraCircle}
          >
            <Ionicons
              name="camera-outline"
              size={30}
              color="#C41E3A"
            />
          </View>

          <Text
            style={styles.photoTitle}
          >
            {title}
          </Text>

          <Text
            style={
              styles.photoSubtitle
            }
          >
            Tap here to use your camera or
            choose a photo from your gallery
          </Text>

          <View
            style={styles.photoButton}
          >
            <Ionicons
              name="camera"
              size={17}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.photoButtonText
              }
            >
              {buttonText}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },

  container: {
    flexGrow: 1,
    paddingBottom: 45,
  },



  // ===================================================
  // HEADER
  // ===================================================

  cardinalHeader: {
    backgroundColor: "#8F1029",
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
    marginLeft: 13,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 2,
  },

  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#C41E3A",
    alignItems: "center",
    justifyContent: "center",
  },

  headerAccent: {
    height: 3,
    width: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 18,
    opacity: 0.9,
  },

  // ===================================================
  // INTRO
  // ===================================================

  intro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  introIcon: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: "#FFF0F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  introTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#202020",
  },

  introText: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  // ===================================================
  // ACCOUNT TYPE
  // ===================================================

  accountTypeSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  accountTypeLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.9,
    color: "#333333",
  },

  accountTypeSubtitle: {
    fontSize: 11,
    color: "#888888",
    marginTop: 4,
    marginBottom: 15,
  },

  accountTypeRow: {
    flexDirection: "row",
    gap: 11,
  },

  accountTypeCard: {
    flex: 1,
    minHeight: 145,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#E1E1E1",
    backgroundColor: "#FAFAFA",
    padding: 14,
    position: "relative",
  },

  accountTypeCardSelected: {
    borderColor: "#C41E3A",
    backgroundColor: "#FFF4F6",
  },

  accountTypeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFECEF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  accountTypeIconSelected: {
    backgroundColor: "#C41E3A",
  },

  accountTypeTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#333333",
  },

  accountTypeTitleSelected: {
    color: "#C41E3A",
  },

  accountTypeDescription: {
    fontSize: 10.5,
    lineHeight: 15,
    color: "#888888",
    marginTop: 4,
    paddingRight: 4,
  },

  accountTypeDescriptionSelected: {
    color: "#777777",
  },

  selectedCheck: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  // ===================================================
  // SECTION
  // ===================================================

  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 21,
  },

  sectionNumber: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#FFF0F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  sectionNumberText: {
    color: "#C41E3A",
    fontSize: 11,
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#242424",
  },

  sectionSubtitle: {
    color: "#8A8A8A",
    fontSize: 11,
    marginTop: 3,
  },

  // ===================================================
  // INPUT
  // ===================================================

  label: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
    color: "#555555",
    marginBottom: 7,
    marginTop: 4,
  },

  inputWrapper: {
    minHeight: 53,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  inputIcon: {
    marginLeft: 14,
  },

  input: {
    flex: 1,
    minHeight: 51,
    paddingHorizontal: 11,
    fontSize: 14,
    color: "#222222",
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
    paddingHorizontal: 11,
  },

  placeholder: {
    color: "#A0A0A0",
  },

  rightIcon: {
    marginRight: 14,
  },

  eyeButton: {
    paddingHorizontal: 14,
  },

  // ===================================================
  // DROPDOWN
  // ===================================================

  dropdown: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginTop: -10,
    marginBottom: 16,
    overflow: "hidden",
  },

  dropdownItem: {
    minHeight: 47,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  lastDropdownItem: {
    borderBottomWidth: 0,
  },

  selectedDropdownItem: {
    backgroundColor: "#FFF4F6",
  },

  dropdownText: {
    fontSize: 13,
    color: "#555555",
  },

  selectedDropdownText: {
    color: "#C41E3A",
    fontWeight: "800",
  },

  roleOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // ===================================================
  // DYNAMIC BOX
  // ===================================================

  dynamicBox: {
    flexDirection: "row",
    backgroundColor: "#FFF5F7",
    borderWidth: 1,
    borderColor: "#F2D4DA",
    borderRadius: 13,
    padding: 13,
    marginTop: 1,
    marginBottom: 16,
  },

  dynamicBoxIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFE8ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  dynamicBoxTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#333333",
    marginBottom: 4,
  },

  dynamicBoxText: {
    color: "#777777",
    fontSize: 10.5,
    lineHeight: 16,
  },

  // ===================================================
  // SELLER
  // ===================================================

  sellerIntroBox: {
    flexDirection: "row",
    backgroundColor: "#FFF5F7",
    borderWidth: 1,
    borderColor: "#F4D5DC",
    borderRadius: 13,
    padding: 13,
    marginTop: 2,
    marginBottom: 16,
  },

  sellerIntroIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFE8ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sellerIntroTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#333333",
    marginBottom: 4,
  },

  sellerIntroText: {
    color: "#777777",
    fontSize: 10.5,
    lineHeight: 16,
  },

  textAreaWrapper: {
    minHeight: 105,
    alignItems: "flex-start",
  },

  textAreaIcon: {
    marginTop: 17,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 14,
    paddingBottom: 12,
  },

  pendingBox: {
    flexDirection: "row",
    backgroundColor: "#FFF8E8",
    borderRadius: 11,
    padding: 12,
    marginTop: -3,
    marginBottom: 4,
  },

  pendingText: {
    flex: 1,
    color: "#7A6A42",
    fontSize: 10.5,
    lineHeight: 16,
    marginLeft: 8,
  },

  sellerNotice: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    backgroundColor: "#FFF5F7",
    borderWidth: 1,
    borderColor: "#F2D4DA",
    borderRadius: 15,
  },

  sellerNoticeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFE8ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sellerNoticeTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#333333",
    marginBottom: 4,
  },

  sellerNoticeText: {
    color: "#777777",
    fontSize: 10.5,
    lineHeight: 16,
  },

  // ===================================================
  // CLIENT NOTICE
  // ===================================================

  clientNotice: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    backgroundColor: "#F2FAF3",
    borderWidth: 1,
    borderColor: "#D7EBD9",
    borderRadius: 15,
  },

  clientNoticeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E1F3E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  clientNoticeTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#333333",
    marginBottom: 4,
  },

  clientNoticeText: {
    color: "#777777",
    fontSize: 10.5,
    lineHeight: 16,
  },

  // ===================================================
  // INFO
  // ===================================================

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFF5F7",
    borderRadius: 11,
    padding: 12,
    marginTop: 10,
  },

  infoText: {
    flex: 1,
    color: "#777777",
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 8,
  },

  approvedBox: {
    flexDirection: "row",
    backgroundColor: "#F2FAF3",
    borderRadius: 11,
    padding: 12,
    marginTop: 10,
  },

  approvedText: {
    flex: 1,
    color: "#5F7462",
    fontSize: 10.5,
    lineHeight: 16,
    marginLeft: 8,
  },

  // ===================================================
  // PHOTO
  // ===================================================

  photoBox: {
    minHeight: 245,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D5A0AA",
    backgroundColor: "#FFF8F9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 12,
    overflow: "hidden",
  },

  photoBoxWithImage: {
    padding: 0,
    borderStyle: "solid",
    borderColor: "#C41E3A",
  },

  cameraCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFECEF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  photoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333333",
    textAlign: "center",
  },

  photoSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 6,
    maxWidth: 250,
  },

  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C41E3A",
    paddingHorizontal: 17,
    height: 40,
    borderRadius: 10,
    marginTop: 15,
    gap: 7,
  },

  photoButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  idPreview: {
    width: "100%",
    height: 245,
    resizeMode: "cover",
  },

  photoOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 65,
    backgroundColor:
      "rgba(0,0,0,0.48)",
    alignItems: "center",
    justifyContent: "center",
  },

  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C41E3A",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },

  changePhotoText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  securityBox: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 11,
  },

  securityText: {
    flex: 1,
    color: "#777777",
    fontSize: 10.5,
    lineHeight: 16,
    marginLeft: 8,
  },

  // ===================================================
  // PASSWORD
  // ===================================================

  passwordHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
  },

  passwordHintText: {
    color: "#888888",
    fontSize: 10.5,
    marginLeft: 6,
  },

  // ===================================================
  // REGISTER BUTTON
  // ===================================================

  registerButton: {
    minHeight: 58,
    marginHorizontal: 16,
    marginTop: 22,
    borderRadius: 15,
    backgroundColor: "#C41E3A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#C41E3A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    paddingHorizontal: 15,
  },

  registerButtonDisabled: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "900",
    letterSpacing: 0.6,
    textAlign: "center",
  },

  // ===================================================
  // LOGIN
  // ===================================================

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    color: "#777777",
    fontSize: 13,
  },

  loginLink: {
    color: "#C41E3A",
    fontSize: 13,
    fontWeight: "900",
  },

  // ===================================================
  // FOOTER
  // ===================================================

  footer: {
    textAlign: "center",
    color: "#C41E3A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 28,
  },

  footerSub: {
    textAlign: "center",
    color: "#AAAAAA",
    fontSize: 10,
    marginTop: 3,
  },
});

