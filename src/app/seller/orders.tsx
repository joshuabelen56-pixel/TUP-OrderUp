import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
  yellow: "#B7791F",
  red: "#C44747",
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
  yellow: "#D6A84F",
  red: "#E06767",
};

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Ready"
  | "Completed";

type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  time: string;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  {
    id: "#ORD-1048",
    customer: "Juan Dela Cruz",
    items: ["Chicken Meal", "Iced Tea"],
    total: 198,
    time: "10:42 AM",
    status: "Preparing",
  },
  {
    id: "#ORD-1047",
    customer: "Maria Santos",
    items: ["Burger", "Fries", "Coke"],
    total: 275,
    time: "10:35 AM",
    status: "Pending",
  },
  {
    id: "#ORD-1046",
    customer: "Kevin Reyes",
    items: ["Beef Pares"],
    total: 89,
    time: "10:21 AM",
    status: "Ready",
  },
  {
    id: "#ORD-1045",
    customer: "Angela Cruz",
    items: ["Spaghetti", "Iced Tea"],
    total: 150,
    time: "10:05 AM",
    status: "Completed",
  },
  {
    id: "#ORD-1044",
    customer: "Mark Garcia",
    items: ["Siomai Rice", "Bottled Water"],
    total: 125,
    time: "9:52 AM",
    status: "Pending",
  },
];

const filters = [
  "All",
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
] as const;

export default function SellerOrders() {
  const { darkMode } = useTheme();
  const C = darkMode ? DARK : LIGHT;

  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All");

  const [orders, setOrders] = useState<Order[]>(
    initialOrders
  );

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === activeFilter
    );
  }, [orders, activeFilter]);

  const updateOrderStatus = (
    id: string,
    nextStatus: OrderStatus
  ) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              status: nextStatus,
            }
          : order
      )
    );
  };

  const handleAction = (order: Order) => {
    if (order.status === "Pending") {
      updateOrderStatus(order.id, "Preparing");
      return;
    }

    if (order.status === "Preparing") {
      updateOrderStatus(order.id, "Ready");
      return;
    }

    if (order.status === "Ready") {
      updateOrderStatus(order.id, "Completed");
      return;
    }

    Alert.alert(
      "Order completed",
      `${order.id} has already been completed.`
    );
  };

  const actionText = (status: OrderStatus) => {
    if (status === "Pending") return "Accept Order";
    if (status === "Preparing") return "Mark Ready";
    if (status === "Ready") return "Complete Order";
    return "Completed";
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
            <Text style={styles.headerEyebrow}>
              SELLER CENTER
            </Text>

            <Text style={styles.headerTitle}>
              Orders
            </Text>

            <Text style={styles.headerSubtitle}>
              Manage incoming customer orders
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="receipt-outline"
              size={25}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.headerStats}>
          <HeaderStat
            label="Total"
            value={orders.length}
          />

          <HeaderStat
            label="Pending"
            value={
              orders.filter(
                (o) => o.status === "Pending"
              ).length
            }
          />

          <HeaderStat
            label="Preparing"
            value={
              orders.filter(
                (o) => o.status === "Preparing"
              ).length
            }
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* FILTERS */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {filters.map((filter) => {
              const selected =
                activeFilter === filter;

              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.85}
                  onPress={() =>
                    setActiveFilter(filter)
                  }
                  style={[
                    styles.filterChip,
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
                      styles.filterText,
                      {
                        color: selected
                          ? "#FFFFFF"
                          : C.muted,
                      },
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* TITLE */}
        <View style={styles.sectionHeader}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                { color: C.text },
              ]}
            >
              {activeFilter === "All"
                ? "All orders"
                : `${activeFilter} orders`}
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: C.muted },
              ]}
            >
              {filteredOrders.length} order
              {filteredOrders.length !== 1
                ? "s"
                : ""}{" "}
              found
            </Text>
          </View>

          <View
            style={[
              styles.liveBadge,
              {
                backgroundColor: darkMode
                  ? "#183021"
                  : "#EAF7EF",
              },
            ]}
          >
            <View
              style={[
                styles.liveDot,
                { backgroundColor: C.green },
              ]}
            />

            <Text
              style={[
                styles.liveText,
                { color: C.green },
              ]}
            >
              LIVE
            </Text>
          </View>
        </View>

        {/* ORDERS */}
        {filteredOrders.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: C.card,
                borderColor: C.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: darkMode
                    ? "#26151B"
                    : "#F8E9ED",
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={30}
                color={C.cardinal}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: C.text },
              ]}
            >
              No orders found
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: C.muted },
              ]}
            >
              There are no orders under this status
              right now.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              C={C}
              darkMode={darkMode}
              actionText={actionText(order.status)}
              onAction={() =>
                handleAction(order)
              }
            />
          ))
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <SellerNav
        active="orders"
        C={C}
        go={go}
      />
    </SafeAreaView>
  );
}

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.headerStat}>
      <Text style={styles.headerStatValue}>
        {value}
      </Text>

      <Text style={styles.headerStatLabel}>
        {label}
      </Text>
    </View>
  );
}

function OrderCard({
  order,
  C,
  darkMode,
  actionText,
  onAction,
}: any) {
  const statusColor =
    order.status === "Pending"
      ? C.yellow
      : order.status === "Preparing"
      ? C.cardinal
      : order.status === "Ready"
      ? C.green
      : C.muted;

  const statusBackground =
    order.status === "Pending"
      ? darkMode
        ? "#302611"
        : "#FFF5DC"
      : order.status === "Preparing"
      ? darkMode
        ? "#32121B"
        : "#F8E9ED"
      : order.status === "Ready"
      ? darkMode
        ? "#173021"
        : "#EAF7EF"
      : darkMode
      ? "#292B30"
      : "#F2F4F7";

  return (
    <View
      style={[
        styles.orderCard,
        {
          backgroundColor: C.card,
          borderColor: C.border,
        },
      ]}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderIdentity}>
          <View
            style={[
              styles.customerAvatar,
              {
                backgroundColor: darkMode
                  ? "#32121B"
                  : "#F8E9ED",
              },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                { color: C.cardinal },
              ]}
            >
              {order.customer.charAt(0)}
            </Text>
          </View>

          <View>
            <Text
              style={[
                styles.orderId,
                { color: C.text },
              ]}
            >
              {order.id}
            </Text>

            <Text
              style={[
                styles.customerName,
                { color: C.muted },
              ]}
            >
              {order.customer}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: statusColor },
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.itemsContainer,
          {
            borderColor: C.border,
          },
        ]}
      >
        {order.items.map(
          (item: string, index: number) => (
            <View
              key={`${item}-${index}`}
              style={styles.itemRow}
            >
              <View
                style={[
                  styles.itemBullet,
                  {
                    backgroundColor: C.cardinal,
                  },
                ]}
              />

              <Text
                style={[
                  styles.itemText,
                  { color: C.text },
                ]}
              >
                {item}
              </Text>
            </View>
          )
        )}
      </View>

      <View style={styles.orderInfo}>
        <View>
          <Text
            style={[
              styles.infoLabel,
              { color: C.muted },
            ]}
          >
            ORDER TIME
          </Text>

          <Text
            style={[
              styles.infoValue,
              { color: C.text },
            ]}
          >
            {order.time}
          </Text>
        </View>

        <View style={styles.totalContainer}>
          <Text
            style={[
              styles.infoLabel,
              { color: C.muted },
            ]}
          >
            TOTAL
          </Text>

          <Text
            style={[
              styles.totalValue,
              { color: C.text },
            ]}
          >
            ₱{order.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {order.status !== "Completed" && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAction}
          style={[
            styles.actionButton,
            {
              backgroundColor: C.cardinal,
            },
          ]}
        >
          <Text style={styles.actionText}>
            {actionText}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}
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
        icon="receipt"
        label="Orders"
        active={active === "orders"}
        C={C}
        onPress={() =>
          go("/seller/orders")
        }
      />

      <NavItem
        icon="restaurant-outline"
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

  headerEyebrow: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },

  headerSubtitle: {
    color: "#D8D8D8",
    fontSize: 11,
    marginTop: 3,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerStats: {
    flexDirection: "row",
    marginTop: 19,
  },

  headerStat: {
    flex: 1,
  },

  headerStatValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  headerStatLabel: {
    color: "#BFBFC4",
    fontSize: 10,
    marginTop: 2,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingTop: 17,
    paddingBottom: 105,
  },

  filterContainer: {
    marginBottom: 4,
  },

  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
  },

  filterText: {
    fontSize: 11,
    fontWeight: "800",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 19,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  liveText: {
    fontSize: 9,
    fontWeight: "900",
  },

  orderCard: {
    borderRadius: 19,
    borderWidth: 1,
    padding: 16,
    marginBottom: 11,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  customerAvatar: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "900",
  },

  orderId: {
    fontSize: 14,
    fontWeight: "900",
  },

  customerName: {
    fontSize: 10,
    marginTop: 3,
  },

  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "900",
  },

  itemsContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 11,
    marginTop: 14,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },

  itemBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },

  itemText: {
    fontSize: 12,
    fontWeight: "600",
  },

  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  infoLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  infoValue: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  totalContainer: {
    alignItems: "flex-end",
  },

  totalValue: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2,
  },

  actionButton: {
    marginTop: 14,
    height: 43,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    marginRight: 7,
  },

  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 35,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 14,
  },

  emptyText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 17,
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