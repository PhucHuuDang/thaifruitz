"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GripVertical, Minus, Plus, X, Package } from "lucide-react";
import type { ComboItem } from "./custom-combo-builder";
import { motion, AnimatePresence } from "framer-motion";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { formatVND } from "@/lib/format-currency";

interface SelectedItemsProps {
  items: ComboItem[];
  onUpdateQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
}

interface SortableItemProps {
  item: ComboItem;
  onUpdateQuantity: (productVariantId: string, quantity: number) => void;
  onRemoveItem: (productVariantId: string) => void;
}

export function SelectedItems({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: SelectedItemsProps) {
  return (
    <motion.div layout className="space-y-3">
      <AnimatePresence>
        {items.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function SortableItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const price = item.variant.promotion
    ? item.variant.promotion.price
    : item.variant.price;

  const hasDiscount = item?.variant?.promotion !== null;
  const discountPrice = item?.variant?.promotion?.price;
  const originalPrice = item.variant.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: isDragging ? 1.03 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      ref={setNodeRef}
      style={style}
      className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:shadow-md transition-all duration-200"
    >
      {/* Drag handle */}
      <motion.div
        {...attributes}
        {...listeners}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
      >
        <GripVertical size={18} />
      </motion.div>

      <div className="flex gap-4 pl-8">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30 border border-border/30">
          <Image
            src={item.variant.imageVariant || item.product.mainImageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-grow">
              <h4 className="font-bold text-base line-clamp-1 text-foreground">
                {item.product.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.variant.packageType} • {item.variant.netWeight}g
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Package className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">
                  Đơn lẻ
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-full"
              onClick={() => onRemoveItem(item.productVariantId)}
            >
              <X size={16} />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>

          {/* Quantity Controls and Price */}
          <div className="flex justify-between items-center pt-2">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-border/60 rounded-lg overflow-hidden bg-background/50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none hover:bg-muted"
                onClick={() =>
                  onUpdateQuantity(item.productVariantId, item.quantity - 1)
                }
              >
                <Minus size={14} />
                <span className="sr-only">Giảm</span>
              </Button>

              <motion.span
                key={item.quantity}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="w-10 text-center text-sm font-semibold"
              >
                {item.quantity}
              </motion.span>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none hover:bg-muted"
                onClick={() =>
                  onUpdateQuantity(item.productVariantId, item.quantity + 1)
                }
                disabled={item.quantity >= item.variant.stockQuantity}
              >
                <Plus size={14} />
                <span className="sr-only">Tăng</span>
              </Button>
            </div>

            {/* Price Display */}
            <div className="text-right">
              {hasDiscount ? (
                <div className="space-y-0.5">
                  <motion.div
                    key={`variant-${item.productVariantId}-${item.quantity}`}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-lg text-primary"
                  >
                    {formatVND((discountPrice as number) * item.quantity)}
                  </motion.div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-muted-foreground line-through">
                      {formatVND(originalPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ) : (
                <motion.div
                  key={`variant-${item.productVariantId}-${item.quantity}`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-lg text-primary"
                >
                  {formatVND(price * item.quantity)}
                </motion.div>
              )}
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatVND(price)} × {item.quantity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
