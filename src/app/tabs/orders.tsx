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

const orders = [
  {
    id: "1024",
    date: "Today, 11:42 AM",
    store: "TUP Cafeteria",
    item: "Chicken Meal",
    quantity: 1,
    price: 65,
    status: "Preparing",
    queue: "12",
    time: "10–15 min",
  },
  {
    id: "1023",
    date: "Today, 9:15 AM",
    store: "Coffee Corner",
    item: "Iced Coffee",
    quantity: 1,
    price: 50,
    status: "Ready",
    queue: "08",
    time: "Ready for pickup",
  },
  {
    id: "1022",
    date: "Yesterday, 1:30 PM",
    store: "Campus Bites",
    item: "Burger",
    quantity: 2,
    price: 90,
    status: "Completed",
    queue: "21",
    time: "Completed",
  },
];

export default function Orders() {
  const [selectedFilter, setSelectedFilter] =
    useState("Current");

  const currentOrders = orders.filter(
    (order) =>
      order.status !== "Completed"
  );

  const completedOrders = orders.filter(
    (order) =>
      order.status === "Completed"
  );

  const displayedOrders =
    selectedFilter === "Current"
      ? currentOrders
      : completedOrders;

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
              My Orders
            </Text>

            <Text style={styles.subtitle}>
              Track and manage your orders
            </Text>
          </View>

          <View style={styles.receiptCircle}>
            <Ionicons
              name="receipt"
              size={23}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* FILTER */}

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === "Current" &&
                styles.filterTabActive,
            ]}
            onPress={() =>
              setSelectedFilter("Current")
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "Current" &&
                  styles.filterTextActive,
              ]}
            >
              Current Orders
            </Text>

            {currentOrders.length > 0 && (
              <View
                style={[
                  styles.badge,
                  selectedFilter ===
                    "Current" &&
                    styles.badgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    selectedFilter ===
                      "Current" &&
                      styles.badgeTextActive,
                  ]}
                >
                  {currentOrders.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === "History" &&
                styles.filterTabActive,
            ]}
            onPress={() =>
              setSelectedFilter("History")
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "History" &&
                  styles.filterTextActive,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* ORDERS */}

        {displayedOrders.map((order) => (
          <View
            key={order.id}
            style={styles.orderCard}
          >
            {/* ORDER HEADER */}

            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>
                  ORDER #{order.id}
                </Text>

                <Text style={styles.orderDate}>
                  {order.date}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  order.status === "Preparing" &&
                    styles.preparingBadge,
                  order.status === "Ready" &&
                    styles.readyBadge,
                  order.status === "Completed" &&
                    styles.completedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    order.status === "Preparing" &&
                      styles.preparingText,
                    order.status === "Ready" &&
                      styles.readyText,
                    order.status === "Completed" &&
                      styles.completedText,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            {/* STORE */}

            <View style={styles.storeRow}>
              <Ionicons
                name="storefront-outline"
                size={16}
                color="#777777"
              />

              <Text style={styles.storeText}>
                {order.store}
              </Text>
            </View>

            {/* ITEM */}

            <View style={styles.itemRow}>
              <View style={styles.foodIcon}>
                <Text style={styles.foodEmoji}>
                  {order.item ===
                  "Chicken Meal"
                    ? "🍗"
                    : order.item ===
                      "Iced Coffee"
                    ? "☕"
                    : "🍔"}
                </Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {order.item}
                </Text>

                <Text style={styles.quantity}>
                  Quantity: {order.quantity}
                </Text>
              </View>

              <Text style={styles.price}>
                ₱{order.price}
              </Text>
            </View>

            {/* ====================================== */}
            {/* STATUS TIMELINE */}
            {/* ====================================== */}

            <View style={styles.timeline}>
              {/* PLACED */}

              <View style={styles.timelineItem}>
                <View
                  style={styles.timelineLeft}
                >
                  <View
                    style={[
                      styles.timelineDot,
                      styles.timelineDone,
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={11}
                      color="#FFFFFF"
                    />
                  </View>

                  <View
                    style={[
                      styles.timelineLine,
                      styles.lineDone,
                    ]}
                  />
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={styles.timelineTitle}
                  >
                    Order Placed
                  </Text>

                  <Text
                    style={styles.timelineSub}
                  >
                    Your order has been received
                  </Text>
                </View>
              </View>

              {/* PREPARING */}

              <View style={styles.timelineItem}>
                <View
                  style={styles.timelineLeft}
                >
                  <View
                    style={[
                      styles.timelineDot,
                      order.status ===
                        "Preparing"
                        ? styles.timelineCurrent
                        : styles.timelineDone,
                    ]}
                  >
                    {order.status !==
                      "Preparing" && (
                      <Ionicons
                        name="checkmark"
                        size={11}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  {order.status !==
                    "Completed" && (
                    <View
                      style={[
                        styles.timelineLine,
                        order.status ===
                          "Preparing"
                          ? styles.lineCurrent
                          : styles.lineDone,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      order.status ===
                        "Preparing" &&
                        styles.currentTitle,
                    ]}
                  >
                    Preparing
                  </Text>

                  <Text
                    style={styles.timelineSub}
                  >
                    {order.status ===
                    "Preparing"
                      ? `Estimated time: ${order.time}`
                      : "Food is being prepared"}
                  </Text>
                </View>
              </View>

              {/* READY */}

              <View style={styles.timelineItem}>
                <View
                  style={styles.timelineLeft}
                >
                  <View
                    style={[
                      styles.timelineDot,
                      order.status === "Ready" ||
                        order.status ===
                          "Completed"
                        ? styles.timelineDone
                        : styles.timelinePending,
                    ]}
                  >
                    {(order.status ===
                      "Ready" ||
                      order.status ===
                        "Completed") && (
                      <Ionicons
                        name="checkmark"
                        size={11}
                        color="#FFFFFF"
                      />
                    )}
                  </View>

                  {order.status !==
                    "Completed" && (
                    <View
                      style={[
                        styles.timelineLine,
                        styles.linePending,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      order.status ===
                        "Ready" &&
                        styles.currentTitle,
                    ]}
                  >
                    Ready for Pickup
                  </Text>

                  <Text
                    style={styles.timelineSub}
                  >
                    {order.status === "Ready"
                      ? "Your order is ready!"
                      : "Waiting for preparation"}
                  </Text>
                </View>
              </View>

              {/* COMPLETED */}

              <View style={styles.timelineItem}>
                <View
                  style={styles.timelineLeft}
                >
                  <View
                    style={[
                      styles.timelineDot,
                      order.status ===
                        "Completed"
                        ? styles.timelineDone
                        : styles.timelinePending,
                    ]}
                  >
                    {order.status ===
                      "Completed" && (
                      <Ionicons
                        name="checkmark"
                        size={11}
                        color="#FFFFFF"
                      />
                    )}
                  </View>
                </View>

                <View style={styles.timelineContent}>
                  <Text
                    style={styles.timelineTitle}
                  >
                    Completed
                  </Text>

                  <Text
                    style={styles.timelineSub}
                  >
                    {order.status ===
                    "Completed"
                      ? "Order completed successfully"
                      : "Not completed yet"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ACTION */}

            {order.status === "Preparing" && (
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={17}
                  color="#777777"
                />

                <Text
                  style={styles.cancelText}
                >
                  Cancel Order
                </Text>
              </TouchableOpacity>
            )}

            {order.status === "Ready" && (
              <View style={styles.pickupBox}>
                <Ionicons
                  name="flame"
                  size={19}
                  color={PRIMARY}
                />

                <View style={styles.pickupInfo}>
                  <Text
                    style={styles.pickupTitle}
                  >
                    Ready for Pickup
                  </Text>

                  <Text
                    style={styles.pickupText}
                  >
                    Queue Number:{" "}
                    <Text
                      style={styles.queueNumber}
                    >
                      {order.queue}
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}

        {/* EMPTY */}

        {displayedOrders.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="receipt-outline"
              size={50}
              color="#CCCCCC"
            />

            <Text style={styles.emptyTitle}>
              No orders yet
            </Text>

            <Text style={styles.emptyText}>
              Your orders will appear here.
            </Text>
          </View>
        )}

        {/* DEMO NOTE */}

        <View style={styles.demoBox}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={PRIMARY}
          />

          <Text style={styles.demoText}>
            Order tracking is currently using
            sample data for demonstration.
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
    paddingBottom: 35,
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

  receiptCircle: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FFF0F2",
    alignItems: "center",
    justifyContent: "center",
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#EEEEEE",
    borderRadius: 13,
    padding: 4,
    marginBottom: 18,
  },

  filterTab: {
    flex: 1,
    height: 43,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  filterTabActive: {
    backgroundColor: PRIMARY,
  },

  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777777",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  badgeActive: {
    backgroundColor: "#FFFFFF",
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#777777",
  },

  badgeTextActive: {
    color: PRIMARY,
  },

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  orderNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: "#222222",
  },

  orderDate: {
    fontSize: 10,
    color: "#999999",
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },

  preparingBadge: {
    backgroundColor: "#FFF4DD",
  },

  readyBadge: {
    backgroundColor: "#FFF0F2",
  },

  completedBadge: {
    backgroundColor: "#EAF8EE",
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  preparingText: {
    color: "#C17A00",
  },

  readyText: {
    color: PRIMARY,
  },

  completedText: {
    color: "#218838",
  },

  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  storeText: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "600",
    marginLeft: 6,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  foodIcon: {
    width: 55,
    height: 55,
    borderRadius: 13,
    backgroundColor: "#FFF3F4",
    alignItems: "center",
    justifyContent: "center",
  },

  foodEmoji: {
    fontSize: 27,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 11,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#222222",
  },

  quantity: {
    fontSize: 10,
    color: "#999999",
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "900",
    color: PRIMARY,
  },

  /* =============================================== */
  /* TIMELINE */
  /* =============================================== */

  timeline: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  timelineItem: {
    flexDirection: "row",
    minHeight: 55,
  },

  timelineLeft: {
    width: 30,
    alignItems: "center",
  },

  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  timelineDone: {
    backgroundColor: PRIMARY,
  },

  timelineCurrent: {
    backgroundColor: PRIMARY,
  },

  timelinePending: {
    backgroundColor: "#E3E3E3",
    borderWidth: 2,
    borderColor: "#D5D5D5",
  },

  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -1,
  },

  lineDone: {
    backgroundColor: PRIMARY,
  },

  lineCurrent: {
    backgroundColor: "#E3E3E3",
  },

  linePending: {
    backgroundColor: "#E3E3E3",
  },

  timelineContent: {
    flex: 1,
    marginLeft: 8,
    paddingBottom: 10,
  },

  timelineTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777777",
  },

  currentTitle: {
    color: PRIMARY,
  },

  timelineSub: {
    fontSize: 10,
    color: "#999999",
    marginTop: 3,
    lineHeight: 14,
  },

  /* =============================================== */
  /* ACTION */
  /* =============================================== */

  cancelButton: {
    height: 42,
    borderRadius: 11,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  cancelText: {
    fontSize: 11,
    color: "#777777",
    fontWeight: "700",
    marginLeft: 6,
  },

  pickupBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F4",
    borderRadius: 12,
    padding: 12,
    marginTop: 7,
  },

  pickupInfo: {
    marginLeft: 9,
  },

  pickupTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: PRIMARY,
  },

  pickupText: {
    fontSize: 10,
    color: "#777777",
    marginTop: 2,
  },

  queueNumber: {
    fontWeight: "900",
    color: PRIMARY,
  },

  /* =============================================== */
  /* EMPTY */
  /* =============================================== */

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

  /* =============================================== */
  /* DEMO */
  /* =============================================== */

  demoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F4",
    borderRadius: 13,
    padding: 13,
    marginTop: 5,
  },

  demoText: {
    flex: 1,
    fontSize: 10,
    color: "#777777",
    lineHeight: 15,
    marginLeft: 8,
  },
});
