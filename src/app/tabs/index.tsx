import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   TUP COLOR SYSTEM
========================================================= */

const CARDINAL = "#8F1029";
const CARDINAL_DARK = "#730D20";
const CARDINAL_DEEP = "#5B0918";
const CARDINAL_SOFT = "#A6192E";

const GOLD = "#D8B56A";

const WHITE = "#FFFFFF";

const SUCCESS = "#2E8B57";
const CLOSED = "#C44747";

const TUP_LOGO = require("../../../assets/main-image/logo.png");

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function Home() {
  const { darkMode } = useTheme();

  /* =======================================================
     DYNAMIC THEME
  ======================================================= */

  const theme = {
    background: darkMode ? "#101010" : "#F4F5F7",
    card: darkMode ? "#1A1A1A" : "#FFFFFF",
    cardSoft: darkMode ? "#222222" : "#F6F7F8",
    text: darkMode ? "#FFFFFF" : "#1E2024",
    secondary: darkMode ? "#AFAFAF" : "#62666D",
    muted: darkMode ? "#777777" : "#92959A",
    border: darkMode ? "#2B2B2B" : "#E7E8EB",
    softRed: darkMode ? "#321D22" : "#FBECEF",
    softGold: darkMode ? "#332D1F" : "#F4E8CC",
    softGray: darkMode ? "#292929" : "#EEF1F5",
    darkIcon: darkMode ? "#B5B5B5" : "#59616C",
  };

  /* =======================================================
     STATES
  ======================================================= */

  const [cartCount, setCartCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  /* =======================================================
     LIVE TIME
  ======================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  /* =======================================================
     GREETING
  ======================================================= */

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  }, [currentTime]);

  /* =======================================================
     CAMPUS FOOD SERVICE STATUS
     9:00 AM - 6:00 PM
  ======================================================= */

  const campusOpen = useMemo(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();

    const currentMinutes = hour * 60 + minute;

    const opening = 9 * 60;
    const closing = 18 * 60;

    return (
      currentMinutes >= opening &&
      currentMinutes < closing
    );
  }, [currentTime]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = (path: string) => {
    router.push(path as any);
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setCurrentTime(new Date());
      setRefreshing(false);
    }, 700);
  };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = () => {
    setCartCount((previous) => previous + 1);

    Alert.alert(
      "Added to Cart",
      "Campus Meal has been added to your cart.",
      [
        {
          text: "Continue",
          style: "cancel",
        },
        {
          text: "View Cart",
          onPress: () => navigate("/cart"),
        },
      ]
    );
  };

  /* =======================================================
     CART
  ======================================================= */

  const openCart = () => {
    navigate("/cart");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.background,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={CARDINAL_DEEP}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={CARDINAL}
            colors={[CARDINAL]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerGlow} />

          <View style={styles.headerTop}>
            <View style={styles.brandArea}>
              <View style={styles.logoContainer}>
                <Image
                  source={TUP_LOGO}
                  style={styles.tupLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.brandText}>
                <Text style={styles.universityName}>
                  TECHNOLOGICAL UNIVERSITY
                </Text>

                <Text style={styles.universityName}>
                  OF THE PHILIPPINES
                </Text>

                <View style={styles.brandDivider} />

                <Text style={styles.appName}>
                  TUP-OrderUp
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.cartButton}
              activeOpacity={0.8}
              onPress={openCart}
            >
              <Ionicons
                name="bag-handle-outline"
                size={23}
                color={WHITE}
              />

              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartCount > 9
                      ? "9+"
                      : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.headerBottom}>
            <View>
              <Text style={styles.headerWelcome}>
                CAMPUS FOOD SERVICES
              </Text>

              <Text style={styles.headerSubtitle}>
                Convenient ordering for the TUP community
              </Text>
            </View>

            <View style={styles.statusMini}>
              <View
                style={[
                  styles.statusMiniDot,
                  {
                    backgroundColor: campusOpen
                      ? "#65D18B"
                      : "#E07878",
                  },
                ]}
              />

              <Text style={styles.statusMiniText}>
                {campusOpen ? "OPEN" : "CLOSED"}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            WELCOME CARD
        ================================================= */}

        <View
          style={[
            styles.welcomeCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.welcomeAccent} />

          <View
            style={[
              styles.welcomeIcon,
              {
                backgroundColor: theme.softRed,
              },
            ]}
          >
            <Ionicons
              name="restaurant-outline"
              size={25}
              color={CARDINAL}
            />
          </View>

          <View style={styles.welcomeContent}>
            <Text
              style={[
                styles.welcomeGreeting,
                {
                  color: theme.text,
                },
              ]}
            >
              {greeting}! 👋
            </Text>

            <Text
              style={[
                styles.welcomeText,
                {
                  color: theme.secondary,
                },
              ]}
            >
              Order your favorite meals from campus
              food services with ease.
            </Text>
          </View>
        </View>

        {/* =================================================
            QUICK ACCESS
        ================================================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Quick Access
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: theme.muted,
                },
              ]}
            >
              Your most important services
            </Text>
          </View>
        </View>

        <View style={styles.quickGrid}>
          {/* ORDER */}

          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.82}
            onPress={() => navigate("/order")}
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor: theme.softRed,
                },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={24}
                color={CARDINAL}
              />
            </View>

            <View style={styles.quickTextArea}>
              <Text
                style={[
                  styles.quickTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Order Food
              </Text>

              <Text
                style={[
                  styles.quickDescription,
                  {
                    color: theme.muted,
                  },
                ]}
              >
                Browse today's available meals
              </Text>
            </View>

            <View style={styles.quickArrow}>
              <Ionicons
                name="chevron-forward"
                size={17}
                color={CARDINAL}
              />
            </View>
          </TouchableOpacity>

          {/* ORDERS */}

          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.82}
            onPress={() => navigate("/orders")}
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor: theme.softGold,
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={24}
                color="#9A6A16"
              />
            </View>

            <View style={styles.quickTextArea}>
              <Text
                style={[
                  styles.quickTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                My Orders
              </Text>

              <Text
                style={[
                  styles.quickDescription,
                  {
                    color: theme.muted,
                  },
                ]}
              >
                Track your current orders
              </Text>
            </View>

            <View style={styles.quickArrow}>
              <Ionicons
                name="chevron-forward"
                size={17}
                color={CARDINAL}
              />
            </View>
          </TouchableOpacity>

          {/* FAVORITES */}

          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.82}
            onPress={() => navigate("/favorites")}
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor: theme.softRed,
                },
              ]}
            >
              <Ionicons
                name="heart-outline"
                size={24}
                color={CARDINAL}
              />
            </View>

            <View style={styles.quickTextArea}>
              <Text
                style={[
                  styles.quickTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Favorites
              </Text>

              <Text
                style={[
                  styles.quickDescription,
                  {
                    color: theme.muted,
                  },
                ]}
              >
                Access your favorite meals
              </Text>
            </View>

            <View style={styles.quickArrow}>
              <Ionicons
                name="chevron-forward"
                size={17}
                color={CARDINAL}
              />
            </View>
          </TouchableOpacity>

          {/* PROFILE */}

          <TouchableOpacity
            style={[
              styles.quickCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.82}
            onPress={() => navigate("/profile")}
          >
            <View
              style={[
                styles.quickIcon,
                {
                  backgroundColor: theme.softGray,
                },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={theme.darkIcon}
              />
            </View>

            <View style={styles.quickTextArea}>
              <Text
                style={[
                  styles.quickTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                My Profile
              </Text>

              <Text
                style={[
                  styles.quickDescription,
                  {
                    color: theme.muted,
                  },
                ]}
              >
                Manage your account
              </Text>
            </View>

            <View style={styles.quickArrow}>
              <Ionicons
                name="chevron-forward"
                size={17}
                color={CARDINAL}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* =================================================
            CAMPUS STATUS
        ================================================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Campus Status
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: theme.muted,
                },
              ]}
            >
              Food service availability
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          activeOpacity={0.82}
          onPress={() => navigate("/order")}
        >
          <View
            style={[
              styles.statusIconWrapper,
              {
                backgroundColor: theme.softRed,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={25}
              color={CARDINAL}
            />
          </View>

          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Campus Food Services
            </Text>

            <View style={styles.statusLine}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: campusOpen
                      ? SUCCESS
                      : CLOSED,
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusValue,
                  {
                    color: campusOpen
                      ? SUCCESS
                      : CLOSED,
                  },
                ]}
              >
                {campusOpen
                  ? "Currently Open"
                  : "Currently Closed"}
              </Text>
            </View>

            <Text
              style={[
                styles.statusSchedule,
                {
                  color: theme.muted,
                },
              ]}
            >
              Operating hours · 9:00 AM – 6:00 PM
            </Text>
          </View>

          <View style={styles.statusArrow}>
            <Ionicons
              name="chevron-forward"
              size={19}
              color={theme.muted}
            />
          </View>
        </TouchableOpacity>

        {/* =================================================
            FEATURED MEAL
        ================================================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Featured Today
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: theme.muted,
                },
              ]}
            >
              A student favorite
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate("/order")}
          >
            <Text style={styles.viewAll}>
              VIEW MENU
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.featuredCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.featuredImage,
              {
                backgroundColor: theme.softRed,
              },
            ]}
          >
            <View
              style={
                styles.featuredImageInner
              }
            >
              <Ionicons
                name="fast-food-outline"
                size={40}
                color={CARDINAL}
              />
            </View>

            <View
              style={
                styles.popularTag
              }
            >
              <Ionicons
                name="star"
                size={11}
                color={GOLD}
              />

              <Text
                style={
                  styles.popularTagText
                }
              >
                POPULAR
              </Text>
            </View>
          </View>

          <View style={styles.featuredInfo}>
            <Text
              style={[
                styles.featuredName,
                {
                  color: theme.text,
                },
              ]}
            >
              Campus Meal
            </Text>

            <Text
              style={[
                styles.featuredDescription,
                {
                  color: theme.muted,
                },
              ]}
            >
              Affordable and delicious student meal
            </Text>

            <View
              style={
                styles.featuredMeta
              }
            >
              <Text
                style={
                  styles.featuredPrice
                }
              >
                ₱99.00
              </Text>

              <View
                style={
                  styles.ratingContainer
                }
              >
                <Ionicons
                  name="star"
                  size={14}
                  color={GOLD}
                />

                <Text
                  style={[
                    styles.ratingText,
                    {
                      color:
                        theme.secondary,
                    },
                  ]}
                >
                  4.8
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={
              styles.addButton
            }
            activeOpacity={0.85}
            onPress={addToCart}
          >
            <Ionicons
              name="add"
              size={22}
              color={WHITE}
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            CART SUMMARY
        ================================================= */}

        {cartCount > 0 && (
          <TouchableOpacity
            style={
              styles.cartSummary
            }
            activeOpacity={0.88}
            onPress={openCart}
          >
            <View
              style={
                styles.cartSummaryIcon
              }
            >
              <Ionicons
                name="bag-handle"
                size={20}
                color={WHITE}
              />
            </View>

            <View
              style={
                styles.cartSummaryContent
              }
            >
              <Text
                style={
                  styles.cartSummaryTitle
                }
              >
                {cartCount} item
                {cartCount > 1
                  ? "s"
                  : ""}{" "}
                in your cart
              </Text>

              <Text
                style={
                  styles.cartSummaryText
                }
              >
                Tap to review your selected items
              </Text>
            </View>

            <View
              style={
                styles.cartSummaryArrow
              }
            >
              <Ionicons
                name="arrow-forward"
                size={18}
                color={WHITE}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* =================================================
            UNIVERSITY FOOTER
        ================================================= */}

        <View style={styles.footer}>
          <View
            style={
              styles.footerLine
            }
          />

          <Image
            source={TUP_LOGO}
            style={
              styles.footerLogo
            }
            resizeMode="contain"
          />

          <Text
            style={[
              styles.footerTitle,
              {
                color: theme.muted,
              },
            ]}
          >
            TECHNOLOGICAL UNIVERSITY
          </Text>

          <Text
            style={[
              styles.footerTitle,
              {
                color: theme.muted,
              },
            ]}
          >
            OF THE PHILIPPINES
          </Text>

          <Text
            style={
              styles.footerApp
            }
          >
            TUP-OrderUp
          </Text>

          <View
            style={
              styles.footerSecure
            }
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={theme.muted}
            />

            <Text
              style={[
                styles.footerSecureText,
                {
                  color: theme.muted,
                },
              ]}
            >
              Safe & Convenient Campus Ordering
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 35,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    backgroundColor: CARDINAL_DEEP,

    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 21,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    overflow: "hidden",
  },

  headerGlow: {
    position: "absolute",

    right: -70,
    top: -80,

    width: 220,
    height: 220,

    borderRadius: 110,

    backgroundColor:
      "rgba(255,255,255,0.035)",
  },

  headerTop: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brandArea: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,

    paddingRight: 10,
  },

  logoContainer: {
    width: 58,
    height: 58,

    borderRadius: 16,

    backgroundColor: WHITE,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  tupLogo: {
    width: 46,
    height: 46,
  },

  brandText: {
    flex: 1,
  },

  universityName: {
    color: "#F7E8EB",

    fontSize: 8,
    fontWeight: "800",

    letterSpacing: 0.75,
  },

  brandDivider: {
    width: 35,
    height: 2,

    backgroundColor: GOLD,

    marginTop: 6,
    marginBottom: 6,

    borderRadius: 2,
  },

  appName: {
    color: WHITE,

    fontSize: 22,
    fontWeight: "900",

    letterSpacing: -0.4,
  },

  cartButton: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor:
      "rgba(255,255,255,0.12)",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.10)",
  },

  cartBadge: {
    position: "absolute",

    top: -4,
    right: -4,

    minWidth: 19,
    height: 19,

    borderRadius: 10,

    backgroundColor: GOLD,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,

    borderWidth: 2,
    borderColor: CARDINAL_DEEP,
  },

  cartBadgeText: {
    color: CARDINAL_DEEP,

    fontSize: 9,
    fontWeight: "900",
  },

  headerBottom: {
    marginTop: 20,

    paddingTop: 15,

    borderTopWidth: 1,
    borderTopColor:
      "rgba(255,255,255,0.10)",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },

  headerWelcome: {
    color: "#F6DCE2",

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.1,
  },

  headerSubtitle: {
    color: "#DABBC2",

    fontSize: 10.5,

    marginTop: 3,
  },

  statusMini: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 10,

    backgroundColor:
      "rgba(255,255,255,0.08)",
  },

  statusMiniDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,
  },

  statusMiniText: {
    color: WHITE,

    fontSize: 8.5,
    fontWeight: "900",

    letterSpacing: 0.8,
  },

  /* =======================================================
     WELCOME
  ======================================================= */

  welcomeCard: {
    marginHorizontal: 18,
    marginTop: -11,

    borderRadius: 18,

    padding: 16,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.07,
    shadowRadius: 8,

    elevation: 3,

    overflow: "hidden",
  },

  welcomeAccent: {
    position: "absolute",

    left: 0,
    top: 0,
    bottom: 0,

    width: 4,

    backgroundColor: CARDINAL,
  },

  welcomeIcon: {
    width: 50,
    height: 50,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeGreeting: {
    fontSize: 16,
    fontWeight: "900",
  },

  welcomeText: {
    fontSize: 11.5,

    lineHeight: 17,

    marginTop: 4,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    marginHorizontal: 20,

    marginTop: 26,
    marginBottom: 12,

    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 10.5,

    marginTop: 3,
  },

  viewAll: {
    color: CARDINAL,

    fontSize: 9.5,
    fontWeight: "900",

    letterSpacing: 0.5,
  },

  /* =======================================================
     QUICK GRID
  ======================================================= */

  quickGrid: {
    paddingHorizontal: 18,

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",
  },

  quickCard: {
    width: "48.4%",

    minHeight: 106,

    borderRadius: 17,

    padding: 13,

    marginBottom: 11,

    borderWidth: 1,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 2,
  },

  quickIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 9,
  },

  quickTextArea: {
    paddingRight: 12,
  },

  quickTitle: {
    fontSize: 13,
    fontWeight: "900",
  },

  quickDescription: {
    fontSize: 9.5,

    lineHeight: 14,

    marginTop: 3,
  },

  quickArrow: {
    position: "absolute",

    right: 10,
    bottom: 11,
  },

  /* =======================================================
     CAMPUS STATUS
  ======================================================= */

  statusCard: {
    marginHorizontal: 18,

    borderRadius: 17,

    padding: 15,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 2,
  },

  statusIconWrapper: {
    width: 48,
    height: 48,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 13.5,
    fontWeight: "900",
  },

  statusLine: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 5,
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  statusValue: {
    fontSize: 11,
    fontWeight: "800",
  },

  statusSchedule: {
    fontSize: 9.5,

    marginTop: 3,
  },

  statusArrow: {
    paddingLeft: 8,
  },

  /* =======================================================
     FEATURED
  ======================================================= */

  featuredCard: {
    marginHorizontal: 18,

    borderRadius: 19,

    padding: 12,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.045,
    shadowRadius: 7,

    elevation: 2,
  },

  featuredImage: {
    width: 82,
    height: 82,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    position: "relative",
  },

  featuredImageInner: {
    justifyContent: "center",
    alignItems: "center",
  },

  popularTag: {
    position: "absolute",

    top: 6,
    left: 6,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 5,
    paddingVertical: 3,

    borderRadius: 6,

    backgroundColor: CARDINAL,
  },

  popularTagText: {
    color: WHITE,

    fontSize: 6.5,
    fontWeight: "900",

    marginLeft: 3,
  },

  featuredInfo: {
    flex: 1,

    marginLeft: 13,

    paddingRight: 8,
  },

  featuredName: {
    fontSize: 15,
    fontWeight: "900",
  },

  featuredDescription: {
    fontSize: 10,

    lineHeight: 14,

    marginTop: 4,
  },

  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,
  },

  featuredPrice: {
    color: CARDINAL,

    fontSize: 14,
    fontWeight: "900",

    marginRight: 11,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 10.5,
    fontWeight: "700",

    marginLeft: 4,
  },

  addButton: {
    width: 39,
    height: 39,

    borderRadius: 13,

    backgroundColor: CARDINAL,

    justifyContent: "center",
    alignItems: "center",
  },

  /* =======================================================
     CART SUMMARY
  ======================================================= */

  cartSummary: {
    marginHorizontal: 18,

    marginTop: 13,

    padding: 12,

    borderRadius: 16,

    backgroundColor: CARDINAL_DARK,

    flexDirection: "row",
    alignItems: "center",
  },

  cartSummaryIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor:
      "rgba(255,255,255,0.13)",

    justifyContent: "center",
    alignItems: "center",
  },

  cartSummaryContent: {
    flex: 1,

    marginLeft: 10,
  },

  cartSummaryTitle: {
    color: WHITE,

    fontSize: 12,
    fontWeight: "900",
  },

  cartSummaryText: {
    color: "#EBCDD3",

    fontSize: 9.5,

    marginTop: 2,
  },

  cartSummaryArrow: {
    width: 32,
    height: 32,

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.10)",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    alignItems: "center",

    marginTop: 33,

    paddingHorizontal: 20,
  },

  footerLine: {
    width: 42,
    height: 2,

    borderRadius: 2,

    backgroundColor: GOLD,

    marginBottom: 15,
  },

  footerLogo: {
    width: 42,
    height: 42,

    marginBottom: 8,
  },

  footerTitle: {
    fontSize: 7.5,
    fontWeight: "800",

    letterSpacing: 0.7,
  },

  footerApp: {
    color: CARDINAL,

    fontSize: 10,
    fontWeight: "900",

    marginTop: 7,
  },

  footerSecure: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 10,
  },

  footerSecureText: {
    fontSize: 8.5,

    marginLeft: 4,
  },
});