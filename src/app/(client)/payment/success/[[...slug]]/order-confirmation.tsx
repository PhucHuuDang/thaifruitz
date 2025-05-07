"use client";

import React, { useState, useEffect, memo, useRef } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  Download,
  ArrowRight,
  Phone,
  Barcode,
  Blend,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { notFound, useSearchParams } from "next/navigation";
import {
  OrderItem as OrderItemType,
  PaymentOrderValue,
} from "@/features/client/payment/successful/payment-successful.types";
import { interactApiClient } from "@/actions/client/interact-api-client";
import { ApiResponse } from "@/types/types";
import { toast } from "sonner";
import ImprovedLoadingPage from "@/app/(client)/loading";
import { differenceDate, vietnameseDate } from "@/utils/date";
import { formatVND } from "@/lib/format-currency";
import NotFound from "@/app/not-found";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";
import { Skeleton } from "@/components/ui/skeleton";
import { orderTypeLabel } from "@/utils/label";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";
import { Balloons } from "./balloons";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Paid":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "Packaging":
      return <Package className="h-5 w-5 text-amber-500" />;
    case "Shipping":
      return <Truck className="h-5 w-5 text-sky-500" />;
    default:
      return <CheckCircle className="h-5 w-5 text-slate-700" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "Packaging":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Shipping":
      return "bg-sky-100 text-sky-800 border-sky-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const SuccessBanner = memo(() => (
  <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-6 mb-8 text-center shadow-md">
    <div className="bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center w-16 h-16 mx-auto mb-4 border-2 border-white/40">
      <CheckCircle className="h-8 w-8 text-white" />
    </div>
    <h1 className="text-2xl font-bold text-white mb-2">
      Cảm ơn bạn đã đặt hàng và tin tưởng Thaifruiz!
    </h1>
    <p className="text-white text-base max-w-xl mx-auto">
      Đơn hàng của bạn đã được xác nhận. Bên dưới là thông tin chi tiết bạn đã
      đặt hàng hãy kiểm tra lại nhé!
    </p>
  </div>
));
SuccessBanner.displayName = "SuccessBanner";

const OrderProgress = memo(({ status }: { status: string }) => {
  // Order progress steps
  const orderSteps = [
    {
      status: "Paid",
      label: "Đã thanh toán",
      icon: CreditCard,
      completed: true,
    },
    {
      status: "Packaging",
      label: "Đang gói hàng",
      icon: Package,
      completed: true,
    },
    {
      status: "Shipping",
      label: "Đang giao hàng",
      icon: Truck,
      completed: false,
    },
    {
      status: "Delivered",
      label: "Đã giao hàng",
      icon: CheckCircle,
      completed: false,
    },
  ];

  // Find current step index
  const currentStepIndex = orderSteps.findIndex(
    (step) => step.status === status
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 cardStyle">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Trạng thái đơn hàng của bạn!
      </h2>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-4 relative z-10">
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-slate-100 border-slate-200"
                  } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                >
                  <step.icon
                    className={`h-5 w-5 ${
                      isCompleted ? "text-white" : "text-slate-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-emerald-600"
                      : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
OrderProgress.displayName = "OrderProgress";

const OrderDetailsCard = memo(
  ({ order, print }: { order: PaymentOrderValue; print: () => void }) => (
    <Card className="overflow-hidden  shadow-sm mb-6 cardStyle">
      <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
              {/* <span className="text-emerald-600">#</span> */}
              <Barcode className="size-6 text-sky-500" />
              {order.orderId}
              <Badge
                className={`ml-1 text-xs px-2 py-0.5 ${getStatusColor(
                  order.status
                )}`}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 mt-1 text-slate-500 underline">
              <Calendar className="size-4" />
              {vietnameseDate(order.buyDate, true)}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            onClick={() => print()}
          >
            <Download className="h-4 w-4 mr-1.5" />
            In Hóa Đơn
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50/80 rounded-xl p-5 border cardStyle">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard className="size-6 text-emerald-500" />
              Thông tin thanh toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 t ext-sm font-semibold">
                  Phương thức thanh toán
                </span>

                <AdvancedColorfulBadges
                  color="lavender"
                  className="font-semibold"
                >
                  {order.payment?.paymentMethod}
                </AdvancedColorfulBadges>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-semibold">
                  Mã giao dịch
                </span>
                <span className="font-medium text-slate-900">
                  {order.payment.transactionNo}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm font-semibold">
                  Trạng thái
                </span>
                <span className="font-medium flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                  {getStatusIcon(order.payment.status)}
                  {order.payment.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 p-5 border cardStyle">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="size-6 text-emerald-500" />
              Thông tin giao hàng
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-900 font-bold">
                  {order.orderAddressDelivery.receiverName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="size-4.5 text-slate-900" />
                {formatVietnamesePhoneNumber(
                  order.orderAddressDelivery.receiverPhone
                )}
              </div>
              <p className="text-gray-600 text-xs font-semibold border-l-2 border-slate-600 pl-3 py-1">
                {order.orderAddressDelivery.receiverAddress}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);
OrderDetailsCard.displayName = "OrderDetailsCard";

export const CustomComboThumbnail = memo(
  ({
    images,
    height = 80,
    width = 80,
    className,
  }: {
    images: string[];
    className?: string;
    width?: number;
    height?: number;
  }) => {
    return (
      <div
        className={cn(
          "size-20 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shadow-sm group mr-4",
          className
        )}
      >
        {/* Main image */}
        <div className="absolute inset-0 z-10">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={`main-thumbnail-image`}
            width={width}
            height={height}
            sizes="(max-width: 640px) 80px, 128px"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            priority={true}
            loading="eager"
            quality={85}
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Thumbnail stack */}
        {images.length > 1 && (
          <div className="absolute right-1 bottom-1 z-20 flex flex-col-reverse gap-1">
            {images.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="h-7 w-7 rounded-sm overflow-hidden border border-white/70 shadow-sm"
                style={{
                  transform: `translateX(${index * -3}px)`,
                  zIndex: 30 - index,
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`product item  ${index + 1}`}
                    // fill
                    // className="object-cover"
                    // sizes="28px"
                    width={96}
                    height={0}
                    sizes="(max-width: 640px) 96px, 128px"
                    className="w-24 h-full object-cover transition-transform group-hover:scale-105"
                    priority={true}
                    loading="eager"
                    quality={85}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Item count indicator (if more than 3 items) */}
        {images.length > 3 && (
          <div className="absolute left-1 bottom-1 z-20">
            <div className="bg-white/90 backdrop-blur-sm text-[10px] font-medium rounded-sm px-1 shadow-sm">
              +{images.length - 3}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CustomComboThumbnail.displayName = "CustomComboThumbnail";

export const OrderItem = memo(
  ({
    item,
    className,
  }: {
    item: PaymentOrderValue["orderItems"][0];
    className?: string;
  }) => {
    const hasImages = item.customImages && item.customImages.length > 0;

    const hasDiscount = item.discountPrice < item.unitPrice;

    const discountPrice = item.discountPrice;
    const originalPrice = item.unitPrice;

    const priceItem = hasDiscount ? discountPrice : originalPrice;

    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center p-4 bg-slate-50 cardStyle ",
          className
        )}
      >
        {hasImages ? (
          <CustomComboThumbnail images={item.customImages as string[]} />
        ) : (
          <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden mr-4 mb-3 sm:mb-0 border border-slate-200">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            {item.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {/* <Badge
              variant="outline"
              className="text-xs bg-slate-100 border-slate-200 text-slate-700"
            >
              {item.itemType}
            </Badge> */}
            <AdvancedColorfulBadges
              size="sm"
              color="green"
              className="rounded-3xl text-xs font-medium"
            >
              {orderTypeLabel(item.itemType)}
            </AdvancedColorfulBadges>

            {item.percentage > 0 && (
              <Badge className="text-xs bg-rose-100 border-rose-200 text-rose-700">
                {item.percentage}% OFF
              </Badge>
            )}
          </div>
          <div className="text-sm font-semibold text-gray-700 flex items-center gap-1">
            Đơn giá:{" "}
            {hasDiscount ? (
              <div className="flex items-center gap-1">
                <span className="text-sky-500 text-base font-semibold">
                  {formatVND(item.discountPrice)}
                </span>

                <del className="text-rose-500 text-sm font-semibold">
                  {formatVND(item.unitPrice)}
                </del>
              </div>
            ) : (
              <span className="text-sky-500 text-base font-semibold">
                {formatVND(item.unitPrice)}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 sm:mt-0 text-right">
          <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200 mb-2">
            <span className="text-sm font-medium text-gray-600">
              {item.quantity} × {formatVND(priceItem)}
            </span>
          </div>
          <p className="text-base font-semibold text-sky-600">
            {formatVND(item.quantity * priceItem)}
          </p>
        </div>
      </div>
    );
  }
);
OrderItem.displayName = "OrderItem";

export const OrderItemSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-slate-50 cardStyle animate-pulse">
      <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden mr-4 mb-3 sm:mb-0 border border-slate-200">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="w-1/2 h-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="w-12 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-3/4 h-3" />
      </div>
      <div className="mt-3 sm:mt-0 text-right space-y-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-24 h-5" />
      </div>
    </div>
  );
};

const OrderItemsCard = memo(
  ({ items }: { items: PaymentOrderValue["orderItems"] }) => (
    <Card className="overflow-hidden  shadow-sm mb-6 cardStyle">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg text-slate-900 flex items-center gap-1">
          <ShoppingBag className="size-6 text-sky-500" />
          Các sản phẩm trong đơn hàng
        </CardTitle>
        <CardDescription>
          <span className="font-semibold text-sky-500 p-1 size-4 rounded-full bg-sky-50">
            {items.length}
          </span>{" "}
          sản phẩm trong đơn hàng của bạn!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="space-y-4 min-h-fit h-[250px] md:h-[300px] lg:h-[400px]">
          {items.map((item: OrderItemType) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
);
OrderItemsCard.displayName = "OrderItemsCard";

const OrderSummaryCard = memo(({ order }: { order: PaymentOrderValue }) => (
  <Card className="overflow-hidden border-slate-100 shadow-sm cardStyle">
    <CardHeader className="border-b border-slate-100 pb-4">
      <CardTitle className="text-lg text-slate-900 flex items-center gap-1">
        <Blend className="size-6 text-sky-500" />
        Tổng quan đơn hàng
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-semibold">Tạm tính:</span>
          <span className="font-bold text-sky-500">
            {formatVND(order.totalPrice)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-semibold">
              Phí vận chuyển:
            </span>
            <span className="font-bold text-sky-500">
              {formatVND(order.delivery.fee)}
            </span>
          </div>

          {order.delivery.estimateDate && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-semibold">
                Thời gian giao hàng dự kiến:
              </span>
              <span>
                Khoảng:
                {differenceDate(order.delivery.estimateDate)} ngày
              </span>
            </div>
          )}
        </div>

        {order.discountPrice && (
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-semibold">Giá giảm</span>
            <span className="font-semibold text-green-600">
              {/* -{formatVND(order.discountPrice - order.delivery.fee)} */}-
              {formatVND(order.discountPrice)}
            </span>
          </div>
        )}
        {order.pointUsed > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Tích điểm</span>
            <span className="font-semibold text-green-600">
              -{order.pointUsed}
            </span>
          </div>
        )}
        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <span className="text-slate-900 font-semibold text-xl  ">
            Tổng giá đơn hàng
          </span>
          <div className="bg-sky-50 px-4 py-2 rounded-lg border border-sky-100">
            <span className="text-xl font-bold text-sky-500">
              {formatVND(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="bg-slate-50 border-t border-slate-100 p-6">
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white"
          size="lg"
          // asChild
        >
          <Link href="/profile">Theo dõi đơn hàng</Link>
          <Truck className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-sky-600 text-sky-600 hover:bg-sky-50"
          size="lg"
          // asChild
        >
          <Link href="/">Tiếp tục mua sắm</Link>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  </Card>
));
OrderSummaryCard.displayName = "OrderSummaryCard";

export default function OrderConfirmation() {
  const [isLoaded, setIsLoaded] = useState(false);

  const balloonsRef = useRef<{ launchAnimation: () => void } | null>(null);

  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<
    PaymentOrderValue | Record<string, any>
  >({});
  const [progress, setProgress] = useState(0);

  const clearCart = useCartStore((state) => state.clearCart);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleLaunch = () => {
    if (balloonsRef.current) {
      balloonsRef.current.launchAnimation();
    }
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      const isVnPay = searchParams.has("vnp_TxnRef");
      // let apiUrl = "";

      setIsLoaded(true);

      try {
        if (isVnPay) {
          // VNPay API call
          const result = await interactApiClient.post<
            ApiResponse<PaymentOrderValue>,
            { test: string }
          >(`/Payments/vnpay-return?${searchParams.toString()}`);

          if (result?.isSuccess) {
            setOrderData(result?.value as PaymentOrderValue);
          } else {
            toast.error("Lỗi khi lấy dữ liệu đơn hàng");
          }
        } else if (searchParams.has("orderCode")) {
          // PayOS API call
          const orderCode = searchParams.get("orderCode");
          const result = await interactApiClient.get<
            ApiResponse<PaymentOrderValue>
          >(`/Payments/order-information/${orderCode}`);
          if (result?.isSuccess) {
            setOrderData(result?.value as PaymentOrderValue);
          } else {
            toast.error("Lỗi khi lấy dữ liệu đơn hàng");
          }
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi kết nối API");
      } finally {
        setIsLoaded(false);

        clearCart();
      }
    };

    fetchPaymentData();

    if (orderData.orderId && balloonsRef.current) {
      balloonsRef.current.launchAnimation();
    }
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, [searchParams, orderData.orderId]);

  if (isLoaded || !orderData.orderId) {
    return <ImprovedLoadingPage />;
  }

  // if (!searchParams.has("vnp_TxnRef") && !searchParams.has("orderCode")) {
  //   return notFound();
  // }

  const noValidParams =
    !searchParams.has("vnp_TxnRef") && !searchParams.has("orderCode");

  return (
    <div
      className="min-h-screen pt-10 bg-gradient-to-b from-emerald-50 via-white to-white"
      ref={contentRef}
    >
      {isLoaded || !orderData.orderId ? (
        <ImprovedLoadingPage />
      ) : noValidParams ? (
        <NotFound />
      ) : (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SuccessBanner />
            <OrderProgress status={orderData.status} />
            <OrderDetailsCard
              order={orderData as PaymentOrderValue}
              print={reactToPrintFn}
            />
            <OrderItemsCard items={orderData.orderItems} />
            <OrderSummaryCard order={orderData as PaymentOrderValue} />
          </div>
        </div>
      )}
      <Balloons
        ref={balloonsRef}
        type="text"
        text="🎈ThaiFruitz Cảm ơn bạn🧾"
        fontSize={110}
        color="#14532d"
        className="text-wrap"
      />
    </div>
  );

  // return (

  //   <div
  //     className="min-h-screen pt-10  bg-gradient-to-b from-emerald-50 via-white to-white"
  //     ref={contentRef}
  //   >
  //     <div className="py-8 px-4 sm:px-6 lg:px-8">
  //       <div className="max-w-4xl mx-auto">
  //         <SuccessBanner />
  //         <OrderProgress status={orderData.status} />
  //         <OrderDetailsCard
  //           order={orderData as PaymentOrderValue}
  //           print={reactToPrintFn}
  //         />
  //         <OrderItemsCard items={orderData.orderItems} />
  //         <OrderSummaryCard order={orderData as PaymentOrderValue} />
  //       </div>
  //     </div>

  //     <Balloons
  //       ref={balloonsRef}
  //       type="text"
  //       text="🎈ThaiFruitz Cảm ơn bạn🧾"
  //       fontSize={110}
  //       // color="#000000"
  //       // color="#d97706"
  //       color="#14532d"
  //       className="text-wrap"
  //     />
  //   </div>
  // );
}
