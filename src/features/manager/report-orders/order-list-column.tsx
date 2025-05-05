"use client";

import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Copy,
  Eye,
  Calendar,
  CreditCard,
  Tag,
  XCircle,
  Receipt,
  ExternalLink,
  SendToBackIcon,
  ReplaceIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CancelOrderTypes,
  OrderData,
  OrderStatusEnum,
} from "@/types/report-orders.types";
import {
  OrderStatusBadge,
  // StatusBar,
  UpdateStatusButtonDropdown,
} from "./order-status-badge";
import { formatVND } from "@/lib/format-currency";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { toast } from "sonner";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { ReturnOrderDialog } from "./return-order-dialog";
import OrderDetails from "../order-detail-components/order-detail";
import { StatusBar } from "./status-bar";
import Image from "next/image";
import { placeholderImage } from "@/utils/label";

// Update the getStatusStep function to reflect the new order flow
// Get status step
const getStatusStep = (status: string) => {
  switch (status?.toLowerCase()) {
    case OrderStatusEnum.PENDING:
      return 0;
    // case OrderStatusEnum.CONFIRMED:
    //   return 1;
    case OrderStatusEnum.PACKAGING:
      return 1;
    case OrderStatusEnum.SHIPPING:
      return 2;
    case OrderStatusEnum.DELIVERING:
      return 3;
    case OrderStatusEnum.DELIVERED:
      return 4;
    case OrderStatusEnum.RECEIVED:
      return 5;
    case OrderStatusEnum.COMPLETED:
      return 6;
    case OrderStatusEnum.CANCELLED:
      return -1;
    case OrderStatusEnum.RETURNED: // Old status name
      return 7;
    case OrderStatusEnum.EXCHANGED: // Old status name
      return 8;
    case OrderStatusEnum.REQUESTING: // Old status name
      return 9;
    default:
      return 0;
  }
};

// Get user initials
const getUserInitials = (name: string) => {
  if (!name) return "UN";
  const parts = name.split(" ");
  if (parts.length === 1) return name.substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const orderListColumns: ColumnDef<OrderData>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => {
      return <span className="font-semibold">Mã đơn hàng</span>;
    },
    cell: ({ row }) => {
      const order = row.original;
      const statusStep = getStatusStep(order.status);
      const statusColor =
        statusStep === -1
          ? "bg-red-50 text-red-600 dark:bg-red-900/20"
          : "bg-sky-50 text-sky-600 dark:bg-sky-900/20";

      return (
        <div className="flex flex-col min-w-[180px]">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${statusColor}`}>
              <Receipt className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{order.id}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Tag className="h-3 w-3 " />
                <span className="text-xs  font-light">{order.code}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
    minSize: 180,

    meta: { align: "center", export: { pdf: { header: "Mã đơn hàng" } } },
    filterFn: "filterRows",
  },

  // hading order status
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => {
      return <span className="font-semibold">Trạng thái đơn hàng</span>;
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const cancelled = row.original.cancel as CancelOrderTypes;
      const statusStep = getStatusStep(status);

      if (statusStep === -1) {
        return (
          <div className="flex flex-col">
            <AdvancedColorfulBadges
              className="flex items-center gap-1 w-fit"
              color="red"
            >
              <XCircle className="size-6 hover:scale-110 transition duration-300" />
              <span>Đã hủy</span>
            </AdvancedColorfulBadges>

            <div className="line-clamp-3 text-sm text-slate-700  mt-0.5">
              Lý do:{" "}
              <span className="text-rose-400 underline font-semibold">
                {cancelled.reason}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {cancelled.image ? (
                <Image
                  src={cancelled.image ?? placeholderImage}
                  alt={cancelled.name}
                  className="w-8 h-8 rounded-full border object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  ?
                </div>
              )}
              <div className="flex flex-col text-xs text-slate-600">
                <span className="font-semibold">{cancelled.name}</span>
                <span className="text-muted-foreground capitalize">
                  {cancelled.role}
                </span>
              </div>
              <span className="text-xs text-slate-400 ml-auto">
                {new Date(cancelled.date).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        );
      } else if (statusStep === 7) {
        return (
          <AdvancedColorfulBadges
            className="flex items-center gap-1 w-fit"
            color="rose"
          >
            <XCircle className="size-8 hover:scale-110 transition duration-300" />
            <span className="font-semibold text-base">Đã trả hàng</span>
          </AdvancedColorfulBadges>
        );
      } else if (statusStep === 8) {
        return (
          <AdvancedColorfulBadges
            className="flex items-center gap-1 w-fit"
            color="fuchsia"
          >
            <ReplaceIcon className="size-8 hover:scale-110 transition duration-300" />
            <span className="font-semibold text-base">Đã đổi sản phẩm</span>
          </AdvancedColorfulBadges>
        );
      } else if (statusStep === 9) {
        return (
          <AdvancedColorfulBadges
            className="flex items-center gap-1 w-fit"
            color="amber"
          >
            <SendToBackIcon className="size-8 hover:scale-110 transition duration-300" />
            <span className="font-semibold text-base">
              Đơn hàng yêu cầu đổi/trả
            </span>
          </AdvancedColorfulBadges>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          <OrderStatusBadge
            status={status?.toLowerCase()}
            orderId={row.original.id}
          />

          {/* <StatusBar statusStep={statusStep} /> */}
          <StatusBar statusStep={statusStep} />
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Trạng thái đơn hàng" } },
    },
    filterFn: "filterRows",
  },
  {
    id: "totalPrice",

    accessorKey: "totalPrice",
    header: ({ column }) => {
      return <span className="font-semibold">Tổng tiền</span>;
    },
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number;
      const shipFee = row.original.shipFee;
      const subtotal = totalPrice - shipFee;

      let priceTier = "low";
      if (totalPrice > 1000000) priceTier = "high";
      else if (totalPrice > 500000) priceTier = "medium";

      return (
        <div className="flex flex-col min-w-[150px]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                priceTier === "high"
                  ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                  : priceTier === "medium"
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-800/20"
              }`}
            >
              <CreditCard className="size-6 font-semibold" />
            </div>
            <span
              className={`font-bold text-xl text-sky-600 ${
                priceTier === "high"
                  ? "text-green-600"
                  : priceTier === "medium"
                  ? "text-[#a16207]"
                  : ""
              }`}
            >
              {formatVND(totalPrice)}
            </span>
          </div>
          <div className="flex flex-col mt-1 text-base text-slate-700 pl-9 gap-2">
            <div className="flex justify-between">
              <span className="font-semibold">Tiền hàng:</span>
              <span className="font-semibold text-sky-600">
                {formatVND(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phí ship:</span>
              <span className="font-semibold text-sky-600">
                {formatVND(shipFee)}
              </span>
            </div>
          </div>
        </div>
      );
    },
    sortDescFirst: true,

    meta: { align: "center", export: { pdf: { header: "Tổng tiền" } } },
    filterFn: "filterRows",
  },
  {
    id: "voucher",
    accessorKey: "voucher",
    header: ({ column }) => {
      return <span className="font-semibold">Giảm giá</span>;
    },
    cell: ({ row }) => {
      const voucher = row.original.voucher;
      const pointUsed = row.original.pointUsed;
      const hasDiscount = voucher !== null || pointUsed > 0;

      if (!hasDiscount) {
        return (
          <div className="flex items-center">
            <AdvancedColorfulBadges
              // variant="outline"
              className="text-slate-700 bg-slate-50 dark:bg-slate-800/30 font-thin"
            >
              Không có
            </AdvancedColorfulBadges>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1">
          {voucher !== null && (
            <AdvancedColorfulBadges
              className="w-fit font-thin"
              color={voucher !== null ? "indigo" : "blush"}
            >
              {voucher?.name}
            </AdvancedColorfulBadges>
          )}
          {pointUsed > 0 && (
            <AdvancedColorfulBadges
              className="w-fit font-thin"
              color={pointUsed > 0 ? "amber" : "sapphire"}
            >
              Điểm: {pointUsed} pts
            </AdvancedColorfulBadges>
          )}
        </div>
      );
    },
    meta: { align: "center", export: { pdf: { header: "Voucher" } } },
    filterFn: "filterRows",
  },
  {
    id: "user",
    accessorKey: "user",
    header: ({ column }) => {
      return <span className="font-semibold">Khách hàng</span>;
    },
    cell: ({ row }) => {
      const user = row.original.user;
      const userInitials = getUserInitials(user.name);

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 max-w-[150px] hover:underline transition duration-300 cursor-pointer">
                <Avatar className="size-14">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="truncate font-bold text-base text-sky-500 ">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1  text-violet-600">
                    <ExternalLink className="size-6" />
                    <span className="truncate font-semibold text-sm">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="text-base font-bold">{user.name}</p>
                <p className="text-sm font-semibold text-sky-500">
                  {user.email}
                </p>
                {user.phone && (
                  <p className="text-xs">
                    SĐT: {formatVietnamesePhoneNumber(user.phone)}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },

    meta: { align: "center", export: { pdf: { header: "Khách hàng" } } },
    filterFn: "filterRows",

    minSize: 250,
  },
  {
    id: "createdOnUtc",
    accessorKey: "createdOnUtc",
    header: ({ column }) => {
      return <span className="font-semibold">Ngày tạo</span>;
    },
    cell: ({ row }) => {
      const createdOnUtc = row.getValue("createdOnUtc") as string;
      const formattedDate = vietnameseDate(new Date(createdOnUtc));
      const relativeTime = formatRelativeTime(createdOnUtc);

      // Calculate how recent the order is
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(createdOnUtc).getTime()) /
          (1000 * 3600 * 24)
      );
      const isRecent = daysSince < 1;

      return (
        <div className="flex flex-col items-start  min-w-[150px]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                isRecent
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-800/20"
              }`}
            >
              <Calendar className="size-6" />
            </div>
            <span className="font-semibold text-slate-700">
              {formattedDate}
            </span>
          </div>
          <span
            className={`text-xs pl-9 mt-0.5 underline ${
              isRecent ? "text-sky-600 font-semibold" : "text-slate-700"
            }`}
          >
            {relativeTime}
            {isRecent && " ✨"}
          </span>
        </div>
      );
    },

    meta: { align: "center", export: { pdf: { header: "Ngày tạo" } } },
    filterFn: "filterRows",
  },
  // Update the actions dropdown menu to match the new status flow
  {
    id: "actions",
    header: ({ column }) => {
      return <span className="font-semibold">Thao tác</span>;
    },
    cell: ({ row }) => {
      const order = row.original;

      const status = (row.getValue("status") as string)?.toLowerCase();
      // const status = order.status.toLowerCase();

      const conditionalUpdate =
        status !== "received" &&
        status !== "cancelled" &&
        status !== "returned" &&
        status !== "completed";

      return (
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(order.code);
                  toast.success("Đã sao chép mã đơn hàng");
                }}
                className="flex items-center gap-2 cursor-pointer w-full"
                variant="outline"
              >
                <Copy className="h-4 w-4" />
                <span>Sao chép mã</span>
              </Button>
              <OrderDetails orderId={row.original.id} />
              {/* <DropdownMenuSeparator /> */}

              {/* {conditionalUpdate && (
                <UpdateStatusButtonDropdown
                  orderId={row.original.id}
                  status={status?.toLowerCase()}
                />
              )} */}

              <DropdownMenuSeparator />

              {conditionalUpdate && (
                <>
                  {/* <UpdateStatusButtonDropdown
                    orderId={row.original.id}
                    status="returned"
                    isReturned
                  /> */}

                  <ReturnOrderDialog orderId={row.original.id} />
                </>
              )}
              {conditionalUpdate && (
                <>
                  {/* <UpdateStatusButtonDropdown
                    orderId={row.original.id}
                    status="cancelled"
                    isCancelled
                  /> */}
                  <CancelOrderDialog orderId={row.original.id} />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: false },
    },
    filterFn: "filterRows",

    // enableHiding: false,
  },
];
