"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Apple,
  ArrowUpDown,
  CheckCircle,
  CircleCheck,
  DollarSign,
  Filter,
  History,
  Package,
  Percent,
  Settings,
  Star,
  Tag,
  Weight,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { formatVND } from "@/lib/format-currency";
import { memo } from "react";
import { CardProductProps } from "@/components/global-components/card/card-product";
import { Product } from "@/hooks/use-cart-store";
import { FilterTypes } from "./product-filter-sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { CuisineSelector } from "../_custom_select/cuisine-selector";

interface FilterPanelProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFiltersCount: number;
  resetFilters: () => void;
  filteredProducts: Product[];
  products: Product[];
  saveCurrentFilter?: () => void;
  savedFilters?: any[];
  applySavedFilter?: (savedFilter: any) => void;
  popularFilters: any[];
  handleTagChange: (tag: string) => void;
  filters: FilterTypes;
  categories: string[];
  handleCategoryChange?: (value: string) => void;
  tags: string[];
  packageTypes: any[];
  handlePackageTypeChange: (packageType: string) => void;
  priceRange: { min: number; max: number };
  handlePriceRangeChange: (value: number[]) => void;
  weightRange: { min: number; max: number };
  handleWeightRangeChange: (value: number[]) => void;
  handleNutritionRangeChange: (nutrient: string, value: number[]) => void;
  handlePromotionChange: (checked: boolean) => void;
  handleInStockChange: (checked: boolean) => void;
  compareList?: any[];
  toggleCompare: (productVariantId: string) => void;
  recentlyViewed: CardProductProps[];
}

const FilterPanel = ({
  activeFiltersCount = 0,
  resetFilters = () => {},
  filteredProducts = [],
  products = [],
  popularFilters = [],
  handleTagChange = () => {},
  filters,
  categories = [],
  handleCategoryChange = () => {},
  tags = [],
  packageTypes = [],
  handlePackageTypeChange = () => {},
  priceRange = { min: 0, max: 100000 },
  handlePriceRangeChange = () => {},
  weightRange = { min: 0, max: 100 },
  handleWeightRangeChange,
  handleNutritionRangeChange,
  handlePromotionChange,
  handleInStockChange,
  compareList = [],
  toggleCompare = () => {},
  recentlyViewed = [],
}: FilterPanelProps) => {
  const progressPercent = products.length
    ? Math.min(100, (filteredProducts.length / products.length) * 100)
    : 100;

  return (
    <ScrollArea className="h-[calc(100vh-5rem)] overflow-hidden">
      <div className="divide-y divide-border/30">
        {/* ─── Filter Summary ──────────────────────────────────── */}
        {activeFiltersCount > 0 && (
          <div className="px-5 py-3 bg-muted/30">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Sản phẩm phù hợp:</span>
                <span className="font-semibold text-foreground">
                  {filteredProducts.length} / {products.length}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── Popular Filters ─────────────────────────────────── */}
        <div className="px-5 py-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Star className="h-3.5 w-3.5 text-chart-4 fill-chart-4" />
            </div>
            <span className="text-foreground">Bộ lọc phổ biến</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {popularFilters.map((filter) => (
              <motion.div
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-9 w-full text-xs justify-between border-border/60 hover:bg-primary/5 hover:border-primary/40 shadow-sm transition-all duration-200 relative rounded-xl cursor-pointer ${
                    filters.tags.includes(filter.name)
                      ? "bg-primary/5 border-primary/30 text-primary shadow-md"
                      : ""
                  }`}
                  onClick={() => handleTagChange(filter.name)}
                >
                  <span>{filter.name}</span>
                  <AdvancedColorfulBadges
                    color="green"
                    className="ml-1 h-5 text-[10px] rounded-full absolute -top-1.5 -right-1.5"
                  >
                    {filter.count}
                  </AdvancedColorfulBadges>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Accordion Filters ───────────────────────────────── */}
        <Accordion
          type="multiple"
          defaultValue={[
            "categories",
            "tags",
            "packageTypes",
            "priceRange",
            "weightRange",
          ]}
          className="divide-y divide-border/20"
        >
          {/* Categories */}
          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-all duration-200 ease-out">
              <div className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <CircleCheck className="h-3.5 w-3.5 text-sky-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Danh mục
                </span>
                {filters.categories.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 rounded-full text-xs bg-primary/10 text-primary border-0"
                  >
                    {filters.categories.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 py-2 space-y-1">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`flex items-center space-x-2.5 group rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-200 border-l-2 ${
                      filters.categories.includes(category)
                        ? "bg-primary/5 border-l-primary"
                        : "hover:bg-muted/50 border-l-transparent"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors duration-200"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className={`flex-1 cursor-pointer text-sm transition-colors duration-200 ${
                        filters.categories.includes(category)
                          ? "font-semibold text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Tags */}
          <AccordionItem value="tags" className="border-b-0">
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-all duration-200 ease-out">
              <div className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Tag className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Tags
                </span>
                {filters.tags.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 rounded-full text-xs bg-primary/10 text-primary border-0"
                  >
                    {filters.tags.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 py-2">
                <div className="flex flex-wrap gap-2">
                  <CuisineSelector
                    options={tags}
                    activeOptions={filters.tags.length ? filters.tags : []}
                    toggleCuisine={handleTagChange}
                    className="px-3 py-1 text-xs"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Package Types */}
          <AccordionItem value="packageTypes" className="border-b-0">
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-all duration-200 ease-out">
              <div className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Package className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Loại đóng gói
                </span>
                {filters.packageTypes.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 rounded-full text-xs bg-primary/10 text-primary border-0"
                  >
                    {filters.packageTypes.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 py-2 space-y-1">
                {packageTypes.map((packageType) => (
                  <div
                    key={packageType}
                    className={`flex items-center space-x-2.5 group rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-200 border-l-2 ${
                      filters.packageTypes.includes(packageType)
                        ? "bg-primary/5 border-l-primary"
                        : "hover:bg-muted/50 border-l-transparent"
                    }`}
                    onClick={() => handlePackageTypeChange(packageType)}
                  >
                    <Checkbox
                      id={`package-${packageType}`}
                      checked={filters.packageTypes.includes(packageType)}
                      onCheckedChange={() =>
                        handlePackageTypeChange(packageType)
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors duration-200"
                    />
                    <Label
                      htmlFor={`package-${packageType}`}
                      className={`flex-1 cursor-pointer text-sm transition-colors duration-200 ${
                        filters.packageTypes.includes(packageType)
                          ? "font-semibold text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {packageType}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="priceRange" className="border-b-0">
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-all duration-200 ease-out">
              <div className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <DollarSign className="h-3.5 w-3.5 text-red-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Khoảng giá
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 py-2">
                <div className="space-y-5">
                  <div className="pt-2">
                    <DualRangeSlider
                      value={filters.priceRange}
                      min={priceRange.min}
                      max={priceRange.max}
                      defaultValue={[priceRange.min, priceRange.max]}
                      className="pt-4"
                      onValueChange={handlePriceRangeChange}
                      step={1}
                      locales="vi-VN"
                      format={{ style: "currency", currency: " vi-VN" }}
                      label={() => <>đ</>}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium bg-muted/50 text-muted-foreground min-w-0 truncate">
                      {filters.priceRange[0].toLocaleString()}đ
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      —
                    </div>
                    <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium bg-muted/50 text-muted-foreground min-w-0 truncate">
                      {filters.priceRange[1].toLocaleString()}đ
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Weight Range */}
          <AccordionItem value="weightRange" className="border-b-0">
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-all duration-200 ease-out">
              <div className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Weight className="h-3.5 w-3.5 text-cyan-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Trọng lượng
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 py-2">
                <div className="space-y-5">
                  <div className="pt-4">
                    <DualRangeSlider
                      value={filters.weightRange}
                      min={weightRange.min}
                      max={weightRange.max}
                      className="pt-4"
                      onValueChange={handleWeightRangeChange}
                      step={1}
                      id="weight-range"
                      label={() => <>g</>}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium bg-muted/50 text-muted-foreground">
                      {filters.weightRange[0]}g
                    </div>
                    <div className="text-xs text-muted-foreground">—</div>
                    <div className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium bg-muted/50 text-muted-foreground">
                      {filters.weightRange[1]}g
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Nutrition Facts */}
          <AccordionItem value="nutrition" className="border-b-0">
            <AccordionTrigger className="flex w-full items-center justify-between px-5 py-3 hover:bg-muted/50 group transition-all duration-200 ease-out">
              <div className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-lime-500/10 flex items-center justify-center">
                  <Apple className="h-3.5 w-3.5 text-lime-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Dinh dưỡng
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-5 py-2 space-y-6">
                {/* Calories */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground">
                      Calories
                    </Label>
                    <span className="text-xs text-muted-foreground font-medium bg-muted rounded-md px-2 py-0.5">
                      {filters?.nutritionRange?.calories?.[0] || 0} –{" "}
                      {filters?.nutritionRange?.calories?.[1] || 0} kcal
                    </span>
                  </div>
                  <DualRangeSlider
                    value={filters.nutritionRange.calories}
                    min={0}
                    max={200}
                    defaultValue={[0, 200]}
                    className="pt-4 font-semibold text-xs"
                    onValueChange={(value) =>
                      handleNutritionRangeChange("calories", value)
                    }
                    step={10}
                    id="calories"
                    label={() => <>kcal</>}
                  />
                </div>

                {/* Protein */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground">
                      Protein
                    </Label>
                    <span className="text-xs text-muted-foreground font-medium bg-muted rounded-md px-2 py-0.5">
                      {filters?.nutritionRange?.protein?.[0] || 0} –{" "}
                      {filters?.nutritionRange?.protein?.[1] || 0} g
                    </span>
                  </div>
                  <DualRangeSlider
                    value={filters.nutritionRange?.protein}
                    min={0}
                    max={5}
                    step={0.5}
                    defaultValue={[0, 5]}
                    className="pt-4 font-semibold text-xs"
                    onValueChange={(value) =>
                      handleNutritionRangeChange("protein", value)
                    }
                    id="protein"
                    label={() => <>g</>}
                  />
                </div>

                {/* Carbs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground">
                      Carbs
                    </Label>
                    <span className="text-xs text-muted-foreground font-medium bg-muted rounded-md px-2 py-0.5">
                      {filters.nutritionRange?.carbs?.[0] || 0} –{" "}
                      {filters.nutritionRange?.carbs?.[1] || 0} g
                    </span>
                  </div>
                  <DualRangeSlider
                    value={filters.nutritionRange?.carbs}
                    min={0}
                    max={40}
                    step={1}
                    defaultValue={[0, 40]}
                    className="pt-4 font-semibold text-xs"
                    onValueChange={(value) =>
                      handleNutritionRangeChange("carbs", value)
                    }
                    id="carbs"
                    label={() => <>g</>}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ─── Toggle Filters ──────────────────────────────────── */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Settings className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Lọc thêm
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between group rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors duration-200">
              <Label
                htmlFor="has-promotion"
                className={`cursor-pointer flex items-center gap-2 text-sm transition-colors duration-200 ${
                  filters.hasPromotion
                    ? "font-medium text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Percent className="h-3.5 w-3.5" />
                Có khuyến mãi
              </Label>
              <Switch
                id="has-promotion"
                checked={filters.hasPromotion}
                onCheckedChange={handlePromotionChange}
              />
            </div>
            <div className="flex items-center justify-between group rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors duration-200">
              <Label
                htmlFor="in-stock"
                className={`cursor-pointer flex items-center gap-2 text-sm transition-colors duration-200 ${
                  filters.inStock
                    ? "font-medium text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Còn hàng
              </Label>
              <Switch
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={handleInStockChange}
              />
            </div>
          </div>
        </div>

        {/* ─── Compare Products ─────────────────────────────────── */}
        {compareList.length > 0 && (
          <div className="px-5 py-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
              <div className="h-5 w-5 rounded-md bg-purple-500/10 flex items-center justify-center">
                <ArrowUpDown className="h-3 w-3 text-purple-500" />
              </div>
              So sánh sản phẩm ({compareList.length}/3)
            </h4>
            <div className="flex flex-col gap-2">
              {compareList.map((id) => {
                const product = products.find((p) => p.id === id);
                if (!product) return null;

                return (
                  <div
                    key={id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/50 border border-border/40 hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={
                          product.mainImageUrl ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium truncate text-foreground">
                        {product.name}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {(
                          product.variant?.[0]?.promotion?.price ||
                          product.variant?.[0]?.price
                        ).toLocaleString()}
                        đ
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 rounded-lg"
                      onClick={() => toggleCompare(product.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
              {compareList.length >= 2 && (
                <Button size="sm" className="w-full mt-1 rounded-xl">
                  So sánh ngay
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ─── Recently Viewed ─────────────────────────────────── */}
        {recentlyViewed.length > 0 && (
          <div className="px-5 py-4">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
              <div className="h-5 w-5 rounded-md bg-orange-500/10 flex items-center justify-center">
                <History className="h-3 w-3 text-orange-500" />
              </div>
              Đã xem gần đây
            </h4>
            <ScrollArea className="h-[120px]">
              <div className="space-y-1">
                {recentlyViewed.map((product) => {
                  if (!product) return null;

                  return (
                    <div
                      key={product.variant.productVariantId}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={
                            product.mainImageUrl ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate text-foreground">
                          {product.name}
                        </h5>
                        <span className="text-xs text-muted-foreground">
                          {formatVND(
                            product.variant.promotion?.price ||
                              product.variant.price,
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default memo(FilterPanel);
