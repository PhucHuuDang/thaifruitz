"use client";

import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import Link from "next/link";
import { CartData } from "@/hooks/use-cart-store";
import { formatVND } from "@/lib/format-currency";
import { AdvancedColorfulBadges } from "../badge/advanced-badge";

interface CartSummaryProps {
  cart: CartData[];
  close: () => void;

  customComboPrice: number;

  numberOfCustom: number;
}

export const CartSummary = memo(
  ({ cart, customComboPrice, close, numberOfCustom }: CartSummaryProps) => {
    const { subtotal, discount, total } = useMemo(() => {
      const subtotal = cart.reduce(
        (acc, item) =>
          acc +
            // (item.variant?.promotion?.price || item.variant.price) *
            item.variant.price * item.quantityOrder! || 0,
        0
      );
      const total = cart.reduce(
        (acc, item) =>
          acc +
            (item.variant.promotion
              ? item.variant.promotion.price
              : item.variant.price) *
              item.quantityOrder! || 0,
        0
      );
      const discount = subtotal - total;

      return { subtotal, discount, total };
    }, [cart]);

    // console.log({ subtotal, customComboPrice, total, discount });

    return (
      <Card className="w-full rounded-xl shadow-lg border-0 bg-white dark:bg-slate-800 ">
        <CardHeader>
          <CardTitle>Tổng giỏ hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700 font-semibold">Tạm tính</span>
            <span className="text-base text-sky-500 font-semibold">
              {formatVND(subtotal + customComboPrice)}
            </span>
          </div>
          {discount ? (
            <div className="flex justify-between text-sm">
              <span className="text-slate-700 font-semibold">Giảm giá</span>
              <span className="text-destructive">-{formatVND(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-slate-700 font-semibold">
            <span>Tổng tiền</span>
            <AdvancedColorfulBadges
              color="blush"
              className="text-lg text-sky-500 font-semibold"
            >
              {formatVND(total + customComboPrice)}
            </AdvancedColorfulBadges>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={"/payment"} onClick={close} className="w-full">
            <ButtonCustomized
              className="w-full bg-sky-600 hover:bg-sky-400 transition-colors  duration-300 font-bold text-white"
              variant="secondary"
              size="lg"
              label={`Thanh toán (${cart.length + numberOfCustom} sản phẩm)`}
            />
          </Link>
        </CardFooter>
      </Card>
    );
  }
);

CartSummary.displayName = "CartSummary";
