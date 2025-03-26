"use client";

import {
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PackageOpen,
  PackageIcon,
  Undo2,
  CircleChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus, OrderStatusEnum } from "@/types/report-orders.types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToolTipCustomized } from "@/components/custom/tool-tip-customized";
import axios from "axios";

import Cookies from "js-cookie";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { toast } from "sonner";
import { API } from "@/app/key/url";
import { useQueryClient } from "@tanstack/react-query";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;

  orderId: string;
}

const ORDER_STATUS_FLOW = [
  "pending",
  "confirmed",
  "packaging",
  "shipping",
  "delivering",
  "delivered",
  "received",
  "cancelled",
  "returned",
];

const iconSize = "size-4";

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case OrderStatusEnum.PENDING:
      return <Clock className={iconSize} />;
    case OrderStatusEnum.CONFIRMED:
      return <PackageOpen className={iconSize} />;
    case OrderStatusEnum.PACKAGING:
      return <PackageIcon className={iconSize} />;
    case OrderStatusEnum.SHIPPING:
      return <Truck className={iconSize} />;
    case OrderStatusEnum.DELIVERING:
      return <CheckCircle2 className={iconSize} />;
    case OrderStatusEnum.DELIVERED:
      return <PackageOpen className={iconSize} />;
    case OrderStatusEnum.RECEIVED:
      return <PackageOpen className={iconSize} />;
    case OrderStatusEnum.CANCELLED:
      return <XCircle className={iconSize} />;
    case OrderStatusEnum.RETURNED:
      return <Undo2 className={iconSize} />;
    default:
      return <AlertCircle className={iconSize} />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case OrderStatusEnum.PENDING:
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case OrderStatusEnum.CONFIRMED:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case OrderStatusEnum.PACKAGING:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case OrderStatusEnum.SHIPPING:
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
    case OrderStatusEnum.DELIVERING:
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
    case OrderStatusEnum.DELIVERED:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case OrderStatusEnum.RECEIVED:
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case OrderStatusEnum.CANCELLED:
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case OrderStatusEnum.RETURNED:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300";
  }
};

// Get status text
export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case OrderStatusEnum.PENDING:
      return OrderStatus.pending;
    case OrderStatusEnum.CONFIRMED:
      return OrderStatus.confirmed;
    case OrderStatusEnum.PACKAGING:
      return OrderStatus.packaging;
    case OrderStatusEnum.SHIPPING:
      return OrderStatus.shipping;
    case OrderStatusEnum.DELIVERING:
      return OrderStatus.delivering;

    case OrderStatusEnum.DELIVERED:
      return OrderStatus.delivered;
    case OrderStatusEnum.RECEIVED:
      return OrderStatus.received;

    case OrderStatusEnum.CANCELLED:
      return OrderStatus.cancelled;
    case OrderStatusEnum.RETURNED:
      return OrderStatus.returned;

    default:
      return status;
  }
};

export function OrderStatusBadge({
  status,
  className,
  orderId,
}: OrderStatusBadgeProps) {
  // Get status icon

  const statusIcon = getStatusIcon(status);
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  const getNextStatus = (currentStatus: string) => {
    const index = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (index !== -1 && index < ORDER_STATUS_FLOW.length - 1) {
      return ORDER_STATUS_FLOW[index + 1];
    }

    toast.warning("Không tìm thấy trạng thái tiếp theo để cập nhật");
    return null; // Trạng thái cuối hoặc không tìm thấy
  };

  const [isPending, setIsPending] = useState(false);

  const token = Cookies.get("accessToken");
  console.log({ token });

  const nextStatus = getNextStatus(status);

  const statusTextNext = getStatusText(nextStatus as string);
  const currentStatus = getStatusText(status as string);

  const queryClient = useQueryClient();

  const [ConfirmDialog, confirm] = useConfirm(
    "Cập nhật trạng thái đơn hàng",
    `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng từ "${currentStatus} sang "${statusTextNext}" không?`,
    isPending
  );

  const updateStatus = async () => {
    const nextStatus = getNextStatus(status);

    if (!nextStatus)
      return toast.error(
        "Không tìm thấy trạng thái tiếp theo đẻ cập nhật cho đơn hàng"
      );

    const ok = await confirm();
    setIsPending(true);

    if (!ok) {
      setIsPending(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API}/Orders/${orderId}/status`,
        { status: nextStatus, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [
            // ORDERS_KEY.ORDERS_LIST
            "order_list",
          ],
        });
        toast.success("Cập nhật trạng thái thành công");
      }
      console.log("Cập nhật thành công:", response.data);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          statusColor,
          className
        )}
      >
        {statusIcon}
        <span className="font-semibold text-sm">{statusText}</span>

        {status === OrderStatusEnum.RETURNED ||
        status === OrderStatusEnum.CANCELLED ||
        status === OrderStatusEnum.RECEIVED ? null : (
          <UpdateStatusButton
            status={statusTextNext as string}
            onClick={updateStatus}
            className="font-semibold text-sm text-slate-700"
          />
        )}
      </div>
    </>
  );
}

const UpdateStatusButton = ({
  status,
  onClick,
  className,
}: {
  status: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div>
      <ToolTipCustomized
        trigger={
          <CircleChevronRight
            className="size-5 hover:scale-110 transition duration-300"
            onClick={onClick}
          />
        }
        content={status}
        className={className}
      />
    </div>
  );
};

const statusColors = [
  "bg-amber-500",
  "bg-sky-500",
  "bg-sky-900",
  "bg-indigo-500",
  "bg-[#a21caf]",
  "bg-green-500",
  "bg-[#065f46]",
];

export const StatusBar = ({ statusStep }: { statusStep: number }) => {
  return (
    <div className="flex items-center gap-1 w-full max-w-[180px]">
      {statusColors.map((color, index) => (
        <div
          key={index}
          className={`h-1.5 w-1/4 ${index === 0 ? "rounded-l-full" : ""} ${
            index === statusColors.length - 1 ? "rounded-r-full" : ""
          } ${statusStep >= index ? color : "bg-gray-200 dark:bg-gray-700"}`}
        ></div>
      ))}
    </div>
  );
};

export const UpdateStatusButtonDropdown = ({
  orderId,
  isCancelled,
  isReturned,
  status,
}: {
  orderId: string;
  isCancelled?: boolean;
  isReturned?: boolean;
  status: string;
}) => {
  const token = Cookies.get("accessToken");

  const [isPending, setIsPending] = useState(false);

  const queryClient = useQueryClient();

  const getNextStatus = (currentStatus: string) => {
    const index = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (index !== -1 && index < ORDER_STATUS_FLOW.length - 1) {
      return ORDER_STATUS_FLOW[index + 1];
    }

    toast.warning("Không tìm thấy trạng thái tiếp theo để cập nhật");
    return null;
  };

  let nextStatus = "";

  if (!isCancelled && !isReturned) {
    nextStatus = getNextStatus(status.toLowerCase()) ?? "";
  }

  const statusTextNext = getStatusText(nextStatus);

  const statusIcon = getStatusIcon(status);
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  // const [ConfirmDialog, confirm] = useConfirm(
  //   "Cập nhật trạng thái đơn hàng",
  //   `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng từ "${statusText} sang "${statusTextNext}" không?`,
  //   isPending
  // );

  const updateStatus = async () => {
    // const ok = await confirm();

    if (!isCancelled && !isReturned && !nextStatus) {
      return toast.error(
        "Không tìm thấy trạng thái tiếp theo để cập nhật cho đơn hàng"
      );
    }

    // if (!ok) {
    //   setIsPending(false);
    //   return;
    // }

    setIsPending(true);

    try {
      const response = await axios.patch(
        `${API}/Orders/${orderId}/status`,
        {
          status: isCancelled
            ? "cancelled"
            : isReturned
            ? "returned"
            : nextStatus, // Nếu không bị hủy/trả hàng thì cập nhật trạng thái tiếp theo
          orderId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log({ response });

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [ORDERS_KEY.ORDERS_LIST],
        });
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* <ConfirmDialog /> */}

      <DropdownMenuItem
        className={`flex items-center gap-2 cursor-pointer ${statusColor} hover:${statusColor}`}
        onClick={updateStatus}
        disabled={isPending}
      >
        {statusIcon}
        <span>{isCancelled || isReturned ? statusText : statusTextNext}</span>
      </DropdownMenuItem>
    </>
  );
};
