"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Star, Plus, Info, GripVertical, Sparkles } from "lucide-react";

import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { formatVND } from "@/lib/format-currency";
import { Product, ProductVariant } from "@/hooks/use-cart-store";

interface ProductCardProps {
  product: Product;
  onAddToCombo: (product: Product, variant: ProductVariant) => void;
}

export function ProductCard({ product, onAddToCombo }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variant[0]?.productVariantId || "",
  );
  const [isHovered, setIsHovered] = useState(false);

  const selectedVariant = product.variant.find(
    (v) => v.productVariantId === selectedVariantId,
  );

  // Create a unique ID for the draggable item
  const draggableId = `${product.id}::${selectedVariantId}`;

  // Set up draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draggableId,
    data: {
      product,
      variant: selectedVariant,
    },
  });

  const handleAddToCombo = () => {
    if (selectedVariant) {
      onAddToCombo(product, selectedVariant);
    }
  };

  // Calculate the discounted price if there's a promotion
  const discountPrice = selectedVariant?.promotion?.price;
  const originalPrice = selectedVariant?.price || 0;
  const hasDiscount = selectedVariant?.promotion !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl border-border/50 group bg-card/50 backdrop-blur-sm">
        {/* Image Section with Gradient Overlay */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
          <Image
            src={selectedVariant?.imageVariant || product.mainImageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Discount Badge */}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3 right-3"
            >
              <Badge className="bg-destructive text-destructive-foreground font-semibold px-3 py-1 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1 inline" />-
                {selectedVariant?.promotion?.percentage}%
              </Badge>
            </motion.div>
          )}

          {/* Drag Handle */}
          <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-md hover:bg-background rounded-xl p-2 cursor-grab active:cursor-grabbing shadow-lg border border-border/50 transition-all"
          >
            <GripVertical size={18} className="text-muted-foreground" />
          </motion.div>

          {/* Floating Add Button (appears on hover) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <Button
              onClick={handleAddToCombo}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-all"
              disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
            >
              <Plus size={18} className="mr-2" />
              Thêm vào combo
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-6 flex-grow space-y-4">
          {/* Title and Info Button */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-muted shrink-0"
                >
                  <Info size={18} className="text-muted-foreground" />
                  <span className="sr-only">Chi tiết</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground line-clamp-2">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-muted/30">
                    <Image
                      src={product.mainImageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < product.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      Đã bán: {product.quantitySold}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {product?.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-muted text-muted-foreground hover:bg-muted/80 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                      Đóng
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < product.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              ({product.rating})
            </span>
          </div>

          {/* Variant Selector */}
          <div>
            <Select
              value={selectedVariantId}
              onValueChange={setSelectedVariantId}
            >
              <SelectTrigger className="w-full font-medium border-border/60 hover:border-border transition-colors">
                <SelectValue placeholder="Chọn loại đóng gói" />
              </SelectTrigger>
              <SelectContent>
                {product.variant.map((variant) => (
                  <SelectItem
                    key={variant.productVariantId}
                    value={variant.productVariantId}
                  >
                    {variant.packageType} - {variant.netWeight}g
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Display */}
          <div className="pt-2">
            {hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl font-bold text-primary">
                    {formatVND(discountPrice || 0)}
                  </h2>
                  <span className="text-base text-muted-foreground line-through">
                    {formatVND(originalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tiết kiệm {formatVND(originalPrice - (discountPrice || 0))}
                </p>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-primary">
                {formatVND(originalPrice)}
              </h2>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={handleAddToCombo}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all group-hover:shadow-md"
            disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
          >
            <Plus size={18} className="mr-2" />
            Thêm vào combo
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
