import React, { useMemo } from "react";
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
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

const TUP_LOGO = require("../../../assets/main-image/logo.png");

const LIGHT = {
  background: "#F4F5F7",
  card: "#FFFFFF",
  text: "#101828",
  muted: "#667085",
  border: "#E7E8EB",
  cardinal: "#8F1029",
  cardinalDark: "#730D20",
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
  cardinalDark: "#8F1029",
  cardinalDeep: "#520A18",
  gold: "#D8B56A",
  green: "#4CAF7A",
  yellow: "#D6A84F",
  red: "#E06767",
};

const recentOrders = [
  {
    id: "#ORD-1048",
    customer: "Juan Dela Cruz",
    items: "2 items",
    total: "₱198.00",
    status: "Preparing",
    time: "10:42 AM",
  },
  {
    id: "#ORD-1047",
    customer: "Maria Santos",
    items: "3 items",
    total: "₱275.00",
    status: "Pending",
    time: "10:35 AM",
  },
  {
    id: "#ORD-1046",
    customer: "Kevin Reyes",
    items: "1 item",
    total: "₱89.00",
    status: "Ready",
    time: "10:21 AM",
  },
];

export default function SellerDashboard() {
  const { darkMode } = useTheme();
  const C = darkMode ? DARK : LIGHT;

  const isStoreOpen = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 18;
  }, []);

  const go = (path: "/seller/dashboard" | "/seller/orders" | "/seller/menu" | "/seller/settings") => {
    router.replace(path);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: C.background }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "light-content"}
        backgroundColor={C.cardinalDeep}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { backgroundColor: C.cardinalDeep },
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.brandArea}>
              <View style={styles.logoCircle}>
                <View style={styles.logoInner}>
                  <Text style={styles.logoText}>TUP</Text>
                </View>
              </View>

              <View>
                <Text style={styles.brandSmall}>TUP-OrderUp</Text>
                <Text style={styles.brandTitle}>Seller Center</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => {}}
            >
              <Ionicons
                name="notifications-outline"
                size={23}
                color="#FFFFFF"
              />

              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerStore}>
            <View>
              <Text style={styles.storeLabel}>STORE</Text>
              <Text style={styles.storeName}>Campus Food Hub</Text>
            </View>

            <View
              style={[
                styles.openBadge,
                {
                  backgroundColor: isStoreOpen
                    ? "rgba(46,139,87,0.18)"
                    : "rgba(196,71,71,0.18)",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isStoreOpen
                      ? "#57C987"
                      : "#F07070",
                  },
                ]}
              />

              <Text
                style={[
                  styles.openBadgeText,
                  {
                    color: isStoreOpen ? "#7EE2A4" : "#FF9A9A",
                  },
                ]}
              >
                {isStoreOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* WELCOME */}
          <View
            style={[
              styles.welcomeCard,
              {
                backgroundColor: C.card,
                borderColor: C.border,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.welcomeEyebrow, { color: C.cardinal }]}>
                GOOD DAY, SELLER
              </Text>

              <Text style={[styles.welcomeTitle, { color: C.text }]}>
                Welcome back!
              </Text>

              <Text style={[styles.welcomeSubtitle, { color: C.muted }]}>
                Here is your store performance for today.
              </Text>
            </View>

            <View
              style={[
                styles.welcomeIcon,
                { backgroundColor: darkMode ? "#32121B" : "#F9E9ED" },
              ]}
            >
              <Ionicons
                name="storefront"
                size={29}
                color={C.cardinal}
              />
            </View>
          </View>

          {/* STATS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                Today's overview
              </Text>

              <Text style={[styles.sectionSubtitle, { color: C.muted }]}>
                Store activity at a glance
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon="cash-outline"
              label="Today's Sales"
              value="₱4,280"
              change="+12.5%"
              positive
              C={C}
              darkMode={darkMode}
            />

            <StatCard
              icon="receipt-outline"
              label="Orders"
              value="42"
              change="+8 today"
              positive
              C={C}
              darkMode={darkMode}
            />

            <StatCard
              icon="time-outline"
              label="Pending"
              value="6"
              change="Needs action"
              C={C}
              darkMode={darkMode}
            />

            <StatCard
              icon="trending-up-outline"
              label="Avg. Order"
              value="₱102"
              change="+4.2%"
              positive
              C={C}
              darkMode={darkMode}
            />
          </View>

          {/* STORE STATUS */}
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: darkMode ? "#21151A" : "#FFF8F1",
                borderColor: darkMode ? "#3B252B" : "#F1DFC9",
              },
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor: darkMode ? "#341B23" : "#FBEBD8",
                },
              ]}
            >
              <Ionicons
                name="storefront-outline"
                size={23}
                color={C.cardinal}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, { color: C.text }]}>
                Store status
              </Text>

              <Text style={[styles.statusDescription, { color: C.muted }]}>
                {isStoreOpen
                  ? "Your store is currently accepting orders."
                  : "Your store is currently closed."}
              </Text>

              <Text style={[styles.hours, { color: C.cardinal }]}>
                Operating hours: 7:00 AM – 6:00 PM
              </Text>
            </View>

            <View
              style={[
                styles.livePill,
                {
                  backgroundColor: isStoreOpen
                    ? darkMode
                      ? "#173021"
                      : "#E9F7EF"
                    : darkMode
                    ? "#351B1B"
                    : "#FDECEC",
                },
              ]}
            >
              <View
                style={[
                  styles.smallDot,
                  {
                    backgroundColor: isStoreOpen
                      ? C.green
                      : C.red,
                  },
                ]}
              />

              <Text
                style={[
                  styles.liveText,
                  {
                    color: isStoreOpen ? C.green : C.red,
                  },
                ]}
              >
                {isStoreOpen ? "LIVE" : "OFF"}
              </Text>
            </View>
          </View>

          {/* QUICK ACTIONS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                Quick actions
              </Text>

              <Text style={[styles.sectionSubtitle, { color: C.muted }]}>
                Manage your store faster
              </Text>
            </View>
          </View>

          <View style={styles.quickGrid}>
            <QuickAction
              icon="receipt-outline"
              title="View Orders"
              subtitle="Manage orders"
              C={C}
              onPress={() => go("/seller/orders")}
            />

            <QuickAction
              icon="restaurant-outline"
              title="Manage Menu"
              subtitle="Edit products"
              C={C}
              onPress={() => go("/seller/menu")}
            />

            <QuickAction
              icon="settings-outline"
              title="Settings"
              subtitle="Store preferences"
              C={C}
              onPress={() => go("/seller/settings")}
            />

            <QuickAction
              icon="bar-chart-outline"
              title="Sales"
              subtitle="Today's summary"
              C={C}
              onPress={() => {}}
            />
          </View>

          {/* RECENT ORDERS */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>
                Recent orders
              </Text>

              <Text style={[styles.sectionSubtitle, { color: C.muted }]}>
                Latest customer activity
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => go("/seller/orders")}
            >
              <Text style={[styles.viewAll, { color: C.cardinal }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order) => (
            <RecentOrder
              key={order.id}
              order={order}
              C={C}
            />
          ))}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={[styles.footerBrand, { color: C.cardinal }]}>
              TUP-OrderUp
            </Text>

            <Text style={[styles.footerText, { color: C.muted }]}>
              Seller Management Center
            </Text>
          </View>
        </View>
      </ScrollView>

      <SellerNav
        active="home"
        C={C}
        go={go}
      />
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  positive,
  C,
}: any) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: C.card,
          borderColor: C.border,
        },
      ]}
    >
      <View style={styles.statTop}>
        <View
          style={[
            styles.statIcon,
            {
              backgroundColor: "#F8E9ED",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={19}
            color={C.cardinal}
          />
        </View>
      </View>

      <Text style={[styles.statLabel, { color: C.muted }]}>
        {label}
      </Text>

      <Text style={[styles.statValue, { color: C.text }]}>
        {value}
      </Text>

      <Text
        style={[
          styles.statChange,
          {
            color: positive ? C.green : C.yellow,
          },
        ]}
      >
        {change}
      </Text>
    </View>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  C,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.quickCard,
        {
          backgroundColor: C.card,
          borderColor: C.border,
        },
      ]}
    >
      <View
        style={[
          styles.quickIcon,
          {
            backgroundColor: "#F8E9ED",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={C.cardinal}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.quickTitle, { color: C.text }]}>
          {title}
        </Text>

        <Text style={[styles.quickSubtitle, { color: C.muted }]}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={C.muted}
      />
    </TouchableOpacity>
  );
}

function RecentOrder({ order, C }: any) {
  const statusColor =
    order.status === "Pending"
      ? C.yellow
      : order.status === "Preparing"
      ? C.cardinal
      : C.green;

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
      <View style={styles.orderTop}>
        <View>
          <Text style={[styles.orderId, { color: C.text }]}>
            {order.id}
          </Text>

          <Text style={[styles.orderCustomer, { color: C.muted }]}>
            {order.customer}
          </Text>
        </View>

        <View
          style={[
            styles.orderStatus,
            {
              backgroundColor:
                order.status === "Pending"
                  ? darken(C.yellow)
                  : order.status === "Preparing"
                  ? darken(C.cardinal)
                  : darken(C.green),
            },
          ]}
        >
          <Text
            style={[
              styles.orderStatusText,
              { color: statusColor },
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderBottom}>
        <Text style={[styles.orderItems, { color: C.muted }]}>
          {order.items} • {order.time}
        </Text>

        <Text style={[styles.orderTotal, { color: C.text }]}>
          {order.total}
        </Text>
      </View>
    </View>
  );
}

function darken(color: string) {
  if (color === "#B7791F") return "#FFF3D6";
  if (color === "#8F1029") return "#F8E9ED";
  if (color === "#2E8B57") return "#E9F7EF";
  return "#F5F5F5";
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
        icon="home"
        label="Home"
        active={active === "home"}
        C={C}
        onPress={() => go("/seller/dashboard")}
      />

      <NavItem
        icon="receipt-outline"
        label="Orders"
        active={active === "orders"}
        C={C}
        onPress={() => go("/seller/orders")}
      />

      <NavItem
        icon="restaurant-outline"
        label="Menu"
        active={active === "menu"}
        C={C}
        onPress={() => go("/seller/menu")}
      />

      <NavItem
        icon="settings-outline"
        label="Settings"
        active={active === "settings"}
        C={C}
        onPress={() => go("/seller/settings")}
      />
    </View>
  );
}

function NavItem({ icon, label, active, C, onPress }: any) {
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
            color: active ? C.cardinal : C.muted,
            fontWeight: active ? "700" : "500",
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

  scroll: {
    paddingBottom: 105,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8F1029",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  brandSmall: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  brandTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 2,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    right: 11,
    top: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D8B56A",
  },

  headerStore: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 25,
  },

  storeLabel: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  storeName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
  },

  openBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  openBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  content: {
    paddingHorizontal: 16,
  },

  welcomeCard: {
    marginTop: -5,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  welcomeEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: "900",
    marginTop: 3,
  },

  welcomeSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    maxWidth: 250,
  },

  welcomeIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  sectionHeader: {
    marginTop: 27,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    width: "48.5%",
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
  },

  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  statLabel: {
    fontSize: 11,
    marginTop: 13,
  },

  statValue: {
    fontSize: 21,
    fontWeight: "900",
    marginTop: 3,
  },

  statChange: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
  },

  statusCard: {
    borderRadius: 19,
    borderWidth: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  statusDescription: {
    fontSize: 11,
    marginTop: 3,
  },

  hours: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 5,
  },

  livePill: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  smallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  liveText: {
    fontSize: 9,
    fontWeight: "900",
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quickCard: {
    width: "48.5%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  quickTitle: {
    fontSize: 12,
    fontWeight: "800",
  },

  quickSubtitle: {
    fontSize: 9,
    marginTop: 3,
  },

  viewAll: {
    fontSize: 11,
    fontWeight: "800",
  },

  orderCard: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 15,
    marginBottom: 9,
  },

  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderId: {
    fontSize: 13,
    fontWeight: "900",
  },

  orderCustomer: {
    fontSize: 10,
    marginTop: 3,
  },

  orderStatus: {
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  orderStatusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  orderBottom: {
    borderTopWidth: 1,
    borderTopColor: "#E7E8EB",
    marginTop: 12,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderItems: {
    fontSize: 10,
  },

  orderTotal: {
    fontSize: 13,
    fontWeight: "900",
  },

  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },

  footerBrand: {
    fontSize: 13,
    fontWeight: "900",
  },

  footerText: {
    fontSize: 9,
    marginTop: 3,
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
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
  },

  navLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});