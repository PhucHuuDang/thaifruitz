"use client"

import Timeline, { TimelineEvent } from "@/components/global-components/timeline/timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import React, { useState } from "react";
import { OrderAddressDelivery } from "../order-tracking/shipping-info";
import { CancelDialog } from "@/components/custom/_custom-dialog/cancel-dialog";
import { API } from "@/actions/client/api-config";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { RePaymentDialog } from "@/components/custom/_custom-dialog/re-payment-dialog";

interface OrderDetailsProps {
  orderId?: string;
  orderDate?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  cancel: Cancel | null;
  delivery: Delivery | undefined;
  orderAddressDelivery: OrderAddressDelivery | undefined;
  timeline: Timeline[] | undefined;
}

interface Delivery {
  fee: number;
  estimateDate: string;
}

interface Cancel {
  cancelBy: string,
  date: string,
  reason: string
}

interface Timeline {
  status: string,
  date: string,
  details: SubTimeline[]
}

interface SubTimeline {
  statusTime: string,
  detailStatus: string,
  content: string
}

const OrderDetailInformation: React.FC<Readonly<OrderDetailsProps>> = ({
  orderId = "#983912",
  orderDate = "2025-01-16 12:00:00+00",
  orderStatus = "waiting",
  paymentStatus = "unpaid",
  paymentMethod = "Tiền mặt ",
  cancel,
  delivery,
  orderAddressDelivery,
  timeline = []
}) => {
  const [isCancel, setIsCancel] = useState<boolean>(false)
  const [orderIdPayment, setOrderIdPayment] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient();
  const orderStatusColors: Record<string, { color: string; text: string }> = {
    Pending: { color: "bg-amber-100 text-amber-800", text: "Chờ xác nhận" },
    Packaging: { color: "bg-blue-100 text-blue-800", text: "Đang đóng gói" },
    Shipping: { color: "bg-blue-100 text-blue-800", text: "Đang vận chuyển" },
    Delivered: { color: "bg-green-100 text-green-800", text: "Đã giao hàng" },
    Received: { color: "bg-green-100 text-green-800", text: "Đã nhận hàng" },
    Cancelled: { color: "bg-gray-100 text-gray-800", text: "Đã hủy" },
    Returned: { color: "bg-gray-100 text-gray-800", text: "Đã trả hàng" },
  };

  const paymentStatusColors: Record<string, { color: string; text: string }> = {
    Pending: { color: "bg-green-100 text-green-800", text: "Đã thanh toán" },
    Fail: { color: "bg-red-100 text-red-700", text: "Thanh toán thất bại" },
    Paid: { color: "bg-purple-100 text-purple-800", text: "Đã thanh toán" },
  };

  const steps: TimelineEvent[] = timeline.map((item) => ({
    title: item.status,
    date: item.date,
    completed: true,
    subEvents: item.details.map((sub) => ({
      title: sub.content,
      date: sub.statusTime
    }))
  }));

  const handleReceivedOrder = async (orderId: string) => {
    try {
      const response = await API.patch(`/Orders/${orderId}/confirm`, "")
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["OrderDetail", orderId] })
        toast.success("Xác nhận nhận hàng thành công")
      } else {
        toast.error("Xác nhận nhận hàng thất bại")
      }
    } catch (error) {
      console.log(error)
      toast.error("Lỗi hệ thống")
    }
  }
  return (
    <>
      <Card className="pt-5">
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Mã đơn:</span>
            <span className="text-gray-900 font-semibold">{orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Ngày đặt:</span>
            <span className="text-gray-900">{formatTimeVietNam(new Date(orderDate), true)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Trạng thái đơn hàng:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${orderStatusColors[orderStatus]?.color || "bg-gray-100 text-gray-800"
                }`}
            >
              {orderStatusColors[orderStatus]?.text || "Không xác định"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Trạng thái thanh toán:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentStatusColors[paymentStatus]?.color || "bg-gray-100 text-gray-800"
                }`}
            >
              {paymentStatusColors[paymentStatus]?.text || "Không xác định"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Phương thức thanh toán:</span>
            <span className="text-gray-900">{paymentMethod}</span>
          </div>
          {cancel && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Người hủy đơn:</span>
                <span className="text-gray-900">{cancel.cancelBy === "Customer" ? "Khách hàng" : "Cửa hàng"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Thời gian hủy đơn:</span>
                <span className="text-gray-900 text-right">{formatTimeVietNam(new Date(cancel.date), true)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-700 font-semibold">Lí do hủy:</span>
                <span className="text-gray-900 border p-2 rounded-md mt-2">
                  {cancel.reason}
                </span>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="space-x-5">
          {paymentStatus !== "Paid" && paymentMethod !== "ShipCode" && (
            <Button onClick={() => setOrderIdPayment(orderId)} className="w-fit px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors text-sm">
              Thanh toán ngay
            </Button>
          )}
          {orderStatus === "Received" && (
            <Button className="ml-auto" variant={"destructive"}>Hoàn trả</Button>
          )}
          {(orderStatus === "Pending" || orderStatus === "Packing") && (
            <Button className="ml-auto" onClick={() => setIsCancel(true)} variant={"destructive"}>Huỷ đơn hàng</Button>
          )}
          {orderStatus === "Delivered" && (
            <Button onClick={() => handleReceivedOrder(orderId)} className="ml-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors text-sm">
              Đã nhận hàng
            </Button>
          )}
        </CardFooter>
      </Card>
      <Card className="pt-5">
        <CardTitle className="text-center mb-8 text-2xl">
          Địa chỉ giao hàng
        </CardTitle>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Tên:</span>
            <span className="text-gray-900 font-semibold">{orderAddressDelivery?.receiverName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Số điện thoại:</span>
            <span className="text-gray-900">{orderAddressDelivery?.receiverPhone}</span>
          </div>

          <div className="flex justify-between items-start space-x-6">
            <span className="text-gray-700 font-semibold min-w-fit">Địa chỉ:</span>
            <span className="text-gray-900">{orderAddressDelivery?.receiverAddress}</span>
          </div>

          <div className="flex justify-between items-start space-x-6">
            <span className="text-gray-700 font-semibold min-w-fit">Thời gian dự tính:</span>
            <span className="text-gray-900">{formatTimeVietNam(new Date(delivery?.estimateDate ?? ""))}</span>
          </div>
        </CardContent>
        <Separator />
        <div className="w-full mx-auto py-5">
          <ScrollArea className="max-h-[500px] overflow-auto px-5">
            <Timeline
              events={steps}
              orientation="Vertical"
              classNameTimeline="h-7 w-7"
              className="w-full mr-auto"
              showIcon={false}
            />
          </ScrollArea>
        </div>
      </Card>
      {isCancel && <CancelDialog
        isOpen={isCancel}
        onClose={() => setIsCancel(false)}
        orderId={orderId}
        refreshKey={["OrderDetail", orderId]}
      />}
      {orderIdPayment && <RePaymentDialog
        isOpen={orderIdPayment !== undefined}
        onClose={() => setOrderIdPayment(undefined)}
        orderId={orderIdPayment}
      />}
    </>
  );
};

export default OrderDetailInformation;
