"use client";

import { JSX, memo, useEffect, useState } from "react";
import {
  ClipboardList,
  ChevronRight,
  Info,
  Receipt,
  ShieldCheck,
  Package,
  LucideIcon,
  Loader2,
  CopyXIcon,
  FileWarningIcon,
  InfoIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CustomerInfoCard } from "./customer-infor-card";
import { Badge } from "@/components/ui/badge";
import { OrderReturnData, OrderReturnItem } from "@/types/order-detail.types";
import { RequestInfoCard } from "./requested-info-card";
import { ReturnItemCard } from "./return-exchange-item-card";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { NotData } from "@/components/global-components/no-data";
import {
  getStatusReturnExchangeStep,
  justReturnExchangeLabel,
  returnExchangeLabel,
  ReturnExchangeRequestStatus,
  statusColorMap,
} from "../return-exchange-status/status";
import { ApprovalDialog } from "./approval/approval-dialog";
import { toast } from "sonner";
import { ApprovalActions } from "./approval/approval-acitons";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { API } from "@/app/key/url";

import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { groupItemsByOrder } from "./approval/return-change-product-checked/utils";
import OrderCard from "./approval/return-change-product-checked/components/order-card";
import { ReturnExchangeOrders } from "../return-exchange-columns";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đang chờ xử lý":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "Đã duyệt":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Từ chối":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Hoàn thành":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    case "Đã hủy":
      return "bg-slate-100 text-slate-800 hover:bg-slate-100";
    default:
      return "bg-slate-100 text-slate-800 hover:bg-slate-100";
  }
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <Badge
      className={`${getStatusColor(
        status
      )} text-sm px-3 py-1 font-medium ${className}`}
    >
      {status}
    </Badge>
  );
}

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  className = "",
}: SectionHeaderProps) {
  return (
    <h3
      className={`text-base font-semibold mb-4 flex items-center gap-2 pl-1 ${className}`}
    >
      <Icon className="size-8 text-green-600" />
      {title}
    </h3>
  );
}

interface OrderReturnDetailProps {
  requestId: string;

  requestStatus: string;

  rowOriginal: ReturnExchangeOrders;
}

export const OrderReturnExchangeDetail = memo(
  ({ requestId, requestStatus, rowOriginal }: OrderReturnDetailProps) => {
    const [open, setOpen] = useState(false);

    const [returnRequestData, setReturnRequestData] = useState<
      OrderReturnItem[]
    >([]);
    const [adminNote, setAdminNote] = useState("");
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingFeeResponsibility, setShippingFeeResponsibility] =
      useState("");
    const [itemsData, setItemsData] = useState(
      returnRequestData.map((item) => ({
        returnExchangeRequestItemId: item.returnExchangeRequestItemId,
        receiveQuantity: item.receiveQuantity,
        note: "",
        acceptQuantity: item.acceptQuantity ?? 0,
      }))
    );
    const token = Cookies.get("accessToken");

    const [images, setImages] = useState<File[]>([]);

    const [expandedOrders, setExpandedOrders] = useState<
      Record<string, boolean>
    >({});
    const toggleOrderExpand = (orderId: string) => {
      setExpandedOrders((prev) => ({
        ...prev,
        [orderId]: !prev[orderId],
      }));
    };

    const orderReturnExchangeDetailData = useFetch<
      ApiResponse<OrderReturnData>
    >(`/Orders/${requestId}/return-exchange/details`, [
      `${ORDERS_KEY.RETURN_EXCHANGE}/${requestId}`,
    ]);

    const queryClient = useQueryClient();

    const safeOrderReturnData = orderReturnExchangeDetailData.data
      ?.value as OrderReturnData;

    useEffect(() => {
      if (safeOrderReturnData) {
        setReturnRequestData(safeOrderReturnData.items);
        setItemsData(
          safeOrderReturnData.items.map((item) => ({
            returnExchangeRequestItemId: item.returnExchangeRequestItemId,
            receiveQuantity: item.receiveQuantity,
            note: "",
            acceptQuantity: item.acceptQuantity ?? 0,
          }))
        );
      }
    }, [safeOrderReturnData]);

    if (orderReturnExchangeDetailData.isLoading) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
          <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      );
    }

    if (orderReturnExchangeDetailData.isError) {
      return (
        <NotData
          action={{
            label: "Thử tải lại",
            onClick: () => orderReturnExchangeDetailData.refetch(),
          }}
        />
      );
    }

    const groupedItems = groupItemsByOrder(safeOrderReturnData.items);

    const productsInCombo = groupedItems.filter(
      (item) => item.orderInfo.itemType !== "Single"
    );

    return (
      <div>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 transition-all hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
        >
          <Info className="h-4 w-4" />
          Xem chi tiết
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Sheet
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            setTimeout(() => (document.body.style.pointerEvents = ""), 100);
          }}
        >
          {/* <SheetContent className="sm:max-w-[600px] md:max-w-[800px] overflow-y-auto p-0"> */}

          <SheetContent
            className="min-w-full md:min-w-[60%] lg:min-w-[70%] rounded-3xl mr-2"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Header */}
            {safeOrderReturnData !== undefined &&
            safeOrderReturnData != null ? (
              <>
                <div className="sticky top-0 z-10 bg-white border-b p-6 pb-4 shadow-sm cardStyle">
                  <SheetHeader className="text-left">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        <ClipboardList className="size-8 text-emerald-600" />
                        Chi tiết yêu cầu{" "}
                        {justReturnExchangeLabel(requestStatus)}
                      </SheetTitle>
                      {/* <StatusBadge status={safeOrderReturnData.requestStatus} /> */}

                      <div className="flex items-center gap-2">
                        <Badge
                          className={`font-semibold text-sm ${
                            statusColorMap[
                              getStatusReturnExchangeStep(
                                safeOrderReturnData?.requestStatus
                              ) as ReturnExchangeRequestStatus
                            ]
                          } px-3 py-1 rounded-full`}
                        >
                          {returnExchangeLabel(
                            safeOrderReturnData?.requestStatus
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-700">
                      <Receipt className="h-4 w-4" />
                      Mã đơn hàng:{" "}
                      <span className="font-bold underline text-slate-700 ">
                        {safeOrderReturnData?.orderId}
                      </span>
                    </div>
                  </SheetHeader>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 space-y-8">
                  {/* Customer Information */}
                  <CustomerInfoCard user={safeOrderReturnData?.user} />

                  {/* Request Information */}
                  <div>
                    <SectionHeader
                      icon={ShieldCheck}
                      title="Thông tin yêu cầu"
                    />
                    <RequestInfoCard
                      requestData={{
                        requestDate: safeOrderReturnData?.requestDate,
                        processedDate: safeOrderReturnData?.processedDate,
                        reason: safeOrderReturnData?.reason,
                        reasonReject: safeOrderReturnData?.reasonReject,
                        reasonCancel: safeOrderReturnData?.reasonCancel,
                        note: safeOrderReturnData?.note,
                        linkDocument: safeOrderReturnData?.linkDocument,
                        shippingFeeResponsibility:
                          safeOrderReturnData?.shippingFeeResponsibility,
                      }}
                    />
                  </div>

                  {/* Items */}
                  <ScrollArea className="h-[400px] md:h-[600px] w-full ">
                    <SectionHeader icon={Package} title="Sản phẩm trả lại" />
                    <>
                      {/* Render sản phẩm Single */}
                      {safeOrderReturnData?.items
                        ?.filter((item) => item.orderItem.itemType === "Single")
                        .map((item, index) => (
                          <ReturnItemCard key={index} item={item} />
                        ))}

                      {/* Render nhóm sản phẩm Combo (không phải Single) */}
                      {productsInCombo?.map((group) => (
                        <OrderCard
                          key={group?.orderInfo?.id}
                          group={group}
                          isExpanded={!!expandedOrders[group?.orderInfo?.id]}
                          onToggleExpand={() =>
                            toggleOrderExpand(group?.orderInfo?.id)
                          }
                          requestStatus={requestStatus}
                          rowOriginal={rowOriginal}
                        />
                      ))}
                    </>
                  </ScrollArea>
                </div>

                {/* <ApprovalActions
                  totalRefundAmount={totalRefundAmount}
                  onApproveClick={handleApproveClick}
                /> */}
              </>
            ) : (
              <NotData
                action={{
                  label: "Thử tải lại",
                  onClick: () => orderReturnExchangeDetailData.refetch(),
                }}
                icons={[CopyXIcon, FileWarningIcon, InfoIcon]}
                className="min-w-full h-full"
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }
);
OrderReturnExchangeDetail.displayName = "OrderReturnExchangeDetail";
