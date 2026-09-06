import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#8F1029"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>WELCOME TO</Text>

            <Text style={styles.logoText}>
              TUP-OrderUp
            </Text>

            <Text style={styles.headerSubtitle}>
              Campus Ordering System
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="restaurant-outline"
              size={24}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* WELCOME CARD */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Ionicons
              name="fast-food-outline"
              size={29}
              color="#C41E3A"
            />
          </View>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Good day! 👋
            </Text>

            <Text style={styles.welcomeText}>
              Get your favorite campus meals without
              the long waiting time.
            </Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>

            <Text style={styles.sectionSubtitle}>
              Everything you need in one place
            </Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          {/* ORDER */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="cart-outline"
                size={27}
                color="#C41E3A"
              />
            </View>

            <Text style={styles.actionTitle}>
              Order Food
            </Text>

            <Text style={styles.actionText}>
              Browse available campus meals.
            </Text>

            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>

          {/* ORDERS */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="receipt-outline"
                size={27}
                color="#C41E3A"
              />
            </View>

            <Text style={styles.actionTitle}>
              My Orders
            </Text>

            <Text style={styles.actionText}>
              Track your orders and history.
            </Text>

            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>

          {/* FAVORITES */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="heart-outline"
                size={27}
                color="#C41E3A"
              />
            </View>

            <Text style={styles.actionTitle}>
              Favorites
            </Text>

            <Text style={styles.actionText}>
              Quickly access your favorite meals.
            </Text>

            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>

          {/* PROFILE */}
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="person-outline"
                size={27}
                color="#C41E3A"
              />
            </View>

            <Text style={styles.actionTitle}>
              My Profile
            </Text>

            <Text style={styles.actionText}>
              Manage your account information.
            </Text>

            <View style={styles.arrowCircle}>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* CAMPUS STATUS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Campus Status
            </Text>

            <Text style={styles.sectionSubtitle}>
              Current food service availability
            </Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="time-outline"
              size={25}
              color="#C41E3A"
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              Campus Food Services
            </Text>

            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />

              <Text style={styles.openText}>
                Open
              </Text>
            </View>

            <Text style={styles.schedule}>
              9:00 AM – 6:00 PM
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#AAAAAA"
          />
        </View>

        {/* POPULAR */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Popular Today
            </Text>

            <Text style={styles.sectionSubtitle}>
              Student favorites
            </Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.seeAll}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.foodCard}>
          <View style={styles.foodImage}>
            <Ionicons
              name="fast-food-outline"
              size={38}
              color="#C41E3A"
            />
          </View>

          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>
              Campus Meal
            </Text>

            <Text style={styles.foodDescription}>
              Affordable and delicious student meal
            </Text>

            <View style={styles.foodBottom}>
              <Text style={styles.price}>
                ₱99.00
              </Text>

              <View style={styles.rating}>
                <Ionicons
                  name="star"
                  size={14}
                  color="#F5A623"
                />

                <Text style={styles.ratingText}>
                  4.8
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="add"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={15}
            color="#999999"
          />

          <Text style={styles.footerText}>
            Safe & Convenient Campus Ordering
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },

  container: {
    paddingBottom: 35,
  },

  header: {
    backgroundColor: "#8F1029",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },

  smallTitle: {
    color: "#F6DDE2",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 2,
  },

  headerSubtitle: {
    color: "#F4C8D0",
    fontSize: 12,
    marginTop: 3,
  },

  headerIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  welcomeCard: {
    marginHorizontal: 18,
    marginTop: -16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  welcomeIcon: {
    width: 53,
    height: 53,
    borderRadius: 16,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#202124",
  },

  welcomeText: {
    fontSize: 12,
    color: "#777777",
    lineHeight: 18,
    marginTop: 4,
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 27,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#202124",
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: "#8A8A8A",
    marginTop: 3,
  },

  actionGrid: {
    paddingHorizontal: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48.2%",
    minHeight: 157,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },

  actionIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 11,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242424",
  },

  actionText: {
    fontSize: 11,
    color: "#888888",
    lineHeight: 16,
    marginTop: 4,
    paddingRight: 4,
  },

  arrowCircle: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C41E3A",
    justifyContent: "center",
    alignItems: "center",
  },

  statusCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242424",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#31A24C",
    marginRight: 6,
  },

  openText: {
    color: "#31A24C",
    fontSize: 12,
    fontWeight: "700",
  },

  schedule: {
    color: "#999999",
    fontSize: 10.5,
    marginTop: 3,
  },

  seeAll: {
    color: "#C41E3A",
    fontSize: 12,
    fontWeight: "700",
  },

  foodCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },

  foodImage: {
    width: 76,
    height: 76,
    borderRadius: 15,
    backgroundColor: "#FCECEF",
    justifyContent: "center",
    alignItems: "center",
  },

  foodInfo: {
    flex: 1,
    marginLeft: 13,
    paddingRight: 7,
  },

  foodName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#242424",
  },

  foodDescription: {
    fontSize: 10.5,
    color: "#888888",
    lineHeight: 15,
    marginTop: 3,
  },

  foodBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  price: {
    fontSize: 14,
    fontWeight: "800",
    color: "#C41E3A",
    marginRight: 12,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 11,
    color: "#777777",
    marginLeft: 4,
    fontWeight: "600",
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#C41E3A",
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  footerText: {
    fontSize: 10,
    color: "#999999",
    marginLeft: 5,
  },
});