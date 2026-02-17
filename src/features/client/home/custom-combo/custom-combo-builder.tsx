"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-custom-card";
import { SelectedItems } from "./select-item";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ComboDropZone } from "./combo-drop-zone";
import Image from "next/image";
import { CuisineSelector } from "@/components/custom/_custom_select/cuisine-selector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import axios from "axios";
import Cookie from "js-cookie";
import {
  Search,
  ShoppingBag,
  Sparkles,
  Filter,
  X,
  Tag,
  Check,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, ProductVariant } from "@/hooks/use-cart-store";
import { useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "@/app/key/user-key";
import {
  ComboDiscountBadge,
  ComboDiscountInfo,
} from "@/components/global-components/card/custom-combo/combo-discount-info";
import { formatVND } from "@/lib/format-currency";
import { useData } from "@/providers/data-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboItem = {
  id: string; // Using productVariantId as id
  productVariantId: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
};

export type CustomCombo = {
  comboId: string | null;
  name: string;
  comboItems: {
    productVariantId: string;
    quantity: number;
  }[];

  description?: string | null;
};

interface CustomComboBuilderProps {
  productsData: Product[];
}

export const CustomComboBuilder = memo(
  ({ productsData }: CustomComboBuilderProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<ComboItem[]>([]);
    const [comboName, setComboName] = useState<string>("Tùy chọn Combo!");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [tagSearchTerm, setTagSearchTerm] = useState<string>("");

    const [activeItem, setActiveItem] = useState<ComboItem | null>(null);

    const queryClient = useQueryClient();

    const { discountRules } = useData();

    console.log(discountRules);

    // Get unique categories from all products
    const categories = [
      { id: "all", name: "Tất cả" },
      ...Array.from(
        new Set(
          productsData
            .flatMap((product) => product.categories)
            .filter(Boolean)
            .map((category) => JSON.stringify(category)),
        ),
      ).map((categoryString) => JSON.parse(categoryString)),
    ];

    // Get unique tags from all products
    const allTags = Array.from(
      new Set(
        productsData
          .flatMap((product: Product) => product.tags)
          .filter(Boolean)
          .map((tag: string | undefined) => tag?.trim()),
      ),
    ).sort();

    // Filter tags based on search term
    const filteredTags = tagSearchTerm
      ? allTags.filter((tag) =>
          tag?.toLowerCase().includes(tagSearchTerm.toLowerCase()),
        )
      : allTags;

    useEffect(() => {
      // Initialize products from the data
      setProducts(productsData);
    }, [productsData]);

    const filteredProducts = products?.filter((product) => {
      // Filter by search term

      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      // Filter by category
      const matchesCategory =
        activeCategory === "all" ||
        product.categories.some((category) => category.id === activeCategory);

      // Filter by tags
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) =>
          product?.tags?.some(
            (productTag) =>
              productTag.trim().toLowerCase() === tag.toLowerCase(),
          ),
        );

      return matchesSearch && matchesCategory && matchesTags;
    });

    const toggleTag = (tag: string) => {
      setActiveTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    };

    const clearFilters = () => {
      setSearchTerm("");
      setActiveCategory("all");
      setActiveTags([]);
    };

    const addToCombo = (product: Product, variant: ProductVariant) => {
      const existingItemIndex = selectedItems.findIndex(
        (item) => item.productVariantId === variant.productVariantId,
      );

      if (existingItemIndex >= 0) {
        // Item already exists, increment quantity
        const updatedItems = [...selectedItems];
        updatedItems[existingItemIndex].quantity += 1;
        setSelectedItems(updatedItems);
      } else {
        // Add new item
        setSelectedItems([
          ...selectedItems,
          {
            id: variant.productVariantId, // Using productVariantId as id for dnd-kit
            productVariantId: variant.productVariantId,
            quantity: 1,
            product,
            variant,
          },
        ]);
      }

      toast.success(
        `Đã thêm ${product.name} - ${variant.packageType} vào combo`,
      );
    };

    const updateItemQuantity = (productVariantId: string, quantity: number) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        setSelectedItems(
          selectedItems.filter(
            (item) => item.productVariantId !== productVariantId,
          ),
        );
      } else {
        // Update quantity
        setSelectedItems(
          selectedItems.map((item) =>
            item.productVariantId === productVariantId
              ? { ...item, quantity }
              : item,
          ),
        );
      }
    };

    const removeItem = (productVariantId: string) => {
      setSelectedItems(
        selectedItems.filter(
          (item) => item.productVariantId !== productVariantId,
        ),
      );
    };

    // const calculateTotalPrice = () => {
    //   return selectedItems.reduce((total, item) => {
    //     const price = item.variant.promotion
    //       ? item.variant.promotion.price
    //       : item.variant.price;
    //     return total + price * item.quantity;
    //   }, 0);
    // };

    const calculateComboDiscount = (totalItems: number): number => {
      if (totalItems >= 10) return 15;
      if (totalItems >= 7) return 10;
      if (totalItems >= 5) return 6;
      return 0;
    };

    // Modify the calculateTotalPrice function to include the discount calculation
    const calculateTotalPrice = () => {
      const subtotal = selectedItems.reduce((total, item) => {
        const price = item.variant.promotion
          ? item.variant.promotion.price
          : item.variant.price;
        return total + price * item.quantity;
      }, 0);

      const totalItems = selectedItems.reduce(
        (count, item) => count + item.quantity,
        0,
      );
      const discountPercentage = calculateComboDiscount(totalItems);
      const discountAmount = (subtotal * discountPercentage) / 100;

      return {
        subtotal,
        discountPercentage,
        discountAmount,
        total: subtotal - discountAmount,
      };
    };

    // const { discountAmount, discountPercentage, subtotal, total } =
    //   calculateTotalPrice();

    // console.log({ discountAmount, discountPercentage, subtotal, total });

    const accessToken = Cookie.get("accessToken") || null;

    const handleSubmit = async () => {
      if (comboName.trim() === "") {
        toast.warning("Vui lòng nhập tên cho combo của bạn");

        return;
      }

      if (selectedItems.length === 0) {
        toast.warning("Vui lòng chọn ít nhất một sản phẩm cho combo của bạn");

        return;
      }

      const comboData: CustomCombo = {
        comboId: null,
        name: comboName,
        description: "Những sản phẩm của bạn",
        comboItems: selectedItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      };

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_URL_API}/Combos/custom`,
          comboData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        // console.log(response);

        if (response.status === 200) {
          queryClient.invalidateQueries({
            queryKey: [USER_KEY.CUSTOM_COMBO],
          });
          toast.success("Tạo combo thành công!");

          // console.log(response.data);

          setComboName("");
          setSelectedItems([]);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tạo combo. Vui lòng thử lại sau.");
      }
    };

    // Handle drag start event
    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event;
      const draggedItemId = active.id as string;

      // Find the product and variant being dragged
      const productId = draggedItemId.split("::")[0];
      const variantId = draggedItemId.split("::")[1];

      const product = products.find((p) => p.id === productId);
      const variant = product?.variant.find(
        (v) => v.productVariantId === variantId,
      );

      if (product && variant) {
        setActiveItem({
          id: draggedItemId,
          productVariantId: variant.productVariantId,
          quantity: 1,
          product,
          variant,
        });
      }
    };

    const handleComboReorder = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setSelectedItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    // Handle drag end event
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && over.id === "combo-drop-zone" && activeItem) {
        // Check if item already exists in combo
        const existingItemIndex = selectedItems.findIndex(
          (item) => item.productVariantId === activeItem.productVariantId,
        );

        if (existingItemIndex >= 0) {
          // Item already exists, increment quantity
          const updatedItems = [...selectedItems];
          updatedItems[existingItemIndex].quantity += 1;
          setSelectedItems(updatedItems);
        } else {
          // Add new item
          setSelectedItems([...selectedItems, activeItem]);
        }

        toast.success("Đã thêm vào combo");
      }

      // Reset active item
      setActiveItem(null);
    };

    const parsedValue = discountRules?.data?.value?.[0]?.value
      ? discountRules?.data?.value?.[0]?.value
      : "[]";

    console.log({ parsedValue });

    return (
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Grid Section */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter Section - Modern Glassmorphism Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm p-8">
              {/* Search and Category Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <Input
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-border/60 focus-visible:ring-primary/20 bg-background/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    onValueChange={(setValue) => setActiveCategory(setValue)}
                    value={activeCategory}
                    defaultValue="all"
                  >
                    <SelectTrigger className="w-[200px] h-12 border-border/60 bg-background/50 backdrop-blur-sm">
                      <Filter className="mr-2" size={18} />
                      <SelectValue placeholder="Lọc theo loại" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Loại của sản phẩm</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="cursor-pointer"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tag Filter Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Tag size={16} className="text-muted-foreground" />
                    Lọc theo thẻ
                  </h3>
                  <div className="flex items-center gap-2">
                    {activeTags.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {activeTags.length} đã chọn
                      </span>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-border/60 hover:bg-muted/50"
                        >
                          <Filter size={14} className="mr-1.5" />
                          {activeTags.length > 0 ? "Chỉnh sửa" : "Chọn thẻ"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="end">
                        <div className="flex flex-col max-h-[400px]">
                          {/* Search Header */}
                          <div className="p-3 border-b border-border/50">
                            <div className="relative">
                              <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={16}
                              />
                              <Input
                                placeholder="Tìm kiếm thẻ..."
                                value={tagSearchTerm}
                                onChange={(e) =>
                                  setTagSearchTerm(e.target.value)
                                }
                                className="pl-9 h-9 text-sm"
                              />
                            </div>
                          </div>

                          {/* Tag List */}
                          <ScrollArea className="flex-1 max-h-[300px]">
                            <div className="p-2 space-y-1">
                              {filteredTags.length > 0 ? (
                                filteredTags
                                  .filter(
                                    (tag): tag is string => tag !== undefined,
                                  )
                                  .map((tag) => {
                                    const isSelected = activeTags.includes(tag);
                                    return (
                                      <motion.button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={cn(
                                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                          isSelected
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "hover:bg-muted/50 text-foreground",
                                        )}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <span className="truncate">{tag}</span>
                                        {isSelected && (
                                          <Check
                                            size={16}
                                            className="ml-2 flex-shrink-0"
                                          />
                                        )}
                                      </motion.button>
                                    );
                                  })
                              ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                  Không tìm thấy thẻ nào
                                </div>
                              )}
                            </div>
                          </ScrollArea>

                          {/* Footer */}
                          {activeTags.length > 0 && (
                            <div className="p-2 border-t border-border/50">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <X size={14} className="mr-1.5" />
                                Xóa tất cả ({activeTags.length})
                              </Button>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Selected Tags Display */}
                {activeTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {activeTags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCombo={addToCombo}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20 bg-muted/30 rounded-2xl border border-border/50"
                >
                  <div className="flex flex-col items-center max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                      <Search className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Không tìm thấy sản phẩm phù hợp
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 text-center">
                      Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                      của bạn
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="border-border/60"
                    >
                      <X size={16} className="mr-2" />
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Combo Sidebar */}
          <div className="lg:col-span-4 h-full">
            <ComboDropZone>
              <div className="rounded-2xl shadow-lg p-8 sticky top-[180px] bg-card/50 backdrop-blur-md border border-border/50">
                {/* Header */}
                <div className="flex md:flex-col items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="text-primary" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Combo của bạn
                    </h2>
                  </div>

                  {selectedItems.length > 0 && (
                    <ComboDiscountBadge
                      totalItems={selectedItems.reduce(
                        (count, item) => count + item.quantity,
                        0,
                      )}
                      value={parsedValue}
                    />
                  )}
                </div>

                {/* Info Badge */}
                <div className="bg-muted/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-border/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Tạo Combo cần tối thiểu{" "}
                    <span className="font-bold text-foreground">
                      5 sản phẩm
                    </span>
                  </p>
                </div>

                {/* Combo Name Input */}
                <div className="mb-6 space-y-2">
                  <Label
                    htmlFor="combo-name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Tên combo
                  </Label>
                  <Input
                    id="combo-name"
                    placeholder="Nhập tên cho combo của bạn"
                    value={comboName}
                    onChange={(e) => setComboName(e.target.value)}
                    className="h-11 border-border/60 focus-visible:ring-primary/20 bg-background/50 backdrop-blur-sm"
                  />
                </div>

                {/* Discount Info */}
                <ComboDiscountInfo className="mb-6" value={parsedValue} />

                <Separator className="my-6 bg-border/50" />

                {/* Selected Items List */}
                <DndContext onDragEnd={handleComboReorder}>
                  <AnimatePresence mode="wait">
                    {selectedItems.length > 0 ? (
                      <motion.div
                        key="items"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <ScrollArea className="h-[400px] pr-2">
                          <SelectedItems
                            items={selectedItems}
                            onUpdateQuantity={updateItemQuantity}
                            onRemoveItem={removeItem}
                          />
                        </ScrollArea>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-center py-16 bg-muted/30 rounded-xl border border-border/30"
                      >
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                          <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          Chưa có sản phẩm nào
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Hãy thêm sản phẩm vào combo của bạn
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </DndContext>

                {/* Price Summary */}
                {selectedItems.length > 0 && (
                  <>
                    <Separator className="my-6 bg-border/50" />
                    <div className="space-y-3 mb-6">
                      {/* Subtotal */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground font-medium">
                          Tạm tính:
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatVND(calculateTotalPrice().subtotal)}
                        </span>
                      </div>

                      {/* Discount */}
                      {calculateTotalPrice().discountPercentage > 0 && (
                        <div className="flex justify-between items-center bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                          <span className="text-sm text-destructive flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>
                              Giảm giá (
                              {calculateTotalPrice().discountPercentage}%)
                            </span>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {selectedItems.reduce(
                                (count, item) => count + item.quantity,
                                0,
                              )}{" "}
                              SP
                            </span>
                          </span>
                          <span className="text-base font-bold text-destructive">
                            -{formatVND(calculateTotalPrice().discountAmount)}
                          </span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <span className="text-base font-bold text-foreground">
                          Tổng tiền:
                        </span>
                        <span className="text-3xl font-bold text-primary">
                          {formatVND(calculateTotalPrice().total)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Create Combo Button */}
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={
                    selectedItems.length === 0 ||
                    selectedItems.length < 4 ||
                    comboName.trim() === ""
                  }
                >
                  <Sparkles size={18} className="mr-2" />
                  Tạo combo ngay
                </Button>
              </div>
            </ComboDropZone>
          </div>
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="bg-white rounded-lg shadow-md p-3 w-64 opacity-90">
              <div className="flex gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-slate-50">
                  <Image
                    src={
                      activeItem.variant.imageVariant ||
                      activeItem.product.mainImageUrl
                    }
                    alt={activeItem.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-1">
                    {activeItem.product.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {activeItem.variant.packageType}
                  </p>
                  <p className="text-xs font-semibold text-green-600">
                    {formatVND(
                      activeItem.variant.promotion
                        ? activeItem.variant.promotion.price
                        : activeItem.variant.price,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
        {/* <Toaster /> */}
      </DndContext>
    );
  },
);

CustomComboBuilder.displayName = "CustomComboBuilder";
