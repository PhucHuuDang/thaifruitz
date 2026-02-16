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
  Search,
  Settings,
  Star,
  Tag,
  Weight,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { formatVND } from "@/lib/format-currency";
import { Dispatch, memo, SetStateAction } from "react";
import { CardProductProps } from "@/components/global-components/card/card-product";
import { Product } from "@/hooks/use-cart-store";
import { FilterTypes } from "./product-filter-sidebar";
import { Logo } from "@/components/global-components/logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { CuisineSelector } from "../_custom_select/cuisine-selector";

interface FilterSidebarProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFiltersCount: number;
  resetFilters: () => void;
  filteredProducts: Product[];
  products: Product[];
  saveCurrentFilter?: () => void;
  savedFilters?: any[];
  setSavedFilters?: Dispatch<
    SetStateAction<
      (
        | {
            id: number;
            name: string;
            filters: {
              categories: never[];
              tags: string[];
              hasPromotion: boolean;
            };
          }
        | {
            id: number;
            name: string;
            filters: {
              categories: never[];
              hasPromotion: boolean;
              tags?: undefined;
            };
          }
      )[]
    >
  >;
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

const FilterSidebar = ({
  searchQuery = "",
  handleSearchChange,
  activeFiltersCount = 0,
  resetFilters = () => {},
  filteredProducts = [],
  products = [],
  saveCurrentFilter = () => {},
  savedFilters = [],
  setSavedFilters = () => {},
  applySavedFilter = () => {},
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
}: FilterSidebarProps) => {
  const progressPercent = products.length
    ? Math.min(100, (filteredProducts.length / products.length) * 100)
    : 100;

  return (
    <ScrollArea className="h-full overflow-hidden rounded-2xl sm:rounded-3xl">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <SidebarHeader className="backdrop-blur-xl bg-white/80 rounded-t-2xl sm:rounded-t-3xl border-b border-white/20">
        <div className="sticky top-0 z-10 pb-3 pt-4 px-4 space-y-3">
          <Logo height={70} width={70} />

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors duration-200" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-9 h-10 inputStyle rounded-xl border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Tìm kiếm sản phẩm"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0 bg-white rounded-b-2xl sm:rounded-b-3xl">
        {/* ─── Filter Summary ──────────────────────────────────── */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center shadow-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Filter className="h-3.5 w-3.5 text-amber-600" />
              </motion.div>
              <h3 className="font-semibold text-sm text-stone-800">Bộ lọc</h3>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-0.5 h-5 min-w-5 rounded-full text-xs bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200/50"
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
                className="h-8 px-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-lg text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Xóa
              </Button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Sản phẩm phù hợp:</span>
                <span className="font-semibold text-slate-700">
                  {filteredProducts.length}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ─── Popular Filters ─────────────────────────────────── */}
        <div className="px-4 py-3 border-b border-border/20">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-yellow-50 flex items-center justify-center shadow-sm">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            </div>
            <span className="text-slate-700">Bộ lọc phổ biến</span>
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
                  className={`h-9 text-xs justify-between border-slate-200/60 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-300 shadow-sm transition-all duration-200 relative rounded-xl cursor-pointer ${
                    filters.tags.includes(filter.name)
                      ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700 shadow-md"
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
          className="border-b border-border/20"
        >
          {/* Categories */}
          <AccordionItem
            value="categories"
            className="border-b border-border/20"
          >
            <SidebarGroup className="py-0 bg-white">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 group transition-all duration-200 ease-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-sky-50 flex items-center justify-center shadow-sm">
                    <CircleCheck className="h-3.5 w-3.5 text-sky-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Danh mục
                  </span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down transition-all duration-300 ease-in-out">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className={`flex items-center space-x-2.5 group rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-200 border-l-2 ${
                          filters.categories.includes(category)
                            ? "bg-gradient-to-r from-amber-50/80 to-transparent border-l-amber-500"
                            : "hover:bg-slate-50 border-l-transparent"
                        }`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                          className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600 transition-colors duration-200"
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className={`flex-1 cursor-pointer text-sm transition-colors duration-200 ${
                            filters.categories.includes(category)
                              ? "font-semibold text-amber-700"
                              : "text-slate-600 group-hover:text-slate-800"
                          }`}
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Tags */}
          <AccordionItem value="tags" className="border-b border-border/20">
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 group transition-all duration-200 ease-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-green-50 flex items-center justify-center shadow-sm">
                    <Tag className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Tags
                  </span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <CuisineSelector
                      options={tags}
                      activeOptions={filters.tags.length ? filters.tags : []}
                      toggleCuisine={handleTagChange}
                      className="px-3 py-1 text-xs"
                    />
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Package Types */}
          <AccordionItem
            value="packageTypes"
            className="border-b border-border/20"
          >
            <SidebarGroup className="py-0 bg-white">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 group transition-all duration-200 ease-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-amber-50 flex items-center justify-center shadow-sm">
                    <Package className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Loại đóng gói
                  </span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-1">
                    {packageTypes.map((packageType) => (
                      <div
                        key={packageType}
                        className={`flex items-center space-x-2.5 group rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-200 border-l-2 ${
                          filters.packageTypes.includes(packageType)
                            ? "bg-gradient-to-r from-amber-50/80 to-transparent border-l-amber-500"
                            : "hover:bg-slate-50 border-l-transparent"
                        }`}
                        onClick={() => handlePackageTypeChange(packageType)}
                      >
                        <Checkbox
                          id={`package-${packageType}`}
                          checked={filters.packageTypes.includes(packageType)}
                          onCheckedChange={() =>
                            handlePackageTypeChange(packageType)
                          }
                          className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 transition-colors duration-200"
                        />
                        <Label
                          htmlFor={`package-${packageType}`}
                          className={`flex-1 cursor-pointer text-sm transition-colors duration-200 ${
                            filters.packageTypes.includes(packageType)
                              ? "font-semibold text-amber-700"
                              : "text-slate-600 group-hover:text-slate-800"
                          }`}
                        >
                          {packageType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem
            value="priceRange"
            className="border-b border-border/20"
          >
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 group transition-all duration-200 ease-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-red-50 flex items-center justify-center shadow-sm">
                    <DollarSign className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Khoảng giá
                  </span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
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
                      <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-slate-50/50 text-slate-600 min-w-0 truncate">
                        {filters.priceRange[0].toLocaleString()}đ
                      </div>
                      <div className="text-xs text-slate-400 shrink-0">—</div>
                      <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-slate-50/50 text-slate-600 min-w-0 truncate">
                        {filters.priceRange[1].toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Weight Range */}
          <AccordionItem
            value="weightRange"
            className="border-b border-border/20"
          >
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 group transition-all duration-200 ease-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-cyan-50 flex items-center justify-center shadow-sm">
                    <Weight className="h-3.5 w-3.5 text-cyan-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Trọng lượng
                  </span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
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
                      <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-slate-50/50 text-slate-600">
                        {filters.weightRange[0]}g
                      </div>
                      <div className="text-xs text-slate-400">—</div>
                      <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-slate-50/50 text-slate-600">
                        {filters.weightRange[1]}g
                      </div>
                    </div>
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Nutrition Facts */}
          <AccordionItem
            value="nutrition"
            className="border-b border-border/20"
          >
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-slate-50/80 group transition-all duration-200 ease-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-lime-50 flex items-center justify-center shadow-sm">
                    <Apple className="h-3.5 w-3.5 text-lime-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Dinh dưỡng
                  </span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-6">
                    {/* Calories */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-slate-700">
                          Calories
                        </Label>
                        <span className="text-xs text-slate-500 font-medium bg-slate-50 rounded-md px-2 py-0.5">
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
                        <Label className="text-sm font-semibold text-slate-700">
                          Protein
                        </Label>
                        <span className="text-xs text-slate-500 font-medium bg-slate-50 rounded-md px-2 py-0.5">
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
                        <Label className="text-sm font-semibold text-slate-700">
                          Carbs
                        </Label>
                        <span className="text-xs text-slate-500 font-medium bg-slate-50 rounded-md px-2 py-0.5">
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
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
        </Accordion>

        {/* ─── Toggle Filters ──────────────────────────────────── */}
        <SidebarGroup className="border-b border-border/20 py-3">
          <SidebarGroupLabel className="px-4 font-medium flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-indigo-50 flex items-center justify-center shadow-sm">
              <Settings className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Lọc thêm
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4 py-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between group rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors duration-200">
                <Label
                  htmlFor="has-promotion"
                  className={`cursor-pointer flex items-center gap-2 text-sm transition-colors duration-200 ${
                    filters.hasPromotion
                      ? "font-medium text-indigo-600"
                      : "text-slate-600 group-hover:text-slate-800"
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  Có khuyến mãi
                </Label>
                <Switch
                  id="has-promotion"
                  checked={filters.hasPromotion}
                  onCheckedChange={handlePromotionChange}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between group rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors duration-200">
                <Label
                  htmlFor="in-stock"
                  className={`cursor-pointer flex items-center gap-2 text-sm transition-colors duration-200 ${
                    filters.inStock
                      ? "font-medium text-indigo-600"
                      : "text-slate-600 group-hover:text-slate-800"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Còn hàng
                </Label>
                <Switch
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={handleInStockChange}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ─── Compare Products ─────────────────────────────────── */}
        {compareList.length > 0 && (
          <div className="border-b border-border/20 py-3">
            <h4 className="px-4 font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700">
              <div className="h-5 w-5 rounded-md bg-purple-50 flex items-center justify-center">
                <ArrowUpDown className="h-3 w-3 text-purple-500" />
              </div>
              So sánh sản phẩm ({compareList.length}/3)
            </h4>
            <div className="px-4">
              <div className="flex flex-col gap-2">
                {compareList.map((id) => {
                  const product = products.find((p) => p.id === id);
                  if (!product) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
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
                        <h5 className="text-sm font-medium truncate text-slate-700">
                          {product.name}
                        </h5>
                        <p className="text-xs text-slate-500">
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
                        className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 rounded-lg"
                        onClick={() => toggleCompare(product.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
                {compareList.length >= 2 && (
                  <Button
                    size="sm"
                    className="w-full mt-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    So sánh ngay
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Recently Viewed ─────────────────────────────────── */}
        {recentlyViewed.length > 0 && (
          <div className="border-b border-border/20 py-3">
            <h4 className="px-4 font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700">
              <div className="h-5 w-5 rounded-md bg-orange-50 flex items-center justify-center">
                <History className="h-3 w-3 text-orange-500" />
              </div>
              Đã xem gần đây
            </h4>
            <ScrollArea className="h-[120px]">
              <div className="px-4 space-y-1">
                {recentlyViewed.map((product) => {
                  if (!product) return null;

                  return (
                    <div
                      key={product.variant.productVariantId}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
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
                        <h5 className="text-sm font-medium truncate text-slate-700">
                          {product.name}
                        </h5>
                        <span className="text-xs text-slate-500">
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
      </SidebarContent>
    </ScrollArea>
  );
};

export default memo(FilterSidebar);
