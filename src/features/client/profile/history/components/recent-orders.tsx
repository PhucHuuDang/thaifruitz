"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { orderData } from "./dummy-data";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCw } from "lucide-react";
import { vietnameseDate } from "@/utils/date";
import { getStatusText } from "@/features/manager/report-orders/order-status-badge";
import { formatVND } from "@/lib/format-currency";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { OrderItem as OrderItemTypes } from "@/features/client/payment/successful/payment-successful.types";
import { HistoryApiResponse } from "../types/history.type";
import { memo } from "react";

interface RecentOrdersProps {
  orderData: HistoryApiResponse;
}

export const RecentOrders = memo(({ orderData }: RecentOrdersProps) => {
  // Sort orders by date (newest first)
  const sortedOrders = [...orderData.value.orders]
    .sort(
      (a, b) => new Date(b.buyDate).getTime() - new Date(a.buyDate).getTime()
    )
    .slice(0, 5); // Get only the 5 most recent orders

  // Translate order status to Vietnamese
  // const translateStatus = (status: string) => {
  //   switch (status) {
  //     case "Received":
  //       return "Đã nhận";
  //     case "Shipping":
  //       return "Đang giao";
  //     default:
  //       return status;
  //   }
  // };

  return (
    <Card className="overflow-hidden cardStyle">
      <CardHeader className="bg-gradient-to-br from-orange-50 via-zinc-100 to-sky-50 flex flex-row items-center justify-between">
        <CardTitle>Đơn Hàng Gần Đây</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          Xem Tất Cả <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {sortedOrders.length > 0 ? (
          <div className="divide-y">
            {sortedOrders.map((order, index) => (
              <div
                key={index}
                className="p-6 hover:bg-amber-50/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold underline">
                      Đơn hàng ngày {vietnameseDate(order.buyDate, true)}
                    </p>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      Mã đơn #{index + 1000}
                    </p> */}
                  </div>
                  <Badge
                    variant={
                      order.orderStatus === "Shipping" ? "default" : "outline"
                    }
                    className="ml-auto"
                  >
                    {getStatusText(order.orderStatus)}
                  </Badge>
                </div>
                <div className="flex overflow-x-auto gap-3 mt-4">
                  {order.orderItems.map((item, itemIndex: number) => (
                    <OrderItem
                      // item={{id: "1", ...item}}
                      item={{
                        ...item,
                        id: item.referenceId,
                        itemType: item.itemType as
                          | "Custom"
                          | "Combo"
                          | "Single",
                      }}
                      key={item.referenceId}
                      className="min-w-[600px] w-full"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground font-semibold">
                      Số lượng: {order.orderQuantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-sky-500">
                      Tổng: {formatVND(order.totalPrice)}
                    </p>
                    {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                      <RefreshCw className="h-3.5 w-3.5" /> Mua lại
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p>Bạn chưa có đơn hàng nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RecentOrders.displayName = "RecentOrders";
