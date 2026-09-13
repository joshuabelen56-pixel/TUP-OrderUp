import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const LIGHT = {
  background: "#F4F5F7",
  card: "#FFFFFF",
  text: "#101828",
  muted: "#667085",
  border: "#E7E8EB",
  cardinal: "#8F1029",
  cardinalDeep: "#5B0918",
  gold: "#D8B56A",
  green: "#2E8B57",
};

const DARK = {
  background: "#0F1012",
  card: "#191A1E",
  text: "#F5F5F5",
  muted: "#A6A8AD",
  border: "#2B2D33",
  cardinal: "#A6192E",
  cardinalDeep: "#520A18",
  gold: "#D8B56A",
  green: "#4CAF7A",
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

const initialItems: MenuItem[] = [
  {
    id: "1",
    name: "Chicken Meal",
    description: "Crispy chicken with rice",
    category: "Meals",
    price: 99,
    available: true,
    icon: "fast-food-outline",
  },
  {
    id: "2",
    name: "Beef Pares",
    description: "Sweet savory beef with rice",
    category: "Meals",
    price: 89,
    available: true,
    icon: "restaurant-outline",
  },
  {
    id: "3",
    name: "Campus Burger",
    description: "Classic beef burger",
    category: "Snacks",
    price: 75,
    available: true,
    icon: "fast-food-outline",
  },
  {
    id: "4",
    name: "French Fries",
    description: "Crispy golden fries",
    category: "Snacks",
    price: 55,
    available: false,
    icon: "restaurant-outline",
  },
  {
    id: "5",
    name: "Iced Tea",
    description: "Refreshing house iced tea",
    category: "Drinks",
    price: 35,
    available: true,
    icon: "water-outline",
  },
  {
    id: "6",
    name: "Bottled Water",
    description: "500ml bottled water",
    category: "Drinks",
    price: 25,
    available: true,
    icon: "water-outline",
  },
];

const categories = [
  "All",
  "Meals",
  "Snacks",
  "Drinks",
];

export default function SellerMenu() {
  const { darkMode } = useTheme();
  const C = darkMode ? DARK : LIGHT;

  const [items, setItems] =
    useState<MenuItem[]>(initialItems);

  const [category, setCategory] =
    useState("All");

  const toggleAvailability = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              available: !item.available,
            }
          : item
      )
    );
  };

  const filteredItems =
    category === "All"
      ? items
      : items.filter(
          (item) => item.category === category
        );

  const addItem = () => {
    Alert.alert(
      "Add Menu Item",
      "The add-product form can be connected to your backend next."
    );
  };

  const go = (
    path:
      | "/seller/dashboard"
      | "/seller/orders"
      | "/seller/menu"
      | "/seller/settings"
  ) => {
    router.replace(path);
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: C.background,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.cardinalDeep}
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: C.cardinalDeep,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>
              SELLER CENTER
            </Text>

            <Text style={styles.title}>
              Menu
            </Text>

            <Text style={styles.subtitle}>
              Manage your food and product listings
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={addItem}
          >
            <Ionicons
              name="add"
              size={22}
              color={C.cardinalDeep}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <MenuSummary
            value={items.length}
            label="Products"
          />

          <MenuSummary
            value={
              items.filter(
                (item) => item.available
              ).length
            }
            label="Available"
          />

          <MenuSummary
            value={
              items.filter(
                (item) => !item.available
              ).length
            }
            label="Unavailable"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* CATEGORY */}
        <Text
          style={[
            styles.categoryTitle,
            { color: C.text },
          ]}
        >
          Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((item) => {
            const selected = category === item;

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.85}
                onPress={() => setCategory(item)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selected
                      ? C.cardinal
                      : C.card,
                    borderColor: selected
                      ? C.cardinal
                      : C.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selected
                        ? "#FFFFFF"
                        : C.muted,
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PRODUCT LIST */}
        <View style={styles.listHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: C.text },
              ]}
            >
              {category === "All"
                ? "All products"
                : category}
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: C.muted },
              ]}
            >
              {filteredItems.length} item
              {filteredItems.length !== 1
                ? "s"
                : ""}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={addItem}
            style={[
              styles.smallAdd,
              {
                backgroundColor: darkMode
                  ? "#32121B"
                  : "#F8E9ED",
              },
            ]}
          >
            <Ionicons
              name="add"
              size={16}
              color={C.cardinal}
            />

            <Text
              style={[
                styles.smallAddText,
                { color: C.cardinal },
              ]}
            >
              Add item
            </Text>
          </TouchableOpacity>
        </View>

        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            C={C}
            darkMode={darkMode}
            onToggle={() =>
              toggleAvailability(item.id)
            }
          />
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <SellerNav
        active="menu"
        C={C}
        go={go}
      />
    </SafeAreaView>
  );
}

function MenuSummary({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  );
}

function MenuCard({
  item,
  C,
  darkMode,
  onToggle,
}: {
  item: MenuItem;
  C: any;
  darkMode: boolean;
  onToggle: () => void;
}) {
  return (
    <View
      style={[
        styles.menuCard,
        {
          backgroundColor: C.card,
          borderColor: C.border,
          opacity: item.available ? 1 : 0.72,
        },
      ]}
    >
      <View
        style={[
          styles.productIcon,
          {
            backgroundColor: darkMode
              ? "#32121B"
              : "#F8E9ED",
          },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={27}
          color={C.cardinal}
        />
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productTitleRow}>
          <Text
            style={[
              styles.productName,
              { color: C.text },
            ]}
          >
            {item.name}
          </Text>

          <Text
            style={[
              styles.productPrice,
              { color: C.cardinal },
            ]}
          >
            ₱{item.price.toFixed(2)}
          </Text>
        </View>

        <Text
          style={[
            styles.productDescription,
            { color: C.muted },
          ]}
        >
          {item.description}
        </Text>

        <View style={styles.productBottom}>
          <View
            style={[
              styles.availabilityBadge,
              {
                backgroundColor: item.available
                  ? darkMode
                    ? "#173021"
                    : "#EAF7EF"
                  : darkMode
                  ? "#292B30"
                  : "#F2F4F7",
              },
            ]}
          >
            <View
              style={[
                styles.availabilityDot,
                {
                  backgroundColor: item.available
                    ? C.green
                    : C.muted,
                },
              ]}
            />

            <Text
              style={[
                styles.availabilityText,
                {
                  color: item.available
                    ? C.green
                    : C.muted,
                },
              ]}
            >
              {item.available
                ? "Available"
                : "Unavailable"}
            </Text>
          </View>

          <Switch
            value={item.available}
            onValueChange={onToggle}
            trackColor={{
              false: darkMode
                ? "#34363B"
                : "#D0D5DD",
              true: C.cardinal,
            }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D0D5DD"
          />
        </View>
      </View>
    </View>
  );
}

function SellerNav({ active, C, go }: any) {
  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: C.card,
          borderTopColor: C.border,
        },
      ]}
    >
      <NavItem
        icon="home-outline"
        label="Home"
        active={active === "home"}
        C={C}
        onPress={() =>
          go("/seller/dashboard")
        }
      />

      <NavItem
        icon="receipt-outline"
        label="Orders"
        active={active === "orders"}
        C={C}
        onPress={() =>
          go("/seller/orders")
        }
      />

      <NavItem
        icon="restaurant"
        label="Menu"
        active={active === "menu"}
        C={C}
        onPress={() =>
          go("/seller/menu")
        }
      />

      <NavItem
        icon="settings-outline"
        label="Settings"
        active={active === "settings"}
        C={C}
        onPress={() =>
          go("/seller/settings")
        }
      />
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  C,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.navItem}
    >
      <Ionicons
        name={icon}
        size={22}
        color={active ? C.cardinal : C.muted}
      />

      <Text
        style={[
          styles.navLabel,
          {
            color: active
              ? C.cardinal
              : C.muted,
            fontWeight: active ? "800" : "500",
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  eyebrow: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },

  subtitle: {
    color: "#D0D0D0",
    fontSize: 11,
    marginTop: 3,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  summaryItem: {
    flex: 1,
  },

  summaryValue: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  summaryLabel: {
    color: "#BEBEC3",
    fontSize: 9,
    marginTop: 2,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 105,
  },

  categoryTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },

  categoryScroll: {
    marginBottom: 5,
  },

  categoryChip: {
    borderWidth: 1,
    borderRadius: 19,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "800",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 23,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  smallAdd: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  smallAddText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },

  menuCard: {
    borderWidth: 1,
    borderRadius: 19,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
  },

  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
  },

  productTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  productName: {
    fontSize: 14,
    fontWeight: "900",
    flex: 1,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 7,
  },

  productDescription: {
    fontSize: 10,
    marginTop: 3,
  },

  productBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 9,
  },

  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  availabilityText: {
    fontSize: 9,
    fontWeight: "800",
  },

  bottomSpace: {
    height: 20,
  },

  nav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 5,
  },

  navItem: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },

  navLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});