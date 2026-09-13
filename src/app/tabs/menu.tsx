import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   TUP-ORDERUP PROFESSIONAL COLOR SYSTEM
========================================================= */

const CARDINAL = "#7D1021";
const CARDINAL_DARK = "#5C0A17";
const CARDINAL_MID = "#8F1029";
const CARDINAL_LIGHT = "#A6192E";

const GOLD = "#D8B56A";
const GOLD_SOFT = "#F4E8CC";

const WHITE = "#FFFFFF";

const SUCCESS = "#2E8B57";
const ERROR = "#C74A4A";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  "All",
  "Rice Meals",
  "Snacks",
  "Drinks",
  "Desserts",
];

/* =========================================================
   FOOD DATA
========================================================= */

const foods = [
  {
    id: "1",
    name: "Chicken Meal",
    category: "Rice Meals",
    price: 65,
    shop: "TUP Cafeteria",
    icon: "🍗",
    available: true,
    rating: 4.8,
    description:
      "Tender chicken served with steamed rice and a flavorful side.",
  },
  {
    id: "2",
    name: "Porksilog",
    category: "Rice Meals",
    price: 70,
    shop: "TUP Cafeteria",
    icon: "🍳",
    available: true,
    rating: 4.7,
    description:
      "Classic Filipino porksilog served with garlic rice and egg.",
  },
  {
    id: "3",
    name: "Burger",
    category: "Snacks",
    price: 45,
    shop: "Campus Bites",
    icon: "🍔",
    available: true,
    rating: 4.6,
    description:
      "Classic campus burger with a juicy patty and fresh toppings.",
  },
  {
    id: "4",
    name: "French Fries",
    category: "Snacks",
    price: 35,
    shop: "Campus Bites",
    icon: "🍟",
    available: true,
    rating: 4.5,
    description:
      "Golden and crispy fries perfect for a quick campus snack.",
  },
  {
    id: "5",
    name: "Iced Coffee",
    category: "Drinks",
    price: 50,
    shop: "Coffee Corner",
    icon: "☕",
    available: true,
    rating: 4.9,
    description:
      "Refreshing iced coffee for study sessions and busy days.",
  },
  {
    id: "6",
    name: "Milk Tea",
    category: "Drinks",
    price: 55,
    shop: "Tea Station",
    icon: "🧋",
    available: false,
    rating: 4.6,
    description:
      "Creamy milk tea with a smooth and refreshing flavor.",
  },
  {
    id: "7",
    name: "Chocolate Cake",
    category: "Desserts",
    price: 60,
    shop: "Sweet Corner",
    icon: "🍰",
    available: true,
    rating: 4.8,
    description:
      "Rich chocolate cake that's perfect after your campus meal.",
  },
  {
    id: "8",
    name: "Ice Cream",
    category: "Desserts",
    price: 40,
    shop: "Sweet Corner",
    icon: "🍦",
    available: true,
    rating: 4.7,
    description:
      "Cold and creamy ice cream for a refreshing sweet treat.",
  },
];

/* =========================================================
   SORT OPTIONS
========================================================= */

type SortOption =
  | "Recommended"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Rating";

/* =========================================================
   MENU SCREEN
========================================================= */

export default function Menu() {
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
    muted: darkMode ? "#777777" : "#969AA0",
    border: darkMode ? "#2B2B2B" : "#E5E7EA",
    divider: darkMode ? "#303030" : "#F0F1F2",
    softRed: darkMode ? "#321D22" : "#FBECEF",
    softGold: darkMode ? "#332D1F" : "#F4E8CC",
    softGray: darkMode ? "#292929" : "#F2F3F4",
  };

  /* =======================================================
     STATES
  ======================================================= */

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [sortOption, setSortOption] =
    useState<SortOption>("Recommended");

  const [showSortModal, setShowSortModal] =
    useState(false);

  const [selectedFood, setSelectedFood] =
    useState<(typeof foods)[number] | null>(null);

  const [cartCount, setCartCount] =
    useState(0);

  const [favorites, setFavorites] =
    useState<string[]>([]);

  /* =======================================================
     FILTER / SEARCH / SORT
  ======================================================= */

  const filteredFoods = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let result = foods.filter((food) => {
      const categoryMatch =
        selectedCategory === "All" ||
        food.category === selectedCategory;

      const searchMatch =
        keyword.length === 0 ||
        food.name.toLowerCase().includes(keyword) ||
        food.shop.toLowerCase().includes(keyword) ||
        food.category.toLowerCase().includes(keyword);

      return categoryMatch && searchMatch;
    });

    switch (sortOption) {
      case "Price: Low to High":
        result = [...result].sort(
          (a, b) => a.price - b.price
        );
        break;

      case "Price: High to Low":
        result = [...result].sort(
          (a, b) => b.price - a.price
        );
        break;

      case "Rating":
        result = [...result].sort(
          (a, b) => b.rating - a.rating
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    search,
    selectedCategory,
    sortOption,
  ]);

  /* =======================================================
     FAVORITES
  ======================================================= */

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id
        );
      }

      return [...current, id];
    });
  };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (
    food: (typeof foods)[number]
  ) => {
    if (!food.available) {
      Alert.alert(
        "Unavailable",
        `${food.name} is currently unavailable.`
      );

      return;
    }

    setCartCount(
      (current) => current + 1
    );

    Alert.alert(
      "Added to Cart",
      `${food.name} has been added to your cart.`,
      [
        {
          text: "Continue Shopping",
          style: "cancel",
        },
        {
          text: "View Cart",
          onPress: () =>
            router.push("/cart" as any),
        },
      ]
    );
  };

  /* =======================================================
     OPEN FOOD DETAILS
  ======================================================= */

  const openDetails = (
    food: (typeof foods)[number]
  ) => {
    setSelectedFood(food);
  };

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory("All");
  };

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
        backgroundColor={CARDINAL_DARK}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
      >
        {/* =================================================
            PROFESSIONAL HEADER
        ================================================= */}

        <View style={styles.header}>
          <View
            style={
              styles.headerAccentTop
            }
          />

          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={WHITE}
              />
            </TouchableOpacity>

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
                Campus Menu
              </Text>

              <Text
                style={
                  styles.headerSubtitle
                }
              >
                Explore meals and refreshments
              </Text>
            </View>

            <TouchableOpacity
              style={styles.cartButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  "/cart" as any
                )
              }
            >
              <Ionicons
                name="bag-handle-outline"
                size={23}
                color={WHITE}
              />

              {cartCount > 0 && (
                <View
                  style={
                    styles.cartBadge
                  }
                >
                  <Text
                    style={
                      styles.cartBadgeText
                    }
                  >
                    {cartCount > 9
                      ? "9+"
                      : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View
            style={
              styles.headerDivider
            }
          />

          <View
            style={
              styles.headerInfoRow
            }
          >
            <View
              style={
                styles.headerInfoItem
              }
            >
              <Ionicons
                name="restaurant-outline"
                size={14}
                color={GOLD}
              />

              <Text
                style={
                  styles.headerInfoText
                }
              >
                Campus Dining
              </Text>
            </View>

            <View
              style={
                styles.headerInfoItem
              }
            >
              <View
                style={styles.openDot}
              />

              <Text
                style={
                  styles.headerInfoText
                }
              >
                Open for orders
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            SEARCH
        ================================================= */}

        <View
          style={
            styles.searchWrapper
          }
        >
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor:
                  theme.card,
                borderColor:
                  theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.searchIconCircle,
                {
                  backgroundColor:
                    theme.softRed,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={CARDINAL}
              />
            </View>

            <TextInput
              style={[
                styles.searchInput,
                {
                  color:
                    theme.text,
                },
              ]}
              placeholder="Search food or store"
              placeholderTextColor={
                darkMode
                  ? "#777777"
                  : "#A1A4A8"
              }
              value={search}
              onChangeText={
                setSearch
              }
              returnKeyType="search"
            />

            {search.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setSearch("")
                }
              >
                <Ionicons
                  name="close-circle"
                  size={19}
                  color={theme.muted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* =================================================
            CATEGORY SECTION
        ================================================= */}

        <View
          style={
            styles.categorySection
          }
        >
          <View
            style={
              styles.categoryHeader
            }
          >
            <View>
              <Text
                style={
                  styles.sectionLabel
                }
              >
                BROWSE
              </Text>

              <Text
                style={[
                  styles.categoryTitle,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Food Categories
              </Text>
            </View>

            <View
              style={[
                styles.categoryCount,
                {
                  backgroundColor:
                    theme.softRed,
                },
              ]}
            >
              <Text
                style={
                  styles.categoryCountText
                }
              >
                {
                  filteredFoods.length
                }
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categoryContent
            }
          >
            {categories.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category;

                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor:
                          theme.card,
                        borderColor:
                          theme.border,
                      },
                      active &&
                        styles.categoryButtonActive,
                    ]}
                    activeOpacity={0.82}
                    onPress={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                  >
                    {active && (
                      <View
                        style={
                          styles.activeCategoryDot
                        }
                      />
                    )}

                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: active
                            ? WHITE
                            : theme.secondary,
                        },
                        active &&
                          styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </ScrollView>
        </View>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <View
          style={
            styles.toolbar
          }
        >
          <View>
            <Text
              style={[
                styles.resultTitle,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              {
                filteredFoods.length
              }{" "}
              {filteredFoods.length === 1
                ? "menu item"
                : "menu items"}
            </Text>

            <Text
              style={[
                styles.resultSubtitle,
                {
                  color:
                    theme.muted,
                },
              ]}
            >
              Fresh choices available on campus
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor:
                  theme.card,
                borderColor:
                  theme.border,
              },
            ]}
            activeOpacity={0.82}
            onPress={() =>
              setShowSortModal(true)
            }
          >
            <Ionicons
              name="swap-vertical-outline"
              size={16}
              color={CARDINAL}
            />

            <Text
              style={
                styles.sortButtonText
              }
            >
              Sort
            </Text>
          </TouchableOpacity>
        </View>

        {/* =================================================
            FOOD LIST
        ================================================= */}

        {filteredFoods.map((food) => {
          const isFavorite =
            favorites.includes(
              food.id
            );

          return (
            <TouchableOpacity
              key={food.id}
              style={[
                styles.foodCard,
                {
                  backgroundColor:
                    theme.card,
                  borderColor:
                    theme.border,
                },
                !food.available &&
                  styles.foodCardUnavailable,
              ]}
              activeOpacity={0.9}
              onPress={() =>
                openDetails(food)
              }
            >
              <View
                style={
                  styles.foodVisual
                }
              >
                <View
                  style={[
                    styles.foodImage,
                    {
                      backgroundColor:
                        theme.softRed,
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.foodEmoji
                    }
                  >
                    {food.icon}
                  </Text>
                </View>

                <View
                  style={[
                    styles.availabilityIndicator,
                    {
                      backgroundColor:
                        food.available
                          ? SUCCESS
                          : ERROR,
                      borderColor:
                        theme.card,
                    },
                  ]}
                />
              </View>

              <View
                style={
                  styles.foodContent
                }
              >
                <View
                  style={
                    styles.foodHeadingRow
                  }
                >
                  <Text
                    style={[
                      styles.foodName,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {food.name}
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.favoriteButton
                    }
                    activeOpacity={
                      0.7
                    }
                    onPress={() =>
                      toggleFavorite(
                        food.id
                      )
                    }
                  >
                    <Ionicons
                      name={
                        isFavorite
                          ? "heart"
                          : "heart-outline"
                      }
                      size={20}
                      color={
                        isFavorite
                          ? CARDINAL
                          : theme.muted
                      }
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={
                    styles.storeRow
                  }
                >
                  <Ionicons
                    name="storefront-outline"
                    size={13}
                    color={
                      theme.muted
                    }
                  />

                  <Text
                    style={[
                      styles.storeName,
                      {
                        color:
                          theme.muted,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {food.shop}
                  </Text>
                </View>

                <View
                  style={
                    styles.tagRow
                  }
                >
                  <View
                    style={[
                      styles.categoryTag,
                      {
                        backgroundColor:
                          theme.softGold,
                      },
                    ]}
                  >
                    <Text
                      style={
                        styles.categoryTagText
                      }
                    >
                      {food.category}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.ratingTag,
                      {
                        backgroundColor:
                          theme.softGray,
                      },
                    ]}
                  >
                    <Ionicons
                      name="star"
                      size={10}
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
                      {food.rating}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.foodFooter
                  }
                >
                  <Text
                    style={
                      styles.foodPrice
                    }
                  >
                    ₱
                    {food.price.toFixed(
                      2
                    )}
                  </Text>

                  <View
                    style={
                      styles.availabilityTextRow
                    }
                  >
                    <View
                      style={[
                        styles.tinyStatusDot,
                        {
                          backgroundColor:
                            food.available
                              ? SUCCESS
                              : ERROR,
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.availabilityText,
                        {
                          color:
                            food.available
                              ? SUCCESS
                              : ERROR,
                        },
                      ]}
                    >
                      {food.available
                        ? "Available"
                        : "Unavailable"}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  !food.available &&
                    styles.addButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={
                  !food.available
                }
                onPress={() =>
                  addToCart(food)
                }
              >
                <Ionicons
                  name={
                    food.available
                      ? "add"
                      : "remove"
                  }
                  size={20}
                  color={WHITE}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredFoods.length === 0 && (
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
                    theme.softRed,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={32}
                color={CARDINAL}
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
              No menu items found
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
              We couldn't find anything
              matching your search or
              category.
            </Text>

            <TouchableOpacity
              style={
                styles.resetButton
              }
              activeOpacity={0.82}
              onPress={clearSearch}
            >
              <Text
                style={
                  styles.resetButtonText
                }
              >
                Reset Menu
              </Text>
            </TouchableOpacity>
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
              styles.footerGoldLine
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
            Campus ordering made simple
            and convenient.
          </Text>
        </View>
      </ScrollView>

      {/* =====================================================
          FOOD DETAILS MODAL
      ===================================================== */}

      <Modal
        visible={
          selectedFood !== null
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSelectedFood(null)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.foodModal,
              {
                backgroundColor:
                  theme.card,
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
                      : "#D7D9DC",
                },
              ]}
            />

            <TouchableOpacity
              style={[
                styles.modalClose,
                {
                  backgroundColor:
                    theme.softGray,
                },
              ]}
              activeOpacity={0.8}
              onPress={() =>
                setSelectedFood(
                  null
                )
              }
            >
              <Ionicons
                name="close"
                size={21}
                color={
                  theme.secondary
                }
              />
            </TouchableOpacity>

            {selectedFood && (
              <>
                <View
                  style={[
                    styles.modalVisual,
                    {
                      backgroundColor:
                        theme.softRed,
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.modalEmoji
                    }
                  >
                    {
                      selectedFood.icon
                    }
                  </Text>
                </View>

                <View
                  style={
                    styles.modalTitleRow
                  }
                >
                  <View
                    style={
                      styles.modalNameArea
                    }
                  >
                    <Text
                      style={[
                        styles.modalFoodName,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {
                        selectedFood.name
                      }
                    </Text>

                    <View
                      style={
                        styles.modalStoreRow
                      }
                    >
                      <Ionicons
                        name="storefront-outline"
                        size={13}
                        color={
                          theme.muted
                        }
                      />

                      <Text
                        style={[
                          styles.modalStore,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        {
                          selectedFood.shop
                        }
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={
                      0.7
                    }
                    onPress={() =>
                      toggleFavorite(
                        selectedFood.id
                      )
                    }
                  >
                    <Ionicons
                      name={
                        favorites.includes(
                          selectedFood.id
                        )
                          ? "heart"
                          : "heart-outline"
                      }
                      size={26}
                      color={
                        favorites.includes(
                          selectedFood.id
                        )
                          ? CARDINAL
                          : theme.muted
                      }
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.modalDivider,
                    {
                      backgroundColor:
                        theme.divider,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.modalDescription,
                    {
                      color:
                        theme.secondary,
                    },
                  ]}
                >
                  {
                    selectedFood.description
                  }
                </Text>

                <View
                  style={
                    styles.modalInformation
                  }
                >
                  <View
                    style={
                      styles.modalInfoItem
                    }
                  >
                    <View
                      style={[
                        styles.modalInfoIcon,
                        {
                          backgroundColor:
                            theme.softGray,
                        },
                      ]}
                    >
                      <Ionicons
                        name="star"
                        size={15}
                        color={
                          GOLD
                        }
                      />
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.modalInfoValue,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                      >
                        {
                          selectedFood.rating
                        }
                      </Text>

                      <Text
                        style={[
                          styles.modalInfoLabel,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        Rating
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.modalInfoItem
                    }
                  >
                    <View
                      style={[
                        styles.modalInfoIcon,
                        {
                          backgroundColor:
                            theme.softGray,
                        },
                      ]}
                    >
                      <Ionicons
                        name="pricetag-outline"
                        size={15}
                        color={
                          CARDINAL
                        }
                      />
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.modalInfoValue,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                      >
                        ₱
                        {selectedFood.price.toFixed(
                          2
                        )}
                      </Text>

                      <Text
                        style={[
                          styles.modalInfoLabel,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        Price
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.modalInfoItem
                    }
                  >
                    <View
                      style={[
                        styles.modalInfoIcon,
                        {
                          backgroundColor:
                            theme.softGray,
                        },
                      ]}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={15}
                        color={
                          selectedFood.available
                            ? SUCCESS
                            : ERROR
                        }
                      />
                    </View>

                    <View>
                      <Text
                        style={[
                          styles.modalInfoValue,
                          {
                            color:
                              selectedFood.available
                                ? SUCCESS
                                : ERROR,
                          },
                        ]}
                      >
                        {
                          selectedFood.available
                            ? "Ready"
                            : "Unavailable"
                        }
                      </Text>

                      <Text
                        style={[
                          styles.modalInfoLabel,
                          {
                            color:
                              theme.muted,
                          },
                        ]}
                      >
                        Status
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.modalAddButton,
                    !selectedFood.available &&
                      styles.modalAddButtonDisabled,
                  ]}
                  activeOpacity={0.85}
                  disabled={
                    !selectedFood.available
                  }
                  onPress={() => {
                    addToCart(
                      selectedFood
                    );
                    setSelectedFood(
                      null
                    );
                  }}
                >
                  <Ionicons
                    name="bag-add-outline"
                    size={19}
                    color={WHITE}
                  />

                  <Text
                    style={
                      styles.modalAddButtonText
                    }
                  >
                    {selectedFood.available
                      ? "Add to Cart"
                      : "Currently Unavailable"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* =====================================================
          SORT MODAL
      ===================================================== */}

      <Modal
        visible={
          showSortModal
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowSortModal(false)
        }
      >
        <Pressable
          style={
            styles.sortOverlay
          }
          onPress={() =>
            setShowSortModal(false)
          }
        >
          <Pressable
            style={[
              styles.sortModal,
              {
                backgroundColor:
                  theme.card,
              },
            ]}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View
              style={
                styles.sortModalHeader
              }
            >
              <View>
                <Text
                  style={[
                    styles.sortModalTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Sort Menu
                </Text>

                <Text
                  style={[
                    styles.sortModalSubtitle,
                    {
                      color:
                        theme.muted,
                    },
                  ]}
                >
                  Choose your preferred order
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setShowSortModal(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={
                    theme.secondary
                  }
                />
              </TouchableOpacity>
            </View>

            {(
              [
                "Recommended",
                "Price: Low to High",
                "Price: High to Low",
                "Rating",
              ] as SortOption[]
            ).map((option) => {
              const active =
                sortOption ===
                option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortOption,
                    active && {
                      backgroundColor:
                        theme.softRed,
                    },
                  ]}
                  activeOpacity={
                    0.82
                  }
                  onPress={() => {
                    setSortOption(
                      option
                    );
                    setShowSortModal(
                      false
                    );
                  }}
                >
                  <View
                    style={[
                      styles.sortOptionIcon,
                      {
                        backgroundColor:
                          theme.softGray,
                      },
                      active && {
                        backgroundColor:
                          theme.card,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        option ===
                        "Rating"
                          ? "star-outline"
                          : option ===
                            "Recommended"
                          ? "sparkles-outline"
                          : "swap-vertical-outline"
                      }
                      size={17}
                      color={
                        active
                          ? CARDINAL
                          : theme.secondary
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.sortOptionText,
                      {
                        color: active
                          ? CARDINAL
                          : theme.secondary,
                      },
                      active &&
                        styles.sortOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>

                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={
                        CARDINAL
                      }
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
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

  container: {
    paddingBottom: 35,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    backgroundColor:
      CARDINAL_DARK,

    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 19,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,

    overflow: "hidden",
  },

  headerAccentTop: {
    position: "absolute",

    right: -70,
    top: -85,

    width: 210,
    height: 210,

    borderRadius: 105,

    backgroundColor:
      "rgba(255,255,255,0.035)",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 39,
    height: 39,

    borderRadius: 12,

    backgroundColor:
      "rgba(255,255,255,0.10)",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  headerTitleArea: {
    flex: 1,
    paddingRight: 9,
  },

  headerOverline: {
    color: "#DAB9C0",

    fontSize: 8.5,
    fontWeight: "900",

    letterSpacing: 1.2,
  },

  headerTitle: {
    color: WHITE,

    fontSize: 23,
    fontWeight: "900",

    marginTop: 2,
  },

  headerSubtitle: {
    color: "#D6B8BF",

    fontSize: 10.5,

    marginTop: 2,
  },

  cartButton: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor:
      "rgba(255,255,255,0.10)",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
  },

  cartBadge: {
    position: "absolute",

    top: -3,
    right: -3,

    minWidth: 19,
    height: 19,

    borderRadius: 10,

    backgroundColor: GOLD,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,

    borderWidth: 2,
    borderColor:
      CARDINAL_DARK,
  },

  cartBadgeText: {
    fontSize: 8.5,
    fontWeight: "900",

    color: CARDINAL_DARK,
  },

  headerDivider: {
    height: 1,

    backgroundColor:
      "rgba(255,255,255,0.11)",

    marginTop: 16,
    marginBottom: 11,
  },

  headerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerInfoItem: {
    flexDirection: "row",
    alignItems: "center",

    marginRight: 18,
  },

  headerInfoText: {
    color: "#DABEC4",

    fontSize: 9.5,

    marginLeft: 5,
  },

  openDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: "#68CB87",

    marginRight: 1,
  },

  /* =======================================================
     SEARCH
  ======================================================= */

  searchWrapper: {
    marginHorizontal: 18,
    marginTop: -10,
  },

  searchBox: {
    height: 54,

    borderRadius: 16,

    paddingHorizontal: 10,

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
  },

  searchIconCircle: {
    width: 35,
    height: 35,

    borderRadius: 11,

    justifyContent: "center",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,

    marginLeft: 9,

    fontSize: 13,

    height: "100%",
  },

  /* =======================================================
     CATEGORIES
  ======================================================= */

  categorySection: {
    marginTop: 24,
  },

  categoryHeader: {
    marginHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionLabel: {
    color: CARDINAL,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.2,
  },

  categoryTitle: {
    fontSize: 17,
    fontWeight: "900",

    marginTop: 2,
  },

  categoryCount: {
    width: 31,
    height: 31,

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
  },

  categoryCountText: {
    color: CARDINAL,

    fontSize: 11,
    fontWeight: "900",
  },

  categoryContent: {
    paddingHorizontal: 18,
    paddingTop: 11,
  },

  categoryButton: {
    minHeight: 37,

    paddingHorizontal: 14,

    borderRadius: 11,

    marginRight: 8,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
  },

  categoryButtonActive: {
    backgroundColor: CARDINAL,
    borderColor: CARDINAL,
  },

  activeCategoryDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: GOLD,

    marginRight: 6,
  },

  categoryText: {
    fontSize: 10.5,
    fontWeight: "800",
  },

  categoryTextActive: {
    color: WHITE,
  },

  /* =======================================================
     TOOLBAR
  ======================================================= */

  toolbar: {
    marginHorizontal: 20,

    marginTop: 23,
    marginBottom: 11,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: "900",
  },

  resultSubtitle: {
    fontSize: 9.2,

    marginTop: 2,
  },

  sortButton: {
    height: 34,

    paddingHorizontal: 11,

    borderRadius: 10,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
  },

  sortButtonText: {
    color: CARDINAL,

    fontSize: 9.5,
    fontWeight: "900",

    marginLeft: 4,
  },

  /* =======================================================
     FOOD CARD
  ======================================================= */

  foodCard: {
    marginHorizontal: 18,
    marginBottom: 11,

    padding: 12,

    minHeight: 126,

    borderRadius: 18,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.035,
    shadowRadius: 7,

    elevation: 2,
  },

  foodCardUnavailable: {
    opacity: 0.62,
  },

  foodVisual: {
    position: "relative",

    marginRight: 12,
  },

  foodImage: {
    width: 82,
    height: 82,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  foodEmoji: {
    fontSize: 39,
  },

  availabilityIndicator: {
    position: "absolute",

    width: 11,
    height: 11,

    right: 4,
    bottom: 4,

    borderRadius: 6,

    borderWidth: 2,
  },

  foodContent: {
    flex: 1,

    minWidth: 0,
  },

  foodHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  foodName: {
    flex: 1,

    fontSize: 14.5,
    fontWeight: "900",

    paddingRight: 5,
  },

  favoriteButton: {
    width: 28,
    height: 28,

    justifyContent: "center",
    alignItems: "center",
  },

  storeRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 4,
  },

  storeName: {
    flex: 1,

    fontSize: 9.7,

    marginLeft: 4,
  },

  tagRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 6,
  },

  categoryTag: {
    borderRadius: 7,

    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  categoryTagText: {
    color: "#876827",

    fontSize: 7.2,
    fontWeight: "900",
  },

  ratingTag: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 7,

    paddingHorizontal: 5,
    paddingVertical: 3,

    marginLeft: 5,
  },

  ratingText: {
    fontSize: 8,
    fontWeight: "800",

    marginLeft: 3,
  },

  foodFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 8,
  },

  foodPrice: {
    color: CARDINAL,

    fontSize: 15,
    fontWeight: "900",
  },

  availabilityTextRow: {
    flexDirection: "row",
    alignItems: "center",

    marginLeft: 5,
  },

  tinyStatusDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    marginRight: 4,
  },

  availabilityText: {
    fontSize: 8.3,
    fontWeight: "800",
  },

  addButton: {
    width: 36,
    height: 36,

    borderRadius: 12,

    backgroundColor: CARDINAL,

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 8,
  },

  addButtonDisabled: {
    backgroundColor: "#AEB1B5",
  },

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  emptyState: {
    alignItems: "center",

    paddingHorizontal: 35,
    paddingVertical: 62,
  },

  emptyIcon: {
    width: 68,
    height: 68,

    borderRadius: 21,

    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",

    marginTop: 13,
  },

  emptyDescription: {
    fontSize: 10.5,

    lineHeight: 17,

    textAlign: "center",

    marginTop: 5,
  },

  resetButton: {
    marginTop: 15,

    paddingHorizontal: 16,
    paddingVertical: 9,

    borderRadius: 10,

    backgroundColor: CARDINAL,
  },

  resetButtonText: {
    color: WHITE,

    fontSize: 10,
    fontWeight: "900",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    alignItems: "center",

    marginTop: 25,

    paddingHorizontal: 20,
  },

  footerGoldLine: {
    width: 38,
    height: 2,

    borderRadius: 2,

    backgroundColor: GOLD,

    marginBottom: 12,
  },

  footerBrand: {
    color: CARDINAL,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 0.7,
  },

  footerText: {
    fontSize: 8.5,

    marginTop: 3,

    textAlign: "center",
  },

  /* =======================================================
     FOOD DETAILS MODAL
  ======================================================= */

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor:
      "rgba(16,18,20,0.42)",
  },

  foodModal: {
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,

    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 28,

    maxHeight: "88%",
  },

  modalHandle: {
    width: 38,
    height: 4,

    borderRadius: 4,

    alignSelf: "center",

    marginBottom: 8,
  },

  modalClose: {
    position: "absolute",

    right: 17,
    top: 15,

    width: 36,
    height: 36,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 10,
  },

  modalVisual: {
    width: 112,
    height: 112,

    borderRadius: 26,

    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",

    marginTop: 17,
    marginBottom: 17,
  },

  modalEmoji: {
    fontSize: 58,
  },

  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalNameArea: {
    flex: 1,

    paddingRight: 10,
  },

  modalFoodName: {
    fontSize: 21,
    fontWeight: "900",
  },

  modalStoreRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 4,
  },

  modalStore: {
    fontSize: 10.5,

    marginLeft: 4,
  },

  modalDivider: {
    height: 1,

    marginVertical: 15,
  },

  modalDescription: {
    fontSize: 11.5,

    lineHeight: 18,
  },

  modalInformation: {
    flexDirection: "row",

    marginTop: 19,

    justifyContent: "space-between",
  },

  modalInfoItem: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
  },

  modalInfoIcon: {
    width: 30,
    height: 30,

    borderRadius: 9,

    justifyContent: "center",
    alignItems: "center",
  },

  modalInfoValue: {
    fontSize: 10.5,
    fontWeight: "900",

    marginLeft: 6,
  },

  modalInfoLabel: {
    fontSize: 7.5,

    marginLeft: 6,
    marginTop: 1,
  },

  modalAddButton: {
    height: 52,

    borderRadius: 15,

    backgroundColor: CARDINAL,

    marginTop: 22,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
  },

  modalAddButtonDisabled: {
    backgroundColor: "#A7AAAD",
  },

  modalAddButtonText: {
    color: WHITE,

    fontSize: 13,
    fontWeight: "900",

    marginLeft: 7,
  },

  /* =======================================================
     SORT MODAL
  ======================================================= */

  sortOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor:
      "rgba(16,18,20,0.28)",
  },

  sortModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },

  sortModalHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "flex-start",

    marginBottom: 13,
  },

  sortModalTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  sortModalSubtitle: {
    fontSize: 9.5,

    marginTop: 3,
  },

  sortOption: {
    minHeight: 52,

    borderRadius: 13,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 9,

    marginBottom: 6,
  },

  sortOptionIcon: {
    width: 36,
    height: 36,

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 9,
  },

  sortOptionText: {
    flex: 1,

    fontSize: 11.5,
    fontWeight: "700",
  },

  sortOptionTextActive: {
    fontWeight: "900",
  },
});