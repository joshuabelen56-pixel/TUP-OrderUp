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

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.18.24:5000";

const PRIMARY = "#C41E3A";
const DARK_RED = "#8F1029";

const STORE_CATEGORIES = [
  "Food & Meals",
  "Snacks",
  "Drinks",
  "Desserts",
  "School Supplies",
  "Printing Services",
  "School Merchandise",
  "Other",
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

export default function SellerRegister() {
  // =====================================================
  // PERSONAL INFORMATION
  // =====================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);

  // =====================================================
  // BUSINESS INFORMATION
  // =====================================================

  const [storeName, setStoreName] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeLocation, setStoreLocation] = useState("");

  const [showCategoryPicker, setShowCategoryPicker] =
    useState(false);

  // =====================================================
  // CONTACT
  // =====================================================

  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  // =====================================================
  // GOVERNMENT ID
  // =====================================================

  const [governmentIdType, setGovernmentIdType] =
    useState("");

  const [governmentIdNumber, setGovernmentIdNumber] =
    useState("");

  const [showIdPicker, setShowIdPicker] =
    useState(false);

  const [idPhoto, setIdPhoto] =
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
  // DATE
  // =====================================================

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // DATE FORMAT
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
  // TAKE GOVERNMENT ID PHOTO
  // =====================================================

  const takeIDPhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access so you can take a photo of your government ID."
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        setIdPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("ID camera error:", error);

      Alert.alert(
        "Camera Error",
        "Unable to open the camera."
      );
    }
  };

  // =====================================================
  // CHOOSE GOVERNMENT ID PHOTO
  // =====================================================

  const chooseIDPhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Gallery Permission Required",
          "Please allow gallery access so you can select your government ID photo."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        setIdPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("ID gallery error:", error);

      Alert.alert(
        "Gallery Error",
        "Unable to open your gallery."
      );
    }
  };

  // =====================================================
  // ID PHOTO MENU
  // =====================================================

  const handleIDPhoto = () => {
    Alert.alert(
      "Government ID Photo",
      "How would you like to provide your government ID photo?",
      [
        {
          text: "Take Photo",
          onPress: takeIDPhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: chooseIDPhoto,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim()
    ) {
      Alert.alert(
        "Incomplete Information",
        "Please complete your first name, last name, and username."
      );
      return false;
    }

    if (!birthday) {
      Alert.alert(
        "Birthday Required",
        "Please select your birthday."
      );
      return false;
    }

    // ===================================================
    // BUSINESS
    // ===================================================

    if (!storeName.trim()) {
      Alert.alert(
        "Store Name Required",
        "Please enter your store or business name."
      );
      return false;
    }

    if (!storeCategory) {
      Alert.alert(
        "Store Category Required",
        "Please select your store category."
      );
      return false;
    }

    if (!storeLocation.trim()) {
      Alert.alert(
        "Store Location Required",
        "Please enter your store location."
      );
      return false;
    }

    // ===================================================
    // CONTACT
    // ===================================================

    if (!contactNumber.trim()) {
      Alert.alert(
        "Contact Number Required",
        "Please enter your contact number."
      );
      return false;
    }

    if (!email.trim()) {
      Alert.alert(
        "Email Required",
        "Please enter your email address."
      );
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return false;
    }

    // ===================================================
    // GOVERNMENT ID
    // ===================================================

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

    if (!idPhoto) {
      Alert.alert(
        "Government ID Photo Required",
        "Please provide a clear photo of your government ID."
      );
      return false;
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
  // REGISTER SELLER
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

      console.log(
        "Sending seller registration to:",
        `${API_URL}/api/sellers`
      );

      const formData = new FormData();

      // =================================================
      // PERSONAL
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
        "birthday",
        birthday!.toISOString()
      );

      // =================================================
      // SELLER ROLE
      // =================================================

      formData.append(
        "role",
        "Seller"
      );

      // =================================================
      // BUSINESS
      // =================================================

      formData.append(
        "storeName",
        storeName.trim()
      );

      formData.append(
        "storeCategory",
        storeCategory
      );

      formData.append(
        "storeDescription",
        storeDescription.trim()
      );

      formData.append(
        "storeLocation",
        storeLocation.trim()
      );

      // =================================================
      // CONTACT
      // =================================================

      formData.append(
        "contactNumber",
        contactNumber.trim()
      );

      formData.append(
        "email",
        email.trim().toLowerCase()
      );

      // =================================================
      // GOVERNMENT ID
      // =================================================

      formData.append(
        "governmentIdType",
        governmentIdType
      );

      formData.append(
        "governmentIdNumber",
        governmentIdNumber.trim()
      );

      // =================================================
      // PASSWORD
      // =================================================

      formData.append(
        "password",
        password
      );

      // =================================================
      // PHOTO
      // =================================================

      if (!idPhoto) {
        throw new Error(
          "Verification photo is missing."
        );
      }

      const photoFile = new File(idPhoto);

      console.log(
        "Selected seller ID photo:",
        idPhoto
      );

      console.log(
        "Photo exists:",
        photoFile.exists
      );

      console.log(
        "Photo name:",
        photoFile.name
      );

      console.log(
        "Photo type:",
        photoFile.type
      );

      if (!photoFile.exists) {
        throw new Error(
          "Selected photo file does not exist."
        );
      }

      formData.append(
        "verificationPhoto",
        photoFile
      );

      // =================================================
      // SEND
      // =================================================

      const response = await fetch(
        `${API_URL}/api/sellers`,
        {
          method: "POST",
          body: formData,
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      console.log(
        "Seller registration status:",
        response.status
      );

      console.log(
        "Seller registration response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Seller registration failed (${response.status}).`
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      Alert.alert(
        "Application Submitted",
        "Your seller account has been created and is now pending admin approval. You can log in once your application has been approved.",
        [
          {
            text: "Continue to Login",
            onPress: () => {
              router.replace("../login");
            },
          },
        ]
      );

      // =================================================
      // CLEAR FORM
      // =================================================

      setFirstName("");
      setLastName("");
      setUsername("");
      setBirthday(null);

      setStoreName("");
      setStoreCategory("");
      setStoreDescription("");
      setStoreLocation("");

      setContactNumber("");
      setEmail("");

      setGovernmentIdType("");
      setGovernmentIdNumber("");
      setIdPhoto(null);

      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(
        "SELLER REGISTRATION ERROR:",
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
        "Seller Registration Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={DARK_RED}
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}

          <View style={styles.header}>
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
                <Text style={styles.headerTitle}>
                  Become a Seller
                </Text>

                <Text
                  style={styles.headerSubtitle}
                >
                  TUP-OrderUp Seller Registration
                </Text>
              </View>

              <View style={styles.headerIcon}>
                <Ionicons
                  name="storefront"
                  size={25}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View
              style={styles.headerAccent}
            />
          </View>

          {/* INTRO */}

          <View style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons
                name="storefront-outline"
                size={29}
                color={PRIMARY}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.introTitle}>
                Start selling on campus.
              </Text>

              <Text style={styles.introText}>
                Create your seller account and
                submit your store information for
                admin review.
              </Text>
            </View>
          </View>

          {/* PENDING NOTICE */}

          <View style={styles.pendingBox}>
            <View style={styles.pendingIcon}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#B77900"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>
                Admin Approval Required
              </Text>

              <Text style={styles.pendingText}>
                Seller accounts are not activated
                immediately. Your application will
                remain Pending until an administrator
                reviews and approves it.
              </Text>
            </View>
          </View>

          {/* SECTION 01 */}

          <View style={styles.section}>
            <SectionHeader
              number="01"
              title="Owner Information"
              subtitle="Tell us about the person managing the store"
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
              placeholder="Enter your seller username"
              value={username}
              onChangeText={setUsername}
              icon="at-outline"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              BIRTHDAY *
            </Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() =>
                setShowDatePicker(true)
              }
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

          {/* SECTION 02 */}

          <View style={styles.section}>
            <SectionHeader
              number="02"
              title="Store Information"
              subtitle="Provide the details of your business"
            />

            <InputField
              label="STORE / BUSINESS NAME *"
              placeholder="Example: Josh's Food Corner"
              value={storeName}
              onChangeText={setStoreName}
              icon="storefront-outline"
              autoCapitalize="words"
            />

            <Text style={styles.label}>
              STORE CATEGORY *
            </Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() =>
                setShowCategoryPicker(
                  !showCategoryPicker
                )
              }
            >
              <Ionicons
                name="grid-outline"
                size={20}
                color="#777777"
                style={styles.inputIcon}
              />

              <Text
                style={[
                  styles.dateText,
                  !storeCategory &&
                    styles.placeholder,
                ]}
              >
                {storeCategory ||
                  "Select store category"}
              </Text>

              <Ionicons
                name={
                  showCategoryPicker
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={18}
                color="#888888"
                style={styles.rightIcon}
              />
            </TouchableOpacity>

            {showCategoryPicker && (
              <View style={styles.dropdown}>
                {STORE_CATEGORIES.map(
                  (item, index) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.dropdownItem,
                        index ===
                          STORE_CATEGORIES.length -
                            1 &&
                          styles.lastDropdownItem,
                        storeCategory === item &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={() => {
                        setStoreCategory(item);
                        setShowCategoryPicker(
                          false
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          storeCategory === item &&
                            styles.selectedDropdownText,
                        ]}
                      >
                        {item}
                      </Text>

                      {storeCategory ===
                        item && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={PRIMARY}
                        />
                      )}
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}

            <InputField
              label="STORE LOCATION *"
              placeholder="Example: TUP Dasmariñas Main Building"
              value={storeLocation}
              onChangeText={setStoreLocation}
              icon="location-outline"
              autoCapitalize="sentences"
            />

            <Text style={styles.label}>
              STORE DESCRIPTION
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
                  {
                    alignSelf: "flex-start",
                    marginTop: 16,
                  },
                ]}
              />

              <TextInput
                style={styles.textArea}
                placeholder="Tell customers a little about your store..."
                placeholderTextColor="#A0A0A0"
                value={storeDescription}
                onChangeText={
                  setStoreDescription
                }
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* SECTION 03 */}

          <View style={styles.section}>
            <SectionHeader
              number="03"
              title="Contact Information"
              subtitle="How customers and administrators can reach you"
            />

            <InputField
              label="CONTACT NUMBER *"
              placeholder="09XXXXXXXXX"
              value={contactNumber}
              onChangeText={setContactNumber}
              icon="call-outline"
              keyboardType="phone-pad"
            />

            <InputField
              label="EMAIL ADDRESS *"
              placeholder="seller@example.com"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* SECTION 04 */}

          <View style={styles.section}>
            <SectionHeader
              number="04"
              title="Seller Verification"
              subtitle="One valid government ID is required"
            />

            <Text style={styles.label}>
              GOVERNMENT ID TYPE *
            </Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() =>
                setShowIdPicker(
                  !showIdPicker
                )
              }
            >
              <Ionicons
                name="card-outline"
                size={20}
                color="#777777"
                style={styles.inputIcon}
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
                style={styles.rightIcon}
              />
            </TouchableOpacity>

            {showIdPicker && (
              <View style={styles.dropdown}>
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
                        governmentIdType === item &&
                          styles.selectedDropdownItem,
                      ]}
                      onPress={() => {
                        setGovernmentIdType(
                          item
                        );
                        setShowIdPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownText,
                          governmentIdType === item &&
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
                          color={PRIMARY}
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

            <Text style={styles.label}>
              GOVERNMENT ID PHOTO *
            </Text>

            <TouchableOpacity
              style={[
                styles.photoBox,
                idPhoto &&
                  styles.photoBoxWithImage,
              ]}
              onPress={handleIDPhoto}
              activeOpacity={0.85}
            >
              {idPhoto ? (
                <>
                  <Image
                    source={{
                      uri: idPhoto,
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
                      color={PRIMARY}
                    />
                  </View>

                  <Text
                    style={styles.photoTitle}
                  >
                    Add Your Government ID
                  </Text>

                  <Text
                    style={styles.photoSubtitle}
                  >
                    Take a clear photo using your
                    camera or choose one from your
                    gallery.
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
                      ADD ID PHOTO
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.securityBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={19}
                color={PRIMARY}
              />

              <Text
                style={styles.securityText}
              >
                Your ID will be reviewed by an
                administrator to verify your seller
                application.
              </Text>
            </View>
          </View>

          {/* SECTION 05 */}

          <View style={styles.section}>
            <SectionHeader
              number="05"
              title="Account Security"
              subtitle="Create a secure seller password"
            />

            <Text style={styles.label}>
              PASSWORD *
            </Text>

            <View style={styles.inputWrapper}>
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

            <Text style={styles.label}>
              CONFIRM PASSWORD *
            </Text>

            <View style={styles.inputWrapper}>
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

            <View style={styles.passwordHint}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#777777"
              />

              <Text
                style={styles.passwordHintText}
              >
                Use at least 8 characters for
                better security.
              </Text>
            </View>
          </View>

          {/* SUBMIT */}

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

                <Text
                  style={
                    styles.registerButtonText
                  }
                >
                  SUBMITTING APPLICATION...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="send-outline"
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.registerButtonText
                  }
                >
                  SUBMIT SELLER APPLICATION
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* LOGIN */}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace("../login")
              }
              disabled={loading}
            >
              <Text style={styles.loginLink}>
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </View>

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
          style={styles.sectionNumberText}
        >
          {number}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text
          style={styles.sectionSubtitle}
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
}) {
  return (
    <>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputWrapper}>
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
        />
      </View>
    </>
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

  header: {
    backgroundColor: DARK_RED,
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
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  headerAccent: {
    height: 3,
    width: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 18,
    opacity: 0.9,
  },

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
    fontSize: 21,
    fontWeight: "900",
    color: "#202020",
  },

  introText: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  pendingBox: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: "#FFF8E8",
    borderWidth: 1,
    borderColor: "#F1D58A",
    borderRadius: 15,
  },

  pendingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF0C8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  pendingTitle: {
    color: "#765400",
    fontSize: 13,
    fontWeight: "900",
  },

  pendingText: {
    color: "#8A6D25",
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 3,
  },

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
    color: PRIMARY,
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

  textAreaWrapper: {
    minHeight: 125,
    alignItems: "flex-start",
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

  textArea: {
    flex: 1,
    minHeight: 115,
    paddingHorizontal: 11,
    paddingTop: 15,
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
    color: PRIMARY,
    fontWeight: "800",
  },

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
    borderColor: PRIMARY,
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
    maxWidth: 260,
  },

  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY,
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
    backgroundColor: "rgba(0,0,0,0.48)",
    alignItems: "center",
    justifyContent: "center",
  },

  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY,
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

  registerButton: {
    height: 58,
    marginHorizontal: 16,
    marginTop: 22,
    borderRadius: 15,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },

  registerButtonDisabled: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

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
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "900",
  },

  footer: {
    textAlign: "center",
    color: PRIMARY,
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