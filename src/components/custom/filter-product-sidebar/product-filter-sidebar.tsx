"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Grid3X3,
  Search,
  SlidersHorizontal,
  X,
  Box,
  StickyNote,
  PackagePlus,
  LucideIcon,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Product } from "@/hooks/use-cart-store";
import { memo, startTransition, useCallback, useMemo, useState } from "react";
import {
  CardProduct,
  CardProductProps,
} from "@/components/global-components/card/card-product";
import { toLowerCaseNonAccentVietnamese } from "@/utils/non-accent";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import ComboProductCard, {
  ComboProduct,
} from "@/components/global-components/card/card-combo";
import { EmptyState } from "@/components/global-components/empty-state";
import { CustomComboBuilder } from "@/features/client/home/custom-combo/custom-combo-builder";
import { VercelTab } from "../_custom_tabs/vercel-tabs";
import FilterPanel from "./filter-panel";

// ─── Constants ──────────────────────────────────────────────────────────
const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "tab-1", label: "Tất cả sản phẩm", icon: Grid3X3 },
  { id: "tab-2", label: "Combo sản phẩm", icon: Box },
  { id: "tab-3", label: "Bạn có muốn tạo Combo?", icon: PackagePlus },
];

const sortOptions = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "priceAsc", label: "Giá: Thấp đến cao" },
  { value: "priceDesc", label: "Giá: Cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "bestSelling", label: "Bán chạy nhất" },
];

const popularFilters = [
  { id: "organic", name: "Hữu cơ", count: 24 },
  { id: "no-sugar", name: "Không đường", count: 18 },
  { id: "high-protein", name: "Chất đạm", count: 12 },
  { id: "gluten-free", name: "Gluten Free", count: 32 },
];

// ─── Animation Variants ─────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const badgeVariants = {
  initial: { opacity: 0, scale: 0.8, x: -8 },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: -8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────

const extractUniqueValues = (products: Product[]) => {
  const categories = new Set<string>();
  const packageTypes = new Set<string>();
  const tags = new Set<string>();
  const colors = new Set<string>();
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = 0;
  let minWeight = Number.POSITIVE_INFINITY;
  let maxWeight = 0;

  products?.forEach((product) => {
    product.categories.forEach((category) => categories.add(category.name));
    product.tags?.forEach((tag: string) => tags.add(tag));
    product.variant.forEach((variant) => {
      packageTypes.add(variant.packageType);
      minPrice = Math.min(minPrice, variant.price);
      maxPrice = Math.max(maxPrice, variant.price);
      minWeight = Math.min(minWeight, variant.netWeight);
      maxWeight = Math.max(maxWeight, variant.netWeight);
    });
  });

  return {
    categories: Array.from(categories),
    packageTypes: Array.from(packageTypes),
    tags: Array.from(tags),
    colors: Array.from(colors),
    priceRange: { min: minPrice, max: maxPrice },
    weightRange: { min: minWeight, max: maxWeight },
  };
};

// ─── Types ──────────────────────────────────────────────────────────────

export type FilterTypes = {
  categories: string[];
  packageTypes: string[];
  tags: string[];
  colors: string[];
  priceRange: number[];
  weightRange: number[];
  hasPromotion: boolean;
  inStock: boolean;
  searchQuery: string;
  nutritionRange: Record<string, number[]>;
};

interface ProductFilterSidebarProps {
  products: Product[];
  combos: ComboProduct[];
  comboRefetch: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────

export const ProductFilterSidebar = memo(
  ({ products, combos, comboRefetch }: ProductFilterSidebarProps) => {
    const shouldReduceMotion = useReducedMotion();

    // Memoize extracted unique values — only recompute when products change
    const { categories, packageTypes, tags, priceRange, weightRange } = useMemo(
      () => extractUniqueValues(products),
      [products],
    );

    const [filters, setFilters] = useState<FilterTypes>({
      categories: [],
      packageTypes: [],
      tags: [],
      colors: [],
      priceRange: [priceRange.min, priceRange.max],
      weightRange: [weightRange.min, weightRange.max],
      hasPromotion: false,
      inStock: false,
      searchQuery: "",
      nutritionRange: {
        calories: [0, 200],
        protein: [0, 5],
        carbs: [0, 40],
        fat: [0, 5],
      },
    });

    const [sortBy, setSortBy] = useState("popular");
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [compareList, setCompareList] = useState<string[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<CardProductProps[]>(
      [],
    );
    const [savedFilters, setSavedFilters] = useState([
      {
        id: 1,
        name: "Organic Only",
        filters: { categories: [], tags: ["Organic"], hasPromotion: false },
      },
      {
        id: 2,
        name: "Promotion Items",
        filters: { categories: [], hasPromotion: true },
      },
    ]);
    const [searchQuery, setSearchQuery] = useState("");
    const [tab, setTab] = useState("tab-1");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // ─── Derived state via useMemo (replaces 3 useEffect hooks) ───────

    const activeFiltersCount = useMemo(() => {
      let count = 0;
      if (filters.categories.length > 0) count++;
      if (filters.packageTypes.length > 0) count++;
      if (filters.tags.length > 0) count++;
      if (filters.colors.length > 0) count++;
      if (
        filters.priceRange[0] > priceRange.min ||
        filters.priceRange[1] < priceRange.max
      )
        count++;
      if (
        filters.weightRange[0] > weightRange.min ||
        filters.weightRange[1] < weightRange.max
      )
        count++;
      if (filters.hasPromotion) count++;
      if (filters.inStock) count++;
      if (filters.searchQuery) count++;
      if (
        filters.nutritionRange.protein?.[0] > 0 ||
        filters.nutritionRange.protein?.[1] < 5
      )
        count++;
      if (
        filters.nutritionRange.carbs?.[0] > 0 ||
        filters.nutritionRange.carbs?.[1] < 40
      )
        count++;
      return count;
    }, [filters, priceRange, weightRange]);

    const filteredProducts = useMemo(() => {
      const filtered = products.filter((product) => {
        // Search query filter
        if (
          filters.searchQuery &&
          !toLowerCaseNonAccentVietnamese(product.name).includes(
            toLowerCaseNonAccentVietnamese(filters.searchQuery),
          ) &&
          !product.variant.some((v) =>
            toLowerCaseNonAccentVietnamese(v.packageType)
              .toLowerCase()
              .includes(toLowerCaseNonAccentVietnamese(filters.searchQuery)),
          )
        ) {
          return false;
        }

        // Category filter
        if (filters.categories.length > 0) {
          const productCats = product.categories.map((c) => c.name);
          if (!filters.categories.some((cat) => productCats.includes(cat))) {
            return false;
          }
        }

        // Tag filter
        if (filters.tags.length > 0) {
          if (
            !product.tags ||
            !filters.tags.some((tag) => product.tags?.includes(tag))
          ) {
            return false;
          }
        }

        // Variant-level filters
        const hasMatchingVariant = product.variant.some((variant) => {
          if (
            filters.packageTypes.length > 0 &&
            !filters.packageTypes.includes(variant.packageType)
          )
            return false;
          if (
            variant.price < filters.priceRange[0] ||
            variant.price > filters.priceRange[1]
          )
            return false;
          if (
            variant.netWeight < filters.weightRange[0] ||
            variant.netWeight > filters.weightRange[1]
          )
            return false;
          if (filters.hasPromotion && !variant.promotion) return false;
          if (filters.inStock && variant.stockQuantity <= 0) return false;
          return true;
        });

        // Nutrition facts filter
        if (product.nutritionFacts) {
          const parseNum = (v: string | number) =>
            typeof v === "string" ? parseFloat(v) : v;
          const {
            calories = 0,
            protein = 0,
            carbs = 0,
            fat = 0,
          } = product.nutritionFacts;
          const { nutritionRange } = filters;

          const pCal = parseNum(calories);
          const pPro = parseNum(protein);
          const pCarb = parseNum(carbs);
          const pFat = parseNum(fat);

          if (
            pCal > (nutritionRange.calories?.[0] ?? 0) ||
            pCal < (nutritionRange.calories?.[1] ?? 200)
          )
            return false;
          if (
            pPro > (nutritionRange.protein?.[0] ?? 0) ||
            pPro < (nutritionRange.protein?.[1] ?? 5)
          )
            return false;
          if (
            pCarb > (nutritionRange.carbs?.[0] ?? 0) ||
            pCarb < (nutritionRange.carbs?.[1] ?? 40)
          )
            return false;
          if (
            pFat > (nutritionRange.fat?.[0] ?? 0) ||
            pFat < (nutritionRange.fat?.[1] ?? 5)
          )
            return false;
        }

        return hasMatchingVariant;
      });

      // Sort
      return [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return b.quantitySold - a.quantitySold;
          case "newest":
            return 0;
          case "priceAsc":
            return (
              (a.variant[0].promotion?.price || a.variant[0].price) -
              (b.variant[0].promotion?.price || b.variant[0].price)
            );
          case "priceDesc":
            return (
              (b.variant[0].promotion?.price || b.variant[0].price) -
              (a.variant[0].promotion?.price || a.variant[0].price)
            );
          case "rating":
            return b.rating - a.rating;
          case "bestSelling":
            return b.quantitySold - a.quantitySold;
          default:
            return 0;
        }
      });
    }, [filters, sortBy, products]);

    // ─── Stable callbacks ─────────────────────────────────────────────

    const updateFilters = useCallback(
      (updater: (prev: FilterTypes) => FilterTypes) => {
        startTransition(() => {
          setFilters(updater);
        });
      },
      [],
    );

    const handleCategoryChange = useCallback(
      (category: string) => {
        updateFilters((prev) => ({
          ...prev,
          categories: prev.categories.includes(category)
            ? prev.categories.filter((c) => c !== category)
            : [...prev.categories, category],
        }));
      },
      [updateFilters],
    );

    const handlePackageTypeChange = useCallback(
      (packageType: string) => {
        updateFilters((prev) => ({
          ...prev,
          packageTypes: prev.packageTypes.includes(packageType)
            ? prev.packageTypes.filter((p) => p !== packageType)
            : [...prev.packageTypes, packageType],
        }));
      },
      [updateFilters],
    );

    const handleTagChange = useCallback(
      (tag: string) => {
        updateFilters((prev) => ({
          ...prev,
          tags: prev.tags.includes(tag)
            ? prev.tags.filter((t) => t !== tag)
            : [...prev.tags, tag],
        }));
      },
      [updateFilters],
    );

    const handlePriceRangeChange = useCallback(
      (value: number[]) => {
        updateFilters((prev) => ({ ...prev, priceRange: value }));
      },
      [updateFilters],
    );

    const handleWeightRangeChange = useCallback(
      (value: number[]) => {
        updateFilters((prev) => ({ ...prev, weightRange: value }));
      },
      [updateFilters],
    );

    const handlePromotionChange = useCallback(
      (checked: boolean) => {
        updateFilters((prev) => ({ ...prev, hasPromotion: checked }));
      },
      [updateFilters],
    );

    const handleInStockChange = useCallback(
      (checked: boolean) => {
        updateFilters((prev) => ({ ...prev, inStock: checked }));
      },
      [updateFilters],
    );

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toString().toLowerCase();
        setSearchQuery(value);
        // Debounced filter update via startTransition
        startTransition(() => {
          setFilters((prev) => ({ ...prev, searchQuery: value }));
        });
      },
      [],
    );

    const handleNutritionRangeChange = useCallback(
      (nutrient: string, value: number[]) => {
        updateFilters((prev) => ({
          ...prev,
          nutritionRange: { ...prev.nutritionRange, [nutrient]: value },
        }));
      },
      [updateFilters],
    );

    const resetFilters = useCallback(() => {
      setFilters({
        categories: [],
        packageTypes: [],
        tags: [],
        colors: [],
        priceRange: [priceRange.min, priceRange.max],
        weightRange: [weightRange.min, weightRange.max],
        hasPromotion: false,
        inStock: false,
        searchQuery: "",
        nutritionRange: {
          calories: [0, 200],
          protein: [0, 5],
          carbs: [0, 40],
          fat: [0, 5],
        },
      });
      setSearchQuery("");
    }, [priceRange, weightRange]);

    const toggleCompare = useCallback((productVariantId: string) => {
      setCompareList((prev) =>
        prev.includes(productVariantId)
          ? prev.filter((id) => id !== productVariantId)
          : prev.length < 3
            ? [...prev, productVariantId]
            : prev,
      );
    }, []);

    const applySavedFilter = useCallback(
      (savedFilter: { filters: Partial<FilterTypes> }) => {
        updateFilters((prev) => ({ ...prev, ...savedFilter.filters }));
      },
      [updateFilters],
    );

    const saveCurrentFilter = useCallback(() => {
      const newFilter = {
        id: Date.now(),
        name: `Filter ${savedFilters.length + 1}`,
        filters: {
          categories: filters.categories,
          packageTypes: filters.packageTypes,
          tags: filters.tags,
          colors: filters.colors,
          hasPromotion: filters.hasPromotion,
          inStock: filters.inStock,
        },
      };
      setSavedFilters((prev: any) => [...prev, newFilter]);
    }, [filters, savedFilters.length]);

    // ─── Animation helpers ────────────────────────────────────────────

    const getAnimProps = (i: number) =>
      shouldReduceMotion
        ? {}
        : {
            custom: i,
            variants: cardVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
          };

    // ─── Render Active Filter Badges ──────────────────────────────────

    const renderActiveBadge = (
      key: string,
      label: string,
      onRemove: () => void,
    ) => (
      <motion.div
        key={key}
        variants={badgeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
      >
        <AdvancedColorfulBadges
          color="violet"
          className="flex items-center gap-1.5 rounded-full px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          {label}
          <X
            className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors duration-200"
            onClick={onRemove}
          />
        </AdvancedColorfulBadges>
      </motion.div>
    );

    // ─── Render ───────────────────────────────────────────────────────

    return (
      <div className="w-full space-y-4 ">
        {/* ─── Sticky Toolbar ──────────────────────────────────────── */}
        <div className="sticky top-[70px] z-20 backdrop-blur-xl bg-background/80 border border-border/40 rounded-2xl shadow-sm">
          <div className="px-4 py-3 space-y-3">
            {/* Row 1: Search + Sort + Filter Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-9 h-10 rounded-xl border-border/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Tìm kiếm sản phẩm"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl border-border/60 hover:border-border transition-colors duration-200">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {sortOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="rounded-lg cursor-pointer"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filter Sheet Trigger */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 gap-2 shrink-0"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="hidden sm:inline">Bộ lọc</span>
                      {activeFiltersCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 min-w-5 rounded-full text-xs bg-primary/10 text-primary border-0"
                        >
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    className="w-full sm:w-[520px] p-0 overflow-hidden "
                    classNameOverlay="bg-black/20"
                  >
                    <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/40">
                      <SheetTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                          </div>
                          <span>Bộ lọc nâng cao</span>
                          {activeFiltersCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="h-5 min-w-5 rounded-full text-xs bg-primary/10 text-primary border-0"
                            >
                              {activeFiltersCount}
                            </Badge>
                          )}
                        </div>
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="h-8 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg text-xs"
                          >
                            <X className="mr-1 h-3 w-3" />
                            Xóa tất cả
                          </Button>
                        )}
                      </SheetTitle>
                    </SheetHeader>
                    <FilterPanel
                      searchQuery={searchQuery}
                      handleSearchChange={handleSearchChange}
                      activeFiltersCount={activeFiltersCount}
                      resetFilters={resetFilters}
                      saveCurrentFilter={saveCurrentFilter}
                      applySavedFilter={applySavedFilter}
                      savedFilters={savedFilters}
                      popularFilters={popularFilters}
                      handleTagChange={handleTagChange}
                      handleCategoryChange={handleCategoryChange}
                      handlePackageTypeChange={handlePackageTypeChange}
                      handlePriceRangeChange={handlePriceRangeChange}
                      weightRange={weightRange}
                      handleWeightRangeChange={handleWeightRangeChange}
                      handlePromotionChange={handlePromotionChange}
                      handleInStockChange={handleInStockChange}
                      handleNutritionRangeChange={handleNutritionRangeChange}
                      toggleCompare={toggleCompare}
                      compareList={compareList}
                      recentlyViewed={recentlyViewed}
                      products={products}
                      filters={filters}
                      tags={tags}
                      priceRange={priceRange}
                      packageTypes={packageTypes}
                      categories={categories}
                      filteredProducts={filteredProducts}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Row 2: Tabs */}
            <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
              <VercelTab
                tabs={TABS}
                activeTab={tab}
                onTabChange={setTab}
                classNameContent="text-foreground gap-1 whitespace-nowrap"
              />
            </div>
          </div>
        </div>

        {/* ─── Active Filter Badges ────────────────────────────────── */}
        <AnimatePresence mode="popLayout">
          {activeFiltersCount > 0 && (
            <motion.div
              className="flex flex-wrap items-center gap-2 px-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center gap-1.5 mr-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {filteredProducts.length} sản phẩm
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {filters.categories.map((category) =>
                  renderActiveBadge(`cat-${category}`, category, () =>
                    handleCategoryChange(category),
                  ),
                )}

                {filters.packageTypes.map((packageType) =>
                  renderActiveBadge(`pkg-${packageType}`, packageType, () =>
                    handlePackageTypeChange(packageType),
                  ),
                )}

                {filters.tags.map((tag) =>
                  renderActiveBadge(`tag-${tag}`, tag, () =>
                    handleTagChange(tag),
                  ),
                )}

                {(filters.priceRange?.[0] > priceRange.min ||
                  filters.priceRange?.[1] < priceRange.max) &&
                  renderActiveBadge(
                    "price",
                    `Giá: ${filters.priceRange[0].toLocaleString()}đ - ${filters.priceRange[1].toLocaleString()}đ`,
                    () =>
                      updateFilters((prev) => ({
                        ...prev,
                        priceRange: [priceRange.min, priceRange.max],
                      })),
                  )}

                {(filters.weightRange?.[0] > weightRange.min ||
                  filters.weightRange?.[1] < weightRange.max) &&
                  renderActiveBadge(
                    "weight",
                    `Trọng lượng: ${filters.weightRange[0]} - ${filters.weightRange[1]}`,
                    () =>
                      updateFilters((prev) => ({
                        ...prev,
                        weightRange: [weightRange.min, weightRange.max],
                      })),
                  )}

                {(filters.nutritionRange?.calories?.[0] > 0 ||
                  filters.nutritionRange?.calories?.[1] < 200) &&
                  renderActiveBadge(
                    "cal",
                    `Calories: ${filters.nutritionRange.calories[0]}kcal - ${filters.nutritionRange.calories[1]}kcal`,
                    () =>
                      updateFilters((prev) => ({
                        ...prev,
                        nutritionRange: {
                          ...prev.nutritionRange,
                          calories: [0, 200],
                        },
                      })),
                  )}

                {(filters.nutritionRange?.protein?.[0] > 0 ||
                  filters.nutritionRange?.protein?.[1] < 5) &&
                  renderActiveBadge(
                    "pro",
                    `Protein: ${filters.nutritionRange.protein[0]}g - ${filters.nutritionRange.protein[1]}g`,
                    () =>
                      updateFilters((prev) => ({
                        ...prev,
                        nutritionRange: {
                          ...prev.nutritionRange,
                          protein: [0, 5],
                        },
                      })),
                  )}

                {(filters.nutritionRange?.carbs?.[0] > 0 ||
                  filters.nutritionRange?.carbs?.[1] < 40) &&
                  renderActiveBadge(
                    "carbs",
                    `Carbs: ${filters.nutritionRange.carbs[0]}g - ${filters.nutritionRange.carbs[1]}g`,
                    () =>
                      updateFilters((prev) => ({
                        ...prev,
                        nutritionRange: {
                          ...prev.nutritionRange,
                          carbs: [0, 40],
                        },
                      })),
                  )}

                {filters.hasPromotion &&
                  renderActiveBadge("promo", "Có khuyến mãi", () =>
                    updateFilters((prev) => ({
                      ...prev,
                      hasPromotion: false,
                    })),
                  )}

                {filters.inStock &&
                  renderActiveBadge("stock", "Còn hàng", () =>
                    updateFilters((prev) => ({
                      ...prev,
                      inStock: false,
                    })),
                  )}
              </AnimatePresence>

              <motion.div layout>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 text-xs h-7 rounded-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Xóa tất cả
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Product Grid ─────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Search className="h-9 w-9 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6 leading-relaxed">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Hãy thử
              điều chỉnh lại bộ lọc.
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 h-10 shadow-sm"
            >
              Xóa tất cả bộ lọc
            </Button>
          </motion.div>
        ) : tab === "tab-1" ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, productIdx) =>
                product.variant.map((variantItem, variantIdx) => (
                  <motion.div
                    key={variantItem.productVariantId}
                    {...getAnimProps(
                      productIdx * product.variant.length + variantIdx,
                    )}
                    layout
                  >
                    <CardProduct
                      categories={product.categories}
                      description={product.description}
                      productId={product.id}
                      name={product.name}
                      mainImageUrl={
                        variantItem?.imageVariant || product.mainImageUrl
                      }
                      quantitySold={product.quantitySold}
                      rating={product.rating}
                      variant={variantItem}
                      type="single"
                      disabled={variantItem.stockQuantity < 1}
                    />
                  </motion.div>
                )),
              )}
            </AnimatePresence>
          </div>
        ) : tab === "tab-2" ? (
          combos.length ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {combos.map((combo, i) => (
                <motion.div key={combo.id} {...getAnimProps(i)} layout>
                  <ComboProductCard product={{ ...combo, type: "combo" }} />
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icons={[StickyNote]}
              title="Chưa có Combo sản phẩm nào!"
              description="Có vẻ như chưa có Combo sản phẩm nào hãy tải lại trang"
              className="min-w-full flex flex-col"
              action={{
                label: "Tải lại",
                onClick: () => comboRefetch(),
              }}
            />
          )
        ) : (
          tab === "tab-3" && (
            <div>
              <CustomComboBuilder productsData={filteredProducts} />
            </div>
          )
        )}
      </div>
    );
  },
);

ProductFilterSidebar.displayName = "ProductFilterSidebar";
