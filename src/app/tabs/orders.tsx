import React, {
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import {
  useTheme,
} from "../../context/ThemeContext";

/* =========================================================
   TUP-ORDERUP DESIGN SYSTEM
========================================================= */

const CARDINAL = "#7D1021";
const CARDINAL_DARK = "#5C0A17";
const CARDINAL_MID = "#8F1029";

const GOLD = "#D8B56A";
const GOLD_SOFT = "#F5E9CF";

const WHITE = "#FFFFFF";

const SUCCESS = "#2E8B57";
const WARNING = "#B77700";
const ERROR = "#C74A4A";
const INFO = "#3B6FA8";

/* =========================================================
   TYPES
========================================================= */

type OrderStatus =
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

type Order = {
  id: string;
  date: string;
  store: string;
  item: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  queue?: string;
  estimatedTime?: string;
  emoji: string;
  payment: string;
  orderType: string;
};

/* =========================================================
   SAMPLE ORDERS
========================================================= */

const initialOrders: Order[] = [
  {
    id: "1024",
    date: "Today, 11:42 AM",
    store: "TUP Cafeteria",
    item: "Chicken Meal",
    quantity: 1,
    price: 65,
    status: "Preparing",
    queue: "12",
    estimatedTime: "10–15 min",
    emoji: "🍗",
    payment: "Cash on Pickup",
    orderType: "Pickup",
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
    estimatedTime: "Ready for pickup",
    emoji: "☕",
    payment: "Cash on Pickup",
    orderType: "Pickup",
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
    estimatedTime: "Completed",
    emoji: "🍔",
    payment: "Cash on Pickup",
    orderType: "Pickup",
  },

  {
    id: "1021",
    date: "Yesterday, 10:08 AM",
    store: "Sweet Corner",
    item: "Chocolate Cake",
    quantity: 1,
    price: 60,
    status: "Completed",
    queue: "17",
    estimatedTime: "Completed",
    emoji: "🍰",
    payment: "Cash on Pickup",
    orderType: "Pickup",
  },
];

/* =========================================================
   ORDERS SCREEN
========================================================= */

export default function Orders() {
  /* =======================================================
     GLOBAL THEME
  ======================================================= */

  const {
    darkMode,
  } = useTheme();

  /* =======================================================
     THEME
  ======================================================= */

  const theme = {
    background: darkMode
      ? "#101010"
      : "#F4F5F7",

    card: darkMode
      ? "#1A1A1A"
      : "#FFFFFF",

    cardSoft: darkMode
      ? "#222222"
      : "#F6F7F8",

    text: darkMode
      ? "#FFFFFF"
      : "#1E2024",

    secondary: darkMode
      ? "#AFAFAF"
      : "#62666D",

    muted: darkMode
      ? "#777777"
      : "#969AA0",

    border: darkMode
      ? "#2B2B2B"
      : "#E5E7EA",

    divider: darkMode
      ? "#303030"
      : "#F0F1F2",

    filterBackground: darkMode
      ? "#242424"
      : "#E7E8EA",

    iconBackground: darkMode
      ? "#321D22"
      : "#FBECEF",

    modal: darkMode
      ? "#181818"
      : "#FFFFFF",

    modalSoft: darkMode
      ? "#232323"
      : "#F6F7F8",
  };

  /* =======================================================
     STATES
  ======================================================= */

  const [selectedFilter, setSelectedFilter] =
    useState<
      "Current" | "History"
    >("Current");

  const [orders, setOrders] =
    useState<Order[]>(
      initialOrders
    );

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(
      null
    );

  const [refreshing, setRefreshing] =
    useState(false);

  /* =======================================================
     CURRENT ORDERS
  ======================================================= */

  const currentOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status !== "Completed" &&
        order.status !== "Cancelled"
    );
  }, [orders]);

  /* =======================================================
     HISTORY
  ======================================================= */

  const historyOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status === "Completed" ||
        order.status === "Cancelled"
    );
  }, [orders]);

  /* =======================================================
     DISPLAYED ORDERS
  ======================================================= */

  const displayedOrders =
    selectedFilter === "Current"
      ? currentOrders
      : historyOrders;

  /* =======================================================
     TOTAL
  ======================================================= */

  const getTotal = (
    order: Order
  ) => {
    return order.price;
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  /* =======================================================
     CANCEL ORDER
  ======================================================= */

  const cancelOrder = (
    order: Order
  ) => {
    Alert.alert(
      "Cancel Order",
      `Are you sure you want to cancel Order #${order.id}?`,
      [
        {
          text: "Keep Order",
          style: "cancel",
        },

        {
          text: "Cancel Order",
          style: "destructive",

          onPress: () => {
            setOrders((current) =>
              current.map((item) =>
                item.id === order.id
                  ? {
                      ...item,
                      status:
                        "Cancelled",
                      estimatedTime:
                        "Order cancelled",
                    }
                  : item
              )
            );

            setSelectedOrder(null);

            Alert.alert(
              "Order Cancelled",
              `Order #${order.id} has been cancelled.`
            );
          },
        },
      ]
    );
  };

  /* =======================================================
     REORDER
  ======================================================= */

  const reorder = (
    order: Order
  ) => {
    Alert.alert(
      "Add to Cart",
      `${order.item} has been added to your cart.`,
      [
        {
          text: "Continue",
          style: "cancel",
        },

        {
          text: "View Cart",
          onPress: () =>
            router.push(
              "/cart" as any
            ),
        },
      ]
    );
  };

  /* =======================================================
     STATUS COLOR
  ======================================================= */

  const getStatusColor = (
    status: OrderStatus
  ) => {
    switch (status) {
      case "Preparing":
        return WARNING;

      case "Ready":
        return CARDINAL;

      case "Completed":
        return SUCCESS;

      case "Cancelled":
        return ERROR;

      default:
        return theme.secondary;
    }
  };

  /* =======================================================
     STATUS BACKGROUND
  ======================================================= */

  const getStatusBackground =
    (
      status: OrderStatus
    ) => {
      switch (status) {
        case "Preparing":
          return darkMode
            ? "#302712"
            : "#FFF5DF";

        case "Ready":
          return darkMode
            ? "#321D22"
            : "#FBECEF";

        case "Completed":
          return darkMode
            ? "#16281D"
            : "#EAF7EE";

        case "Cancelled":
          return darkMode
            ? "#2B1818"
            : "#FDEEEE";

        default:
          return darkMode
            ? "#292929"
            : "#F2F3F4";
      }
    };

  /* =======================================================
     TIMELINE
  ======================================================= */

  const isPlacedDone = true;

  const isPreparingDone =
    selectedOrder?.status ===
      "Ready" ||
    selectedOrder?.status ===
      "Completed";

  const isReadyDone =
    selectedOrder?.status ===
      "Ready" ||
    selectedOrder?.status ===
      "Completed";

  const isCompletedDone =
    selectedOrder?.status ===
    "Completed";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.background,
        },
      ]}
      edges={["top"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          CARDINAL_DARK
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor={
              CARDINAL
            }
            colors={[
              CARDINAL,
            ]}
          />
        }
        contentContainerStyle={
          styles.container
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={styles.header}
        >
          <View
            style={
              styles.headerAccent
            }
          />

          <View
            style={
              styles.headerTop
            }
          >
            <View
              style={
                styles.headerTitleArea
              }
            >
              <Text
                style={
                  styles.headerOverline
                }
              >
                TUP-ORDERUP
              </Text>

              <Text
                style={
                  styles.headerTitle
                }
              >
                My Orders
              </Text>

              <Text
                style={
                  styles.headerSubtitle
                }
              >
                Track your meals from order
                to pickup
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.cartButton
              }
              activeOpacity={0.82}
              onPress={() =>
                router.push(
                  "/cart" as any
                )
              }
            >
              <Ionicons
                name="bag-handle-outline"
                size={22}
                color={
                  WHITE
                }
              />
            </TouchableOpacity>
          </View>

          <View
            style={
              styles.headerDivider
            }
          />

          <View
            style={
              styles.summaryRow
            }
          >
            <View
              style={
                styles.summaryItem
              }
            >
              <Text
                style={
                  styles.summaryNumber
                }
              >
                {
                  currentOrders.length
                }
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                Active
              </Text>
            </View>

            <View
              style={
                styles.summarySeparator
              }
            />

            <View
              style={
                styles.summaryItem
              }
            >
              <Text
                style={
                  styles.summaryNumber
                }
              >
                {
                  historyOrders.length
                }
              </Text>

              <Text
                style={
                  styles.summaryLabel
                }
              >
                History
              </Text>
            </View>

            <View
              style={
                styles.summarySeparator
              }
            />

            <View
              style={
                styles.summaryItem
              }
            >
              <Ionicons
                name="time-outline"
                size={17}
                color={GOLD}
              />

              <Text
                style={
                  styles.summaryLabel
                }
              >
                Pickup
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            FILTER TABS
        ================================================= */}

        <View
          style={[
            styles.filterContainer,
            {
              backgroundColor:
                theme.filterBackground,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter ===
                "Current" &&
                styles.filterTabActive,
            ]}
            activeOpacity={0.82}
            onPress={() =>
              setSelectedFilter(
                "Current"
              )
            }
          >
            <Ionicons
              name="time-outline"
              size={16}
              color={
                selectedFilter ===
                "Current"
                  ? WHITE
                  : theme.secondary
              }
            />

            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter ===
                    "Current"
                      ? WHITE
                      : theme.secondary,
                },
              ]}
            >
              Current Orders
            </Text>

            {currentOrders.length >
              0 && (
              <View
                style={[
                  styles.filterBadge,
                  selectedFilter ===
                    "Current" &&
                    styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    {
                      color:
                        selectedFilter ===
                        "Current"
                          ? CARDINAL
                          : theme.secondary,
                    },
                  ]}
                >
                  {
                    currentOrders.length
                  }
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter ===
                "History" &&
                styles.filterTabActive,
            ]}
            activeOpacity={0.82}
            onPress={() =>
              setSelectedFilter(
                "History"
              )
            }
          >
            <Ionicons
              name="receipt-outline"
              size={16}
              color={
                selectedFilter ===
                "History"
                  ? WHITE
                  : theme.secondary
              }
            />

            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter ===
                    "History"
                      ? WHITE
                      : theme.secondary,
                },
              ]}
            >
              Order History
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            SECTION
        ================================================= */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={
                styles.sectionLabel
              }
            >
              {selectedFilter ===
              "Current"
                ? "ACTIVE ORDERS"
                : "ORDER HISTORY"}
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              {selectedFilter ===
              "Current"
                ? "Orders in Progress"
                : "Previous Orders"}
            </Text>
          </View>
        </View>

        {/* =================================================
            ORDER LIST
        ================================================= */}

        {displayedOrders.map(
          (order) => (
            <TouchableOpacity
              key={order.id}
              style={[
                styles.orderCard,
                {
                  backgroundColor:
                    theme.card,

                  borderColor:
                    theme.border,
                },
              ]}
              activeOpacity={0.91}
              onPress={() =>
                setSelectedOrder(
                  order
                )
              }
            >
              {/* CARD HEADER */}

              <View
                style={
                  styles.orderCardHeader
                }
              >
                <View>
                  <View
                    style={
                      styles.orderNumberRow
                    }
                  >
                    <View
                      style={[
                        styles.orderIcon,
                        {
                          backgroundColor:
                            theme.iconBackground,
                        },
                      ]}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={15}
                        color={
                          CARDINAL
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.orderNumber,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      ORDER #{order.id}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.orderDate,
                      {
                        color:
                          theme.muted,
                      },
                    ]}
                  >
                    {order.date}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        getStatusBackground(
                          order.status
                        ),
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          getStatusColor(
                            order.status
                          ),
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          getStatusColor(
                            order.status
                          ),
                      },
                    ]}
                  >
                    {
                      order.status
                    }
                  </Text>
                </View>
              </View>

              {/* STORE */}

              <View
                style={[
                  styles.storeContainer,
                  {
                    borderTopColor:
                      theme.divider,
                  },
                ]}
              >
                <View
                  style={[
                    styles.storeIcon,
                    {
                      backgroundColor:
                        theme.iconBackground,
                    },
                  ]}
                >
                  <Ionicons
                    name="storefront-outline"
                    size={15}
                    color={
                      CARDINAL
                    }
                  />
                </View>

                <View
                  style={
                    styles.storeTextArea
                  }
                >
                  <Text
                    style={[
                      styles.storeName,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {order.store}
                  </Text>

                  <Text
                    style={[
                      styles.orderType,
                      {
                        color:
                          theme.muted,
                      },
                    ]}
                  >
                    {
                      order.orderType
                    }
                  </Text>
                </View>
              </View>

              {/* ITEM */}

              <View
                style={[
                  styles.itemContainer,
                  {
                    borderTopColor:
                      theme.divider,
                  },
                ]}
              >
                <View
                  style={[
                    styles.foodImage,
                    {
                      backgroundColor:
                        theme.iconBackground,
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.foodEmoji
                    }
                  >
                    {order.emoji}
                  </Text>
                </View>

                <View
                  style={
                    styles.itemInfo
                  }
                >
                  <Text
                    style={[
                      styles.itemName,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {order.item}
                  </Text>

                  <Text
                    style={[
                      styles.quantity,
                      {
                        color:
                          theme.muted,
                      },
                    ]}
                  >
                    Quantity ×{" "}
                    {
                      order.quantity
                    }
                  </Text>

                  <Text
                    style={[
                      styles.payment,
                      {
                        color:
                          theme.secondary,
                      },
                    ]}
                  >
                    {
                      order.payment
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.priceArea
                  }
                >
                  <Text
                    style={[
                      styles.priceLabel,
                      {
                        color:
                          theme.muted,
                      },
                    ]}
                  >
                    TOTAL
                  </Text>

                  <Text
                    style={
                      styles.price
                    }
                  >
                    ₱
                    {getTotal(
                      order
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* PREPARING */}

              {order.status ===
                "Preparing" && (
                <View
                  style={[
                    styles.progressBox,
                    {
                      backgroundColor:
                        darkMode
                          ? "#302712"
                          : "#FFF7E7",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.progressIcon,
                      {
                        backgroundColor:
                          darkMode
                            ? "#433719"
                            : WHITE,
                      },
                    ]}
                  >
                    <Ionicons
                      name="restaurant-outline"
                      size={18}
                      color={
                        CARDINAL
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.progressContent
                    }
                  >
                    <Text
                      style={[
                        styles.progressTitle,
                        {
                          color:
                            darkMode
                              ? "#E0B64E"
                              : "#8C6500",
                        },
                      ]}
                    >
                      Your food is being
                      prepared
                    </Text>

                    <Text
                      style={[
                        styles.progressSubtitle,
                        {
                          color:
                            darkMode
                              ? "#B69B51"
                              : "#A38B45",
                        },
                      ]}
                    >
                      Estimated pickup in{" "}
                      {
                        order.estimatedTime
                      }
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={
                      theme.muted
                    }
                  />
                </View>
              )}

              {/* READY */}

              {order.status ===
                "Ready" && (
                <View
                  style={[
                    styles.readyBox,
                    {
                      backgroundColor:
                        darkMode
                          ? "#321D22"
                          : "#FBECEF",
                    },
                  ]}
                >
                  <View
                    style={
                      styles.readyIcon
                    }
                  >
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={
                        WHITE
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.progressContent
                    }
                  >
                    <Text
                      style={
                        styles.readyTitle
                      }
                    >
                      Ready for Pickup
                    </Text>

                    <Text
                      style={[
                        styles.readySubtitle,
                        {
                          color:
                            darkMode
                              ? "#B8949C"
                              : "#8B6870",
                        },
                      ]}
                    >
                      Queue Number
                      <Text
                        style={
                          styles.queueNumber
                        }
                      >
                        {" "}
                        {
                          order.queue
                        }
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={
                      styles.pickupNowBadge
                    }
                  >
                    <Text
                      style={
                        styles.pickupNowText
                      }
                    >
                      PICK UP
                    </Text>
                  </View>
                </View>
              )}

              {/* COMPLETED */}

              {order.status ===
                "Completed" && (
                <View
                  style={[
                    styles.completedRow,
                    {
                      borderTopColor:
                        theme.divider,
                    },
                  ]}
                >
                  <View
                    style={
                      styles.completedInfo
                    }
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color={
                        SUCCESS
                      }
                    />

                    <Text
                      style={
                        styles.completedText
                      }
                    >
                      Order completed
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={
                      styles.reorderButton
                    }
                    activeOpacity={0.82}
                    onPress={() =>
                      reorder(
                        order
                      )
                    }
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={15}
                      color={
                        WHITE
                      }
                    />

                    <Text
                      style={
                        styles.reorderText
                      }
                    >
                      Reorder
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* CANCELLED */}

              {order.status ===
                "Cancelled" && (
                <View
                  style={[
                    styles.cancelledRow,
                    {
                      borderTopColor:
                        theme.divider,
                    },
                  ]}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={17}
                    color={
                      ERROR
                    }
                  />

                  <Text
                    style={
                      styles.cancelledText
                    }
                  >
                    This order was
                    cancelled
                  </Text>
                </View>
              )}

              {/* CARD FOOTER */}

              <View
                style={[
                  styles.cardFooter,
                  {
                    borderTopColor:
                      theme.divider,
                  },
                ]}
              >
                <Text
                  style={
                    styles.viewDetailsText
                  }
                >
                  View order details
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={
                    CARDINAL
                  }
                />
              </View>
            </TouchableOpacity>
          )
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {displayedOrders.length ===
          0 && (
          <View
            style={
              styles.emptyState
            }
          >
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    theme.iconBackground,
                },
              ]}
            >
              <Ionicons
                name={
                  selectedFilter ===
                  "Current"
                    ? "bag-outline"
                    : "receipt-outline"
                }
                size={34}
                color={
                  CARDINAL
                }
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              {selectedFilter ===
              "Current"
                ? "No active orders"
                : "No order history"}
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color:
                    theme.muted,
                },
              ]}
            >
              {selectedFilter ===
              "Current"
                ? "Your current orders will appear here once you place one."
                : "Completed and cancelled orders will appear here."}
            </Text>

            {selectedFilter ===
              "Current" && (
              <TouchableOpacity
                style={
                  styles.orderNowButton
                }
                activeOpacity={0.85}
                onPress={() =>
                  router.push(
                    "/order" as any
                  )
                }
              >
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={
                    WHITE
                  }
                />

                <Text
                  style={
                    styles.orderNowText
                  }
                >
                  Browse Menu
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <View
          style={
            styles.footer
          }
        >
          <View
            style={
              styles.footerLine
            }
          />

          <Text
            style={
              styles.footerBrand
            }
          >
            TUP-ORDERUP
          </Text>

          <Text
            style={[
              styles.footerText,
              {
                color:
                  theme.muted,
              },
            ]}
          >
            Track your orders
            with confidence.
          </Text>
        </View>
      </ScrollView>

      {/* =====================================================
          ORDER DETAILS MODAL
      ===================================================== */}

      <Modal
        visible={
          selectedOrder !== null
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSelectedOrder(
            null
          )
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor:
                  theme.modal,
              },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                {
                  backgroundColor:
                    darkMode
                      ? "#555555"
                      : "#D5D7DA",
                },
              ]}
            />

            <View
              style={
                styles.modalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.modalOverline
                  }
                >
                  ORDER DETAILS
                </Text>

                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  #
                  {
                    selectedOrder?.id
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.modalClose,
                  {
                    backgroundColor:
                      darkMode
                        ? "#292929"
                        : "#F2F3F4",
                  },
                ]}
                activeOpacity={
                  0.8
                }
                onPress={() =>
                  setSelectedOrder(
                    null
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={
                    theme.secondary
                  }
                />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <>
                {/* STATUS HERO */}

                <View
                  style={[
                    styles.modalStatusCard,
                    {
                      backgroundColor:
                        getStatusBackground(
                          selectedOrder.status
                        ),
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.modalStatusIcon,
                      {
                        backgroundColor:
                          getStatusColor(
                            selectedOrder.status
                          ),
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        selectedOrder.status ===
                        "Completed"
                          ? "checkmark"
                          : selectedOrder.status ===
                            "Cancelled"
                            ? "close"
                            : selectedOrder.status ===
                              "Ready"
                              ? "checkmark"
                              : "restaurant"
                      }
                      size={20}
                      color={
                        WHITE
                      }
                    />
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.modalStatusTitle,
                        {
                          color:
                            getStatusColor(
                              selectedOrder.status
                            ),
                        },
                      ]}
                    >
                      {
                        selectedOrder.status
                      }
                    </Text>

                    <Text
                      style={[
                        styles.modalStatusSubtitle,
                        {
                          color:
                            theme.secondary,
                        },
                      ]}
                    >
                      {selectedOrder.status ===
                      "Preparing"
                        ? "The kitchen is preparing your order."
                        : selectedOrder.status ===
                          "Ready"
                          ? "Your order is ready for pickup."
                          : selectedOrder.status ===
                            "Completed"
                            ? "This order has been completed."
                            : "This order has been cancelled."}
                    </Text>
                  </View>
                </View>

                {/* STORE */}

                <View
                  style={[
                    styles.detailRow,
                    {
                      borderBottomColor:
                        theme.divider,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.detailIcon,
                      {
                        backgroundColor:
                          theme.iconBackground,
                      },
                    ]}
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={17}
                      color={
                        CARDINAL
                      }
                    />
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color:
                            theme.muted,
                        },
                      ]}
                    >
                      STORE
                    </Text>

                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {
                        selectedOrder.store
                      }
                    </Text>
                  </View>
                </View>

                {/* ITEM */}

                <View
                  style={[
                    styles.detailRow,
                    {
                      borderBottomColor:
                        theme.divider,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.detailIcon,
                      {
                        backgroundColor:
                          theme.iconBackground,
                      },
                    ]}
                  >
                    <Ionicons
                      name="fast-food-outline"
                      size={17}
                      color={
                        CARDINAL
                      }
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color:
                            theme.muted,
                        },
                      ]}
                    >
                      ORDER ITEM
                    </Text>

                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {
                        selectedOrder.item
                      }
                    </Text>

                    <Text
                      style={[
                        styles.detailSmall,
                        {
                          color:
                            theme.muted,
                        },
                      ]}
                    >
                      Quantity ×{" "}
                      {
                        selectedOrder.quantity
                      }
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.detailPrice
                    }
                  >
                    ₱
                    {selectedOrder.price.toFixed(
                      2
                    )}
                  </Text>
                </View>

                {/* TIMELINE */}

                <View
                  style={
                    styles.timelineSection
                  }
                >
                  <Text
                    style={[
                      styles.timelineHeader,
                      {
                        color:
                          theme.muted,
                      },
                    ]}
                  >
                    ORDER PROGRESS
                  </Text>

                  {/* PLACED */}

                  <View
                    style={
                      styles.timelineItem
                    }
                  >
                    <View
                      style={
                        styles.timelineLeft
                      }
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          isPlacedDone &&
                            styles.timelineDone,
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color={
                            WHITE
                          }
                        />
                      </View>

                      <View
                        style={[
                          styles.timelineLine,
                          styles.timelineLineDone,
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.timelineContent
                      }
                    >
                      <Text
                        style={[
                          styles.timelineTitle,
                          {
                            color:
                              theme.secondary,
                          },
                        ]}
                      >
                        Order Placed
                      </Text>

                      <Text
                        style={[
                          styles.timelineSubtitle,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        Your order has
                        been received.
                      </Text>
                    </View>
                  </View>

                  {/* PREPARING */}

                  <View
                    style={
                      styles.timelineItem
                    }
                  >
                    <View
                      style={
                        styles.timelineLeft
                      }
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          isPreparingDone
                            ? styles.timelineDone
                            : selectedOrder.status ===
                                "Preparing"
                              ? styles.timelineCurrent
                              : styles.timelinePending,
                        ]}
                      >
                        {isPreparingDone && (
                          <Ionicons
                            name="checkmark"
                            size={10}
                            color={
                              WHITE
                            }
                          />
                        )}
                      </View>

                      <View
                        style={[
                          styles.timelineLine,
                          isPreparingDone
                            ? styles.timelineLineDone
                            : styles.timelineLinePending,
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.timelineContent
                      }
                    >
                      <Text
                        style={[
                          styles.timelineTitle,
                          {
                            color:
                              selectedOrder.status ===
                              "Preparing"
                                ? CARDINAL
                                : theme.secondary,
                          },
                        ]}
                      >
                        Preparing
                      </Text>

                      <Text
                        style={[
                          styles.timelineSubtitle,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        {selectedOrder.status ===
                        "Preparing"
                          ? `Estimated ${selectedOrder.estimatedTime}`
                          : "Food preparation completed."}
                      </Text>
                    </View>
                  </View>

                  {/* READY */}

                  <View
                    style={
                      styles.timelineItem
                    }
                  >
                    <View
                      style={
                        styles.timelineLeft
                      }
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          isReadyDone
                            ? styles.timelineDone
                            : styles.timelinePending,
                        ]}
                      >
                        {isReadyDone && (
                          <Ionicons
                            name="checkmark"
                            size={10}
                            color={
                              WHITE
                            }
                          />
                        )}
                      </View>

                      <View
                        style={[
                          styles.timelineLine,
                          isCompletedDone
                            ? styles.timelineLineDone
                            : styles.timelineLinePending,
                        ]}
                      />
                    </View>

                    <View
                      style={
                        styles.timelineContent
                      }
                    >
                      <Text
                        style={[
                          styles.timelineTitle,
                          {
                            color:
                              selectedOrder.status ===
                              "Ready"
                                ? CARDINAL
                                : theme.secondary,
                          },
                        ]}
                      >
                        Ready for Pickup
                      </Text>

                      <Text
                        style={[
                          styles.timelineSubtitle,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        {selectedOrder.status ===
                        "Ready"
                          ? `Queue number: ${selectedOrder.queue}`
                          : selectedOrder.status ===
                            "Completed"
                            ? "Pickup completed."
                            : "Waiting for preparation."}
                      </Text>
                    </View>
                  </View>

                  {/* COMPLETED */}

                  <View
                    style={
                      styles.timelineItem
                    }
                  >
                    <View
                      style={
                        styles.timelineLeft
                      }
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          isCompletedDone
                            ? styles.timelineDone
                            : styles.timelinePending,
                        ]}
                      >
                        {isCompletedDone && (
                          <Ionicons
                            name="checkmark"
                            size={10}
                            color={
                              WHITE
                            }
                          />
                        )}
                      </View>
                    </View>

                    <View
                      style={
                        styles.timelineContent
                      }
                    >
                      <Text
                        style={[
                          styles.timelineTitle,
                          {
                            color:
                              theme.secondary,
                          },
                        ]}
                      >
                        Completed
                      </Text>

                      <Text
                        style={[
                          styles.timelineSubtitle,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        {isCompletedDone
                          ? "Order completed successfully."
                          : "Waiting for pickup."}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* PAYMENT */}

                <View
                  style={[
                    styles.paymentCard,
                    {
                      backgroundColor:
                        theme.modalSoft,
                    },
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        styles.paymentLabel,
                        {
                          color:
                            theme.muted,
                        },
                      ]}
                    >
                      PAYMENT
                    </Text>

                    <Text
                      style={[
                        styles.paymentValue,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {
                        selectedOrder.payment
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.paymentTotal
                    }
                  >
                    <Text
                      style={[
                        styles.paymentLabel,
                        {
                          color:
                            theme.muted,
                        },
                      ]}
                    >
                      TOTAL
                    </Text>

                    <Text
                      style={
                        styles.paymentTotalValue
                      }
                    >
                      ₱
                      {selectedOrder.price.toFixed(
                        2
                      )}
                    </Text>
                  </View>
                </View>

                {/* CANCEL */}

                {selectedOrder.status ===
                  "Preparing" && (
                  <TouchableOpacity
                    style={
                      styles.modalCancelButton
                    }
                    activeOpacity={
                      0.85
                    }
                    onPress={() =>
                      cancelOrder(
                        selectedOrder
                      )
                    }
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={18}
                      color={
                        ERROR
                      }
                    />

                    <Text
                      style={
                        styles.modalCancelText
                      }
                    >
                      Cancel Order
                    </Text>
                  </TouchableOpacity>
                )}

                {/* REORDER */}

                {selectedOrder.status ===
                  "Completed" && (
                  <TouchableOpacity
                    style={
                      styles.modalReorderButton
                    }
                    activeOpacity={
                      0.85
                    }
                    onPress={() =>
                      reorder(
                        selectedOrder
                      )
                    }
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={18}
                      color={
                        WHITE
                      }
                    />

                    <Text
                      style={
                        styles.modalReorderText
                      }
                    >
                      Reorder This Item
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    /* =====================================================
       SAFE AREA
    ===================================================== */

    safeArea: {
      flex: 1,
    },

    container: {
      paddingBottom: 35,
    },

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      backgroundColor:
        CARDINAL_DARK,

      paddingHorizontal: 19,
      paddingTop: 16,
      paddingBottom: 20,

      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,

      overflow:
        "hidden",
    },

    headerAccent: {
      position:
        "absolute",

      width: 190,
      height: 190,

      borderRadius: 95,

      right: -75,
      top: -90,

      backgroundColor:
        "rgba(255,255,255,0.035)",
    },

    headerTop: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    headerTitleArea: {
      flex: 1,

      paddingRight:
        10,
    },

    headerOverline: {
      color:
        "#DAB8C0",

      fontSize:
        8.5,

      fontWeight:
        "900",

      letterSpacing:
        1.2,
    },

    headerTitle: {
      color:
        WHITE,

      fontSize:
        24,

      fontWeight:
        "900",

      marginTop:
        2,
    },

    headerSubtitle: {
      color:
        "#D6B9C0",

      fontSize:
        10.5,

      marginTop:
        3,
    },

    cartButton: {
      width:
        45,

      height:
        45,

      borderRadius:
        14,

      backgroundColor:
        "rgba(255,255,255,0.10)",

      justifyContent:
        "center",

      alignItems:
        "center",

      borderWidth:
        1,

      borderColor:
        "rgba(255,255,255,0.08)",
    },

    headerDivider: {
      height:
        1,

      backgroundColor:
        "rgba(255,255,255,0.11)",

      marginTop:
        17,

      marginBottom:
        13,
    },

    summaryRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    summaryItem: {
      flex: 1,

      alignItems:
        "center",

      justifyContent:
        "center",

      minHeight:
        31,
    },

    summaryNumber: {
      color:
        WHITE,

      fontSize:
        15,

      fontWeight:
        "900",
    },

    summaryLabel: {
      color:
        "#DABDC3",

      fontSize:
        8.5,

      fontWeight:
        "700",

      marginTop:
        2,
    },

    summarySeparator: {
      width:
        1,

      height:
        26,

      backgroundColor:
        "rgba(255,255,255,0.12)",
    },

    /* =====================================================
       FILTER
    ===================================================== */

    filterContainer: {
      marginHorizontal:
        18,

      marginTop:
        15,

      padding:
        4,

      borderRadius:
        14,

      flexDirection:
        "row",
    },

    filterTab: {
      flex: 1,

      height:
        43,

      borderRadius:
        11,

      flexDirection:
        "row",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    filterTabActive: {
      backgroundColor:
        CARDINAL,
    },

    filterText: {
      fontSize:
        10.5,

      fontWeight:
        "800",

      marginLeft:
        5,
    },

    filterBadge: {
      minWidth:
        19,

      height:
        19,

      borderRadius:
        10,

      backgroundColor:
        "#D8DADD",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginLeft:
        5,

      paddingHorizontal:
        4,
    },

    filterBadgeActive: {
      backgroundColor:
        WHITE,
    },

    filterBadgeText: {
      fontSize:
        8.5,

      fontWeight:
        "900",
    },

    /* =====================================================
       SECTION
    ===================================================== */

    sectionHeader: {
      marginHorizontal:
        20,

      marginTop:
        23,

      marginBottom:
        11,
    },

    sectionLabel: {
      color:
        CARDINAL,

      fontSize:
        7.8,

      fontWeight:
        "900",

      letterSpacing:
        1.2,
    },

    sectionTitle: {
      fontSize:
        17,

      fontWeight:
        "900",

      marginTop:
        3,
    },

    /* =====================================================
       ORDER CARD
    ===================================================== */

    orderCard: {
      marginHorizontal:
        18,

      marginBottom:
        13,

      padding:
        14,

      borderRadius:
        19,

      borderWidth:
        1,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity:
        0.035,

      shadowRadius:
        7,

      elevation:
        2,
    },

    orderCardHeader: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",
    },

    orderNumberRow: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    orderIcon: {
      width:
        27,

      height:
        27,

      borderRadius:
        9,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight:
        7,
    },

    orderNumber: {
      fontSize:
        12,

      fontWeight:
        "900",
    },

    orderDate: {
      fontSize:
        9,

      marginTop:
        4,

      marginLeft:
        34,
    },

    statusBadge: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        8,

      paddingVertical:
        6,

      borderRadius:
        9,
    },

    statusDot: {
      width:
        6,

      height:
        6,

      borderRadius:
        3,

      marginRight:
        4,
    },

    statusText: {
      fontSize:
        8.5,

      fontWeight:
        "900",
    },

    /* =====================================================
       STORE
    ===================================================== */

    storeContainer: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop:
        13,

      paddingTop:
        12,

      borderTopWidth:
        1,
    },

    storeIcon: {
      width:
        31,

      height:
        31,

      borderRadius:
        10,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    storeTextArea: {
      marginLeft:
        8,
    },

    storeName: {
      fontSize:
        11.5,

      fontWeight:
        "800",
    },

    orderType: {
      fontSize:
        8.5,

      marginTop:
        2,
    },

    /* =====================================================
       ITEM
    ===================================================== */

    itemContainer: {
      marginTop:
        11,

      paddingTop:
        11,

      borderTopWidth:
        1,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    foodImage: {
      width:
        64,

      height:
        64,

      borderRadius:
        15,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    foodEmoji: {
      fontSize:
        30,
    },

    itemInfo: {
      flex: 1,

      marginLeft:
        10,

      paddingRight:
        7,
    },

    itemName: {
      fontSize:
        13.5,

      fontWeight:
        "900",
    },

    quantity: {
      fontSize:
        9.5,

      marginTop:
        4,
    },

    payment: {
      fontSize:
        8.2,

      marginTop:
        3,
    },

    priceArea: {
      alignItems:
        "flex-end",
    },

    priceLabel: {
      fontSize:
        7,

      fontWeight:
        "900",

      letterSpacing:
        0.5,
    },

    price: {
      color:
        CARDINAL,

      fontSize:
        16,

      fontWeight:
        "900",

      marginTop:
        2,
    },

    /* =====================================================
       PREPARING
    ===================================================== */

    progressBox: {
      marginTop:
        12,

      borderRadius:
        13,

      padding:
        11,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    progressIcon: {
      width:
        34,

      height:
        34,

      borderRadius:
        11,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    progressContent: {
      flex: 1,

      marginLeft:
        9,
    },

    progressTitle: {
      fontSize:
        10.5,

      fontWeight:
        "900",
    },

    progressSubtitle: {
      fontSize:
        8.5,

      marginTop:
        3,
    },

    /* =====================================================
       READY
    ===================================================== */

    readyBox: {
      marginTop:
        12,

      borderRadius:
        13,

      padding:
        11,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    readyIcon: {
      width:
        34,

      height:
        34,

      borderRadius:
        11,

      backgroundColor:
        CARDINAL,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    readyTitle: {
      color:
        CARDINAL,

      fontSize:
        10.5,

      fontWeight:
        "900",
    },

    readySubtitle: {
      fontSize:
        8.5,

      marginTop:
        3,
    },

    queueNumber: {
      color:
        CARDINAL,

      fontWeight:
        "900",
    },

    pickupNowBadge: {
      backgroundColor:
        CARDINAL,

      paddingHorizontal:
        8,

      paddingVertical:
        6,

      borderRadius:
        8,
    },

    pickupNowText: {
      color:
        WHITE,

      fontSize:
        7.5,

      fontWeight:
        "900",

      letterSpacing:
        0.4,
    },

    /* =====================================================
       COMPLETED
    ===================================================== */

    completedRow: {
      marginTop:
        12,

      paddingTop:
        11,

      borderTopWidth:
        1,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    completedInfo: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    completedText: {
      color:
        SUCCESS,

      fontSize:
        9.5,

      fontWeight:
        "800",

      marginLeft:
        5,
    },

    reorderButton: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        CARDINAL,

      paddingHorizontal:
        10,

      paddingVertical:
        7,

      borderRadius:
        9,
    },

    reorderText: {
      color:
        WHITE,

      fontSize:
        8.5,

      fontWeight:
        "900",

      marginLeft:
        4,
    },

    /* =====================================================
       CANCELLED
    ===================================================== */

    cancelledRow: {
      marginTop:
        11,

      paddingTop:
        10,

      borderTopWidth:
        1,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    cancelledText: {
      color:
        ERROR,

      fontSize:
        9.5,

      fontWeight:
        "700",

      marginLeft:
        5,
    },

    /* =====================================================
       CARD FOOTER
    ===================================================== */

    cardFooter: {
      marginTop:
        12,

      paddingTop:
        10,

      borderTopWidth:
        1,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    viewDetailsText: {
      color:
        CARDINAL,

      fontSize:
        8.8,

      fontWeight:
        "800",
    },

    /* =====================================================
       EMPTY
    ===================================================== */

    emptyState: {
      alignItems:
        "center",

      paddingHorizontal:
        35,

      paddingVertical:
        62,
    },

    emptyIcon: {
      width:
        72,

      height:
        72,

      borderRadius:
        23,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    emptyTitle: {
      fontSize:
        17,

      fontWeight:
        "900",

      marginTop:
        14,
    },

    emptyDescription: {
      fontSize:
        10.5,

      lineHeight:
        17,

      textAlign:
        "center",

      marginTop:
        5,
    },

    orderNowButton: {
      marginTop:
        17,

      height:
        44,

      borderRadius:
        12,

      backgroundColor:
        CARDINAL,

      paddingHorizontal:
        17,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    orderNowText: {
      color:
        WHITE,

      fontSize:
        10.5,

      fontWeight:
        "900",

      marginLeft:
        6,
    },

    /* =====================================================
       FOOTER
    ===================================================== */

    footer: {
      alignItems:
        "center",

      marginTop:
        12,

      paddingHorizontal:
        20,
    },

    footerLine: {
      width:
        38,

      height:
        2,

      borderRadius:
        2,

      backgroundColor:
        GOLD,

      marginBottom:
        11,
    },

    footerBrand: {
      color:
        CARDINAL,

      fontSize:
        10,

      fontWeight:
        "900",

      letterSpacing:
        0.8,
    },

    footerText: {
      fontSize:
        8.5,

      marginTop:
        3,
    },

    /* =====================================================
       MODAL
    ===================================================== */

    modalOverlay: {
      flex: 1,

      justifyContent:
        "flex-end",

      backgroundColor:
        "rgba(15,17,20,0.50)",
    },

    modalCard: {
      borderTopLeftRadius:
        27,

      borderTopRightRadius:
        27,

      paddingHorizontal:
        20,

      paddingTop:
        9,

      paddingBottom:
        29,

      maxHeight:
        "91%",
    },

    modalHandle: {
      width:
        38,

      height:
        4,

      borderRadius:
        4,

      alignSelf:
        "center",

      marginBottom:
        10,
    },

    modalHeader: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",

      marginBottom:
        14,
    },

    modalOverline: {
      color:
        CARDINAL,

      fontSize:
        8,

      fontWeight:
        "900",

      letterSpacing:
        1.1,
    },

    modalTitle: {
      fontSize:
        22,

      fontWeight:
        "900",

      marginTop:
        2,
    },

    modalClose: {
      width:
        36,

      height:
        36,

      borderRadius:
        12,

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    /* =====================================================
       MODAL STATUS
    ===================================================== */

    modalStatusCard: {
      borderRadius:
        15,

      padding:
        12,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    modalStatusIcon: {
      width:
        39,

      height:
        39,

      borderRadius:
        12,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight:
        10,
    },

    modalStatusTitle: {
      fontSize:
        12,

      fontWeight:
        "900",
    },

    modalStatusSubtitle: {
      fontSize:
        9,

      lineHeight:
        14,

      marginTop:
        2,

      maxWidth:
        245,
    },

    /* =====================================================
       DETAIL
    ===================================================== */

    detailRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        12,

      borderBottomWidth:
        1,
    },

    detailIcon: {
      width:
        34,

      height:
        34,

      borderRadius:
        10,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight:
        10,
    },

    detailLabel: {
      fontSize:
        7.5,

      fontWeight:
        "900",

      letterSpacing:
        0.7,
    },

    detailValue: {
      fontSize:
        11,

      fontWeight:
        "800",

      marginTop:
        2,
    },

    detailSmall: {
      fontSize:
        8.5,

      marginTop:
        2,
    },

    detailPrice: {
      color:
        CARDINAL,

      fontSize:
        14,

      fontWeight:
        "900",
    },

    /* =====================================================
       TIMELINE
    ===================================================== */

    timelineSection: {
      marginTop:
        15,
    },

    timelineHeader: {
      fontSize:
        8,

      fontWeight:
        "900",

      letterSpacing:
        1,

      marginBottom:
        10,
    },

    timelineItem: {
      flexDirection:
        "row",

      minHeight:
        48,
    },

    timelineLeft: {
      width:
        27,

      alignItems:
        "center",
    },

    timelineDot: {
      width:
        21,

      height:
        21,

      borderRadius:
        11,

      justifyContent:
        "center",

      alignItems:
        "center",

      zIndex:
        2,
    },

    timelineDone: {
      backgroundColor:
        CARDINAL,
    },

    timelineCurrent: {
      backgroundColor:
        CARDINAL,

      borderWidth:
        4,

      borderColor:
        "#F1D9DE",
    },

    timelinePending: {
      backgroundColor:
        "#555555",
    },

    timelineLine: {
      width:
        2,

      flex: 1,

      marginTop:
        -1,
    },

    timelineLineDone: {
      backgroundColor:
        CARDINAL,
    },

    timelineLinePending: {
      backgroundColor:
        "#555555",
    },

    timelineContent: {
      flex: 1,

      marginLeft:
        8,

      paddingBottom:
        8,
    },

    timelineTitle: {
      fontSize:
        10.5,

      fontWeight:
        "800",
    },

    timelineSubtitle: {
      fontSize:
        8.5,

      lineHeight:
        13,

      marginTop:
        2,
    },

    /* =====================================================
       PAYMENT
    ===================================================== */

    paymentCard: {
      marginTop:
        9,

      padding:
        12,

      borderRadius:
        13,

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",
    },

    paymentLabel: {
      fontSize:
        7.5,

      fontWeight:
        "900",

      letterSpacing:
        0.7,
    },

    paymentValue: {
      fontSize:
        10,

      fontWeight:
        "800",

      marginTop:
        2,
    },

    paymentTotal: {
      alignItems:
        "flex-end",
    },

    paymentTotalValue: {
      color:
        CARDINAL,

      fontSize:
        15,

      fontWeight:
        "900",

      marginTop:
        2,
    },

    /* =====================================================
       MODAL ACTIONS
    ===================================================== */

    modalCancelButton: {
      height:
        47,

      borderRadius:
        13,

      backgroundColor:
        "#FDEEEE",

      marginTop:
        13,

      flexDirection:
        "row",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    modalCancelText: {
      color:
        ERROR,

      fontSize:
        11,

      fontWeight:
        "900",

      marginLeft:
        6,
    },

    modalReorderButton: {
      height:
        47,

      borderRadius:
        13,

      backgroundColor:
        CARDINAL,

      marginTop:
        13,

      flexDirection:
        "row",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    modalReorderText: {
      color:
        WHITE,

      fontSize:
        11,

      fontWeight:
        "900",

      marginLeft:
        6,
    },
  });