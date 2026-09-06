import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#C41E3A";

const categories = [
  "All",
  "Rice Meals",
  "Snacks",
  "Drinks",
  "Desserts",
];

const foods = [
  {
    id: "1",
    name: "Chicken Meal",
    category: "Rice Meals",
    price: 65,
    shop: "TUP Cafeteria",
    icon: "🍗",
    available: true,
  },
  {
    id: "2",
    name: "Porksilog",
    category: "Rice Meals",
    price: 70,
    shop: "TUP Cafeteria",
    icon: "🍳",
    available: true,
  },
  {
    id: "3",
    name: "Burger",
    category: "Snacks",
    price: 45,
    shop: "Campus Bites",
    icon: "🍔",
    available: true,
  },
  {
    id: "4",
    name: "French Fries",
    category: "Snacks",
    price: 35,
    shop: "Campus Bites",
    icon: "🍟",
    available: true,
  },
  {
    id: "5",
    name: "Iced Coffee",
    category: "Drinks",
    price: 50,
    shop: "Coffee Corner",
    icon: "☕",
    available: true,
  },
  {
    id: "6",
    name: "Milk Tea",
    category: "Drinks",
    price: 55,
    shop: "Tea Station",
    icon: "🧋",
    available: false,
  },
  {
    id: "7",
    name: "Chocolate Cake",
    category: "Desserts",
    price: 60,
    shop: "Sweet Corner",
    icon: "🍰",
    available: true,
  },
  {
    id: "8",
    name: "Ice Cream",
    category: "Desserts",
    price: 40,
    shop: "Sweet Corner",
    icon: "🍦",
    available: true,
  },
];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const filteredFoods = foods.filter((food) => {
    const categoryMatch =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const searchMatch =
      food.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      food.shop
        .toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

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
              Menu
            </Text>

            <Text style={styles.subtitle}>
              Explore food around campus
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="restaurant"
              size={22}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#888888"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search food or store..."
            placeholderTextColor="#999999"
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#999999"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORIES */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  active &&
                    styles.categoryButtonActive,
                ]}
                onPress={() =>
                  setSelectedCategory(category)
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    active &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FILTER / SORT */}

        <View style={styles.filterRow}>
          <Text style={styles.resultText}>
            {filteredFoods.length} items
          </Text>

          <TouchableOpacity style={styles.filterButton}>
            <Ionicons
              name="options-outline"
              size={17}
              color="#555555"
            />

            <Text style={styles.filterText}>
              Filter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Ionicons
              name="swap-vertical-outline"
              size={17}
              color="#555555"
            />

            <Text style={styles.filterText}>
              Sort
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOOD LIST */}

        {filteredFoods.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={styles.foodCard}
            activeOpacity={0.85}
          >
            {/* FOOD ICON */}

            <View style={styles.foodImage}>
              <Text style={styles.foodEmoji}>
                {food.icon}
              </Text>
            </View>

            {/* FOOD INFO */}

            <View style={styles.foodInfo}>
              <View style={styles.foodTitleRow}>
                <Text style={styles.foodName}>
                  {food.name}
                </Text>

                <TouchableOpacity>
                  <Ionicons
                    name="heart-outline"
                    size={21}
                    color="#888888"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.shopName}>
                🏪 {food.shop}
              </Text>

              <Text style={styles.categorySmall}>
                {food.category}
              </Text>

              <View style={styles.foodBottom}>
                <Text style={styles.price}>
                  ₱{food.price}
                </Text>

                {food.available ? (
                  <View style={styles.availableBadge}>
                    <View
                      style={styles.availableDot}
                    />

                    <Text
                      style={
                        styles.availableText
                      }
                    >
                      Available
                    </Text>
                  </View>
                ) : (
                  <View style={styles.unavailableBadge}>
                    <Text
                      style={
                        styles.unavailableText
                      }
                    >
                      Unavailable
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* EMPTY */}

        {filteredFoods.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={45}
              color="#CCCCCC"
            />

            <Text style={styles.emptyTitle}>
              No food found
            </Text>

            <Text style={styles.emptyText}>
              Try another food or category.
            </Text>
          </View>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
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

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFF0F2",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBox: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#222222",
  },

  categoryScroll: {
    marginTop: 18,
    marginBottom: 18,
  },

  categoryButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginRight: 8,
  },

  categoryButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666666",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  resultText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#555555",
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  filterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#555555",
    marginLeft: 5,
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

  foodImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#FFF3F4",
    alignItems: "center",
    justifyContent: "center",
  },

  foodEmoji: {
    fontSize: 43,
  },

  foodInfo: {
    flex: 1,
    marginLeft: 13,
  },

  foodTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  foodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#222222",
  },

  shopName: {
    fontSize: 11,
    color: "#777777",
    marginTop: 5,
  },

  categorySmall: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: "700",
    marginTop: 4,
  },

  foodBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  price: {
    fontSize: 17,
    fontWeight: "900",
    color: PRIMARY,
  },

  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF8EE",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#28A745",
    marginRight: 4,
  },

  availableText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#218838",
  },

  unavailableBadge: {
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },

  unavailableText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#888888",
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#555555",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 13,
    color: "#999999",
    marginTop: 5,
  },
});

