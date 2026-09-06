import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#C41E3A";

const favoriteFoods = [
  {
    id: "1",
    name: "Chicken Meal",
    shop: "TUP Cafeteria",
    price: 65,
    icon: "🍗",
    available: true,
  },
  {
    id: "2",
    name: "Iced Coffee",
    shop: "Coffee Corner",
    price: 50,
    icon: "☕",
    available: true,
  },
  {
    id: "3",
    name: "Chocolate Cake",
    shop: "Sweet Corner",
    price: 60,
    icon: "🍰",
    available: false,
  },
];

const favoriteStores = [
  {
    id: "1",
    name: "TUP Cafeteria",
    location: "Main Campus",
    items: 24,
    open: true,
    icon: "🏪",
  },
  {
    id: "2",
    name: "Coffee Corner",
    location: "Building A",
    items: 15,
    open: true,
    icon: "☕",
  },
];

export default function Favorites() {
  const [activeTab, setActiveTab] =
    useState<"foods" | "stores">("foods");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Favorites
            </Text>

            <Text style={styles.subtitle}>
              Your saved foods and stores
            </Text>
          </View>

          <View style={styles.heartCircle}>
            <Ionicons
              name="heart"
              size={23}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* SWITCH */}

        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              activeTab === "foods" &&
                styles.switchActive,
            ]}
            onPress={() =>
              setActiveTab("foods")
            }
          >
            <Ionicons
              name="fast-food-outline"
              size={17}
              color={
                activeTab === "foods"
                  ? "#FFFFFF"
                  : "#777777"
              }
            />

            <Text
              style={[
                styles.switchText,
                activeTab === "foods" &&
                  styles.switchTextActive,
              ]}
            >
              Foods
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              activeTab === "stores" &&
                styles.switchActive,
            ]}
            onPress={() =>
              setActiveTab("stores")
            }
          >
            <Ionicons
              name="storefront-outline"
              size={17}
              color={
                activeTab === "stores"
                  ? "#FFFFFF"
                  : "#777777"
              }
            />

            <Text
              style={[
                styles.switchText,
                activeTab === "stores" &&
                  styles.switchTextActive,
              ]}
            >
              Stores
            </Text>
          </TouchableOpacity>
        </View>

        {/* ====================================== */}
        {/* FAVORITE FOODS */}
        {/* ====================================== */}

        {activeTab === "foods" && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Favorite Foods
              </Text>

              <Text style={styles.count}>
                {favoriteFoods.length} saved
              </Text>
            </View>

            {favoriteFoods.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={styles.foodCard}
                activeOpacity={0.85}
              >
                <View style={styles.foodIcon}>
                  <Text style={styles.emoji}>
                    {food.icon}
                  </Text>
                </View>

                <View style={styles.foodInfo}>
                  <View
                    style={styles.foodTitleRow}
                  >
                    <Text style={styles.foodName}>
                      {food.name}
                    </Text>

                    <TouchableOpacity>
                      <Ionicons
                        name="heart"
                        size={21}
                        color={PRIMARY}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.shop}>
                    🏪 {food.shop}
                  </Text>

                  <View
                    style={styles.bottomRow}
                  >
                    <Text style={styles.price}>
                      ₱{food.price}
                    </Text>

                    <View
                      style={
                        food.available
                          ? styles.available
                          : styles.unavailable
                      }
                    >
                      <Text
                        style={
                          food.available
                            ? styles.availableText
                            : styles.unavailableText
                        }
                      >
                        {food.available
                          ? "Available"
                          : "Unavailable"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ====================================== */}
        {/* FAVORITE STORES */}
        {/* ====================================== */}

        {activeTab === "stores" && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Favorite Stores
              </Text>

              <Text style={styles.count}>
                {favoriteStores.length} saved
              </Text>
            </View>

            {favoriteStores.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                activeOpacity={0.85}
              >
                <View style={styles.storeIcon}>
                  <Text style={styles.storeEmoji}>
                    {store.icon}
                  </Text>
                </View>

                <View style={styles.storeInfo}>
                  <View
                    style={styles.foodTitleRow}
                  >
                    <Text style={styles.storeName}>
                      {store.name}
                    </Text>

                    <Ionicons
                      name="heart"
                      size={21}
                      color={PRIMARY}
                    />
                  </View>

                  <Text style={styles.shop}>
                    📍 {store.location}
                  </Text>

                  <Text style={styles.itemCount}>
                    {store.items} food items
                  </Text>

                  <View
                    style={styles.storeBottom}
                  >
                    <View style={styles.openBadge}>
                      <View
                        style={styles.openDot}
                      />

                      <Text style={styles.openText}>
                        {store.open
                          ? "Open now"
                          : "Closed"}
                      </Text>
                    </View>

                    <Text
                      style={styles.viewText}
                    >
                      View Store →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* INFO */}

        <View style={styles.infoBox}>
          <Ionicons
            name="heart-outline"
            size={20}
            color={PRIMARY}
          />

          <Text style={styles.infoText}>
            Save your favorite foods and stores
            for faster ordering.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    marginTop: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#222222",
  },

  subtitle: {
    fontSize: 13,
    color: "#777777",
    marginTop: 4,
  },

  heartCircle: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFF0F2",
    alignItems: "center",
    justifyContent: "center",
  },

  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#EEEEEE",
    borderRadius: 13,
    padding: 4,
    marginBottom: 22,
  },

  switchButton: {
    flex: 1,
    height: 43,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  switchActive: {
    backgroundColor: PRIMARY,
  },

  switchText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777777",
  },

  switchTextActive: {
    color: "#FFFFFF",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
  },

  count: {
    fontSize: 11,
    color: "#999999",
    fontWeight: "600",
  },

  foodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 13,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  foodIcon: {
    width: 85,
    height: 85,
    borderRadius: 14,
    backgroundColor: "#FFF3F4",
    alignItems: "center",
    justifyContent: "center",
  },

  emoji: {
    fontSize: 40,
  },

  foodInfo: {
    flex: 1,
    marginLeft: 13,
  },

  foodTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  foodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#222222",
  },

  shop: {
    fontSize: 11,
    color: "#777777",
    marginTop: 5,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
  },

  price: {
    fontSize: 17,
    fontWeight: "900",
    color: PRIMARY,
  },

  available: {
    backgroundColor: "#EAF8EE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  availableText: {
    fontSize: 9,
    color: "#218838",
    fontWeight: "700",
  },

  unavailable: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  unavailableText: {
    fontSize: 9,
    color: "#888888",
    fontWeight: "700",
  },

  storeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  storeIcon: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: "#FFF3F4",
    alignItems: "center",
    justifyContent: "center",
  },

  storeEmoji: {
    fontSize: 32,
  },

  storeInfo: {
    flex: 1,
    marginLeft: 13,
  },

  storeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#222222",
  },

  itemCount: {
    fontSize: 10,
    color: "#999999",
    marginTop: 4,
  },

  storeBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  openBadge: {
    flexDirection: "row",
    alignItems: "center",
  },

  openDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#28A745",
    marginRight: 5,
  },

  openText: {
    fontSize: 10,
    color: "#218838",
    fontWeight: "700",
  },

  viewText: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: "800",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F4",
    borderRadius: 13,
    padding: 14,
    marginTop: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 11,
    color: "#777777",
    marginLeft: 10,
    lineHeight: 17,
  },
});

