"use client";

import { memo, type ReactNode } from "react";
import { Heart, Share2, Leaf, Star, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  ProductDetailTypes,
  ProductVariantTypes,
} from "../product-detail.types";
import { formatDate } from "../product-lib";

interface ProductInfoProps {
  product: ProductDetailTypes;
  selectedVariant: ProductVariantTypes;
  handleToggleWishlist: () => void;
  handleShare: () => void;
  isInWishlist: boolean;
  children: ReactNode;

  numberOfReviews: number;
  overallRatingResponse: number;
}

export const ProductInfo = memo(
  ({
    product,
    selectedVariant,
    handleToggleWishlist,
    handleShare,
    isInWishlist,
    children,
    numberOfReviews,
    overallRatingResponse,
  }: ProductInfoProps) => {
    return (
      <div className="p-6 lg:p-8">
        <div className="space-y-6">
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 bg-blue-50 text-sky-700 border-blue-200 uppercase tracking-wider text-xs font-semibold"
                >
                  Sản phẩm nổi bật
                </Badge>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  {product.name}
                </h1>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={
                    isInWishlist ? "text-red-500 border-red-200 bg-red-50" : ""
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`}
                  />
                  <span className="sr-only">
                    {isInWishlist
                      ? "Xóa khỏi danh sách yêu thích"
                      : "Thêm vào danh sách yêu thích"}
                  </span>
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Chia sẻ sản phẩm</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
              >
                <Leaf className="h-3 w-3" />
                {product.tags[0]}
              </Badge>
              <Badge
                variant="outline"
                className="bg-sky-50 text-sky-700 border-sky-200"
              >
                {product.origin}
              </Badge>
              <div className="flex items-center text-amber-500">
                {/* <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-gray-200" /> */}
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < overallRatingResponse
                        ? "fill-amber-500"
                        : "fill-gray-200"
                    }`}
                  />
                ))}
                <span className="text-gray-600 text-sm ml-1">
                  ({numberOfReviews} đánh giá)
                </span>
              </div>
            </div>
          </div>

          <span className="text-slate-700 leading-relaxed ">
            {product.description}
          </span>

          {/* Delivery Estimate */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sky-700 text-sm cardStyle">
            <Truck className="h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Giao hàng tiêu chuẩn</span>
              <span className="text-normal">
                Nhận hàng vào ngày:{" "}
                {formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))}
              </span>
            </div>
          </div>

          {children}

          {/* Certifications Preview */}
          <div className="hidden lg:flex flex-wrap gap-2 mt-4">
            {product.productCertification.slice(0, 3).map((cert) => (
              <TooltipProvider key={cert.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-100 p-2 rounded-full">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{cert.name}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {product.productCertification.length > 3 && (
              <Badge variant="outline" className="rounded-full">
                +{product.productCertification.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductInfo.displayName = "ProductInfo";
