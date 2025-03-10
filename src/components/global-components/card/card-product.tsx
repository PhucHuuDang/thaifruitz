"use client";

import StatusButton from "@/components/custom/_custom-button/status-button";
import { formatNumberWithUnit, formatVND } from "@/lib/format-currency";
import { truncate } from "lodash";
import Image from "next/image";
import { AdvancedColorfulBadges } from "../badge/advanced-badge";
import { cartActions } from "@/actions/cart/use-cart";
import { CART_KEY } from "@/app/key/comm-key";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteProduct } from "@/actions/favorite";
import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/features/client/sidebar-filter/sidebar-filter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface CardProductProps extends Product {
  isFavorite: boolean;
}

export const CardProduct = ({ ...props }: CardProductProps) => {
  const { id, name, mainImageUrl, variant, isFavorite, rating, quantitySold } =
    props;
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["authUser"] });
  const [isFavourite, setIsFavourite] = useState<boolean>(isFavorite);
  const { isPending, mutate: favoriteMutation } = useMutation({
    mutationFn: async () => {
      try {
        if (!user) {
          throw new Error("Vui lòng đăng nhập");
        }
        const response = await favoriteProduct({ productId: id });
        if (!response?.isSuccess) {
          if (response?.status === 401) {
            throw new Error("Vui lòng đăng nhập");
          }
          throw new Error("Lỗi hệ thống");
        }
      } catch (error: unknown) {
        throw new Error(
          error instanceof Error ? error?.message : "Lỗi hệ thống"
        );
      }
    },
    onSuccess: () => {
      toast.success(
        !isFavourite
          ? "Đã thêm vào danh sách yêu thích"
          : "Đã gỡ khỏi danh sách yêu thích"
      );
      setIsFavourite(!isFavourite);
      queryClient.invalidateQueries({ queryKey: ["list", "favorites"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="w-full relative md:min-w-72 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm  hover:cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl">
      <button
        onClick={() => favoriteMutation()}
        className="absolute z-10 top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
      >
        <Heart
          className={`size-6 transition ${
            isFavourite
              ? "fill-green-500 text-green-500"
              : "text-gray-500 dark:text-gray-400"
          } ${isPending ? "animate-spin" : ""}`}
        />
      </button>
      {variant?.promotion && (
        <div className="absolute top-0 left-0 flex items-center px-3 py-2 bg-red-500 text-white text-sm font-bold rounded-tl-lg rounded-br-lg shadow">
          <span>{variant?.promotion.percentage}%</span>
        </div>
      )}
      <CardHeader className="p-5">
        <Image
          src={mainImageUrl}
          alt={`Image of ${name}`}
          height="1000"
          width="1000"
          className="h-60 w-full object-contain rounded-t-xl"
        />
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {truncate(name, { length: 60 })}
          </h1>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ⭐ {rating ?? 0}{" "}
            <span className="text-gray-400 dark:text-gray-500">|</span>{" "}
            {quantitySold} đã bán
          </p>
        </div>
      </CardContent>

      {variant && (
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            {variant?.promotion ? (
              <>
                <del className="text-gray-500 dark:text-gray-400 text-base">
                  {formatVND(
                    variant.price -
                      variant.price * (variant.promotion.percentage / 100)
                  )}
                </del>
                <h2 className="text-lg font-bold text-red-600 dark:text-red-500">
                  {formatVND(variant.price)}
                </h2>
              </>
            ) : (
              <h2 className="text-lg font-bold text-red-600 dark:text-red-500">
                {formatVND(variant?.price)}
              </h2>
            )}
          </div>

          <StatusButton
            handleAddToCart={() => {
              cartActions.addToCart({
                itemType: "single",
                referenceId: variant.productVariantId,
                quantity: 1,
              });
              queryClient.invalidateQueries({ queryKey: [CART_KEY.CARTS] });
            }}
          />
        </CardFooter>
      )}
    </Card>
  );
};
