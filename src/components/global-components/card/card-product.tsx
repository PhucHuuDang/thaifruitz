"use client";

import StatusButton from "@/components/custom/_custom-button/status-button";
import { formatVND } from "@/lib/format-currency";
import { truncate } from "lodash";
import Image from "next/image";
import { AdvancedColorfulBadges } from "../badge/advanced-badge";
import {
  CategoryTypes,
  ProductVariant,
  useCartStore,
} from "@/hooks/use-cart-store";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { Package, Star, Weight, Eye } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export interface CardProductProps {
  variant: ProductVariant;
  productId: string;
  name: string;
  description: string;
  mainImageUrl: string;
  quantitySold: number;
  rating: number;
  categories: CategoryTypes[];
  type: string;
  disabled?: boolean;
}

export const CardProduct = ({
  variant,
  productId,
  name,
  description,
  mainImageUrl,
  rating,
  categories,
  quantitySold,
  type = "single",
  disabled,
}: CardProductProps) => {
  const addOrder = useCartStore((state) => state.addOrder);
  const [isHovered, setIsHovered] = useState(false);

  const discountPrice = variant?.promotion?.price;
  const discountPercent = variant?.promotion?.percentage;
  const stockStatus =
    variant.stockQuantity === 0
      ? "Hết hàng"
      : variant.stockQuantity < 10
        ? "Sắp hết"
        : "Còn hàng";

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-3 w-3 fill-amber-400/50 text-amber-400" />,
        );
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <Link
      href={`/product/${productId}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block w-full h-full"
    >
      <CardContainer
        className="inter-var cursor-pointer w-full motion-preset-pop transition-all duration-300"
        containerClassName="py-0 w-full h-full"
      >
        <CardBody className="relative backdrop-blur-xl bg-white/60 border border-white/20 rounded-2xl group/card hover:shadow-2xl hover:shadow-amber-500/10 dark:bg-black/40 dark:border-white/10 w-full h-full p-4 transition-all duration-300 hover:scale-[1.02]">
          {/* Discount Badge - Top Left with Glow */}
          {discountPercent && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-2 -left-2 z-50"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-md opacity-60" />
                <AdvancedColorfulBadges
                  className="relative shadow-lg"
                  color="blush"
                  size="lg"
                >
                  -{discountPercent}%
                </AdvancedColorfulBadges>
              </div>
            </motion.div>
          )}

          {/* Stock Status - Top Right */}
          <div className="absolute top-3 right-3 z-40">
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md ${
                stockStatus === "Hết hàng"
                  ? "bg-red-500/80 text-white"
                  : stockStatus === "Sắp hết"
                    ? "bg-amber-500/80 text-white"
                    : "bg-emerald-500/80 text-white"
              }`}
            >
              {stockStatus}
            </div>
          </div>

          {/* Image with Quick View Overlay */}
          <CardItem
            translateY={6}
            translateZ={6}
            className="relative z-10 w-full overflow-hidden rounded-xl"
          >
            <div className="relative group/image">
              <Image
                src={mainImageUrl ?? ""}
                alt={`${variant?.packageType} - ${name}`}
                width={400}
                height={240}
                className="h-48 w-full object-cover rounded-xl transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-1"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
                quality={85}
              />

              {/* Quick View Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl flex items-center justify-center"
              >
                <div className="flex items-center gap-2 text-white text-sm font-medium backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <Eye className="h-4 w-4" />
                  <span>Xem nhanh</span>
                </div>
              </motion.div>
            </div>
          </CardItem>

          {/* Product Name */}
          <CardItem
            translateX={10}
            translateY={10}
            className="text-stone-800 text-base font-semibold mt-3 dark:text-neutral-300 line-clamp-2 leading-snug"
            as="h3"
          >
            {name}
          </CardItem>

          {/* Rating */}
          <CardItem
            translateX={10}
            translateY={10}
            className="flex items-center gap-1.5 mt-2"
          >
            <div className="flex items-center gap-0.5">{renderStars()}</div>
            <span className="text-xs text-slate-600 font-medium">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">
              ({quantitySold} đã bán)
            </span>
          </CardItem>

          {/* Categories */}
          <CardItem
            translateX={10}
            translateY={10}
            className="flex flex-wrap gap-1.5 mt-2"
          >
            {categories.slice(0, 2).map((category) => (
              <div
                key={category.id}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50/80 text-emerald-700 backdrop-blur-sm border border-emerald-100/50"
              >
                {category.name}
              </div>
            ))}
            {categories.length > 2 && (
              <div className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50/80 text-slate-600 backdrop-blur-sm border border-slate-100/50">
                +{categories.length - 2}
              </div>
            )}
          </CardItem>

          {/* Package Type & Weight - Combined Row */}
          <CardItem
            translateX={10}
            translateY={12}
            className="flex items-center gap-3 mt-2 text-xs text-slate-600"
          >
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-amber-500" />
              <span className="font-medium">{variant.packageType}</span>
            </div>
            <div className="h-3 w-px bg-slate-300" />
            <div className="flex items-center gap-1">
              <Weight className="h-3 w-3 text-sky-500" />
              <span className="font-medium text-sky-600">
                {variant.netWeight}g
              </span>
            </div>
          </CardItem>

          {/* Description */}
          <CardItem
            translateX={10}
            translateY={12}
            className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed"
          >
            {truncate(description, { length: 80 })}
          </CardItem>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-slate-200/50">
            <CardItem
              translateY={10}
              translateZ={20}
              className="flex flex-col gap-0.5"
            >
              {discountPrice ? (
                <>
                  <CardItem
                    translateY={10}
                    translateZ={10}
                    as="del"
                    className="text-xs text-slate-400 line-through"
                  >
                    {formatVND(variant?.price ?? 0)}
                  </CardItem>
                  <CardItem
                    translateY={10}
                    translateZ={10}
                    as="div"
                    className="text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent group-hover/card:from-amber-600 group-hover/card:to-yellow-700 transition-all duration-300"
                  >
                    {formatVND(discountPrice)}
                  </CardItem>
                </>
              ) : (
                <CardItem
                  translateY={10}
                  translateZ={10}
                  className="text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent group-hover/card:from-amber-600 group-hover/card:to-yellow-700 transition-all duration-300"
                >
                  {formatVND(variant?.price ?? 0)}
                </CardItem>
              )}
            </CardItem>

            <CardItem translateY={10} translateZ={10} as="div">
              <StatusButton
                handleAddToCart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addOrder({
                    id: productId,
                    description,
                    name,
                    mainImageUrl: variant.imageVariant as string,
                    quantitySold,
                    rating,
                    categories,
                    variant: variant,
                    type,
                  });
                }}
                disabled={disabled}
              />
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </Link>
  );
};
