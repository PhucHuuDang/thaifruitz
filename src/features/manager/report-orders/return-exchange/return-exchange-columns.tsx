"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarcodeIcon,
  Calendar,
  CircleXIcon,
  ExternalLink,
  LinkIcon,
  ListCheckIcon,
  MoreHorizontal,
  TextIcon,
  User,
  UserIcon,
  UserRoundCogIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials, placeholderImage } from "@/utils/label";
import { LinkPreview } from "@/components/global-components/link-preview";
import { OrderReturnExchangeDetail } from "./components/order-return-exchange-detail";
import {
  getStatusReturnExchangeStep,
  returnExchangeLabel,
  ReturnExchangeRequestStatus,
  statusColorMap,
} from "./return-exchange-status/status";
import {
  returnExchangeStatusIcon,
  UpdateReturnExchangeStatus,
} from "./return-exchange-status/update-status";
import { ReturnExchangeStatusBar } from "./return-exchange-status/return-exchange-status-bar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ApprovalDialogTrigger } from "./components/approval/approval-dialog-trigger";
import { RejectRequestReturnExchangeDialog } from "./components/cancel-censor-order";

export type ReturnExchangeOrders = {
  id: string;
  orderId: string;
  user: {
    name: string;
    role: string;
    email: string;
    phone: string | null;
    avatar: string;
  } | null;

  handler: {
    name: string;
    role: string;
    email: string;
    phone: string | null;
    avatar: string;
  } | null;
  requestType: string;
  requestStatus: string;
  reason: string;
  reasonReject: string | null;
  reasonCancel: string | null;
  linkDocument: string;
  requestDate: string;
  processedDate: string | null;
};

export const returnExchangeColumns: ColumnDef<ReturnExchangeOrders>[] = [
  {
    id: "Mã đơn hàng",
    accessorKey: "orderId",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <BarcodeIcon className="size-6" />
            Mã đơn hàng
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const orderId = row.original.orderId;

      return <div className="font-semibold">{orderId}</div>;
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Mã đơn hàng" } },
    },
  },
  {
    id: "Khách hàng",
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <UserIcon className="size-6" />
            Khách hàng
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user;

      if (!user) return <div>—</div>;

      return (
        <div className="flex  gap-3">
          <Avatar className="size-14">
            <AvatarImage
              src={user.avatar || placeholderImage}
              alt={user.name}
            />
            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-sky-500 text-base">
              {user.name}
            </span>
            <span className="text-xs text-slate-700 font-semibold">
              {user.email}
            </span>
          </div>
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Khách hàng" } },
    },
  },

  {
    id: "Loại yêu cầu",
    accessorKey: "requestStatus",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <ListCheckIcon className="size-6" />
            Loại yêu cầu
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const rowData = row.original;

      if (rowData.requestStatus === "rejected") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-sm font-semibold">
              {rowData.reasonReject}
            </Badge>
          </div>
        );
      } else if (rowData.requestStatus === "cancelled") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-sm font-semibold">
              {rowData.reasonCancel}
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                statusColorMap[
                  getStatusReturnExchangeStep(
                    rowData?.requestStatus?.toLowerCase()
                  ) as ReturnExchangeRequestStatus
                ]
              )}
            >
              <div className="flex items-center gap-1 font-semibold text-base">
                {returnExchangeStatusIcon(
                  rowData?.requestStatus?.toLowerCase()
                )}

                <span className="text-base">
                  {returnExchangeLabel(
                    rowData?.requestStatus?.toLowerCase() as string
                  )}
                </span>
              </div>
              {rowData?.requestStatus?.toLowerCase() === "processing" ||
                (rowData?.requestStatus?.toLowerCase() !== "completed" && (
                  <UpdateReturnExchangeStatus
                    status={rowData?.requestStatus as string}
                    requestId={rowData.id}
                  />
                ))}
            </div>
          </div>

          <ReturnExchangeStatusBar status={rowData?.requestStatus as string} />
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Loại yêu cầu" } },
    },
  },

  {
    id: "Lý do",
    accessorKey: "reason",
    header: ({}) => {
      return (
        <div className="flex items-center gap-2 font-semibold">
          <TextIcon className="size-6" />
          Lý do
        </div>
      );
    },
    cell: ({ row }) => {
      const reason = row.original.reason as string;

      return (
        <div
          className="max-w-[200px] font-semibold truncate underline"
          title={reason}
        >
          {reason}
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Lý do" } },
    },
  },

  {
    id: "Ngày yêu cầu",
    accessorKey: "requestDate",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="size-6" />
            Ngày yêu cầu
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const requestDate = row.original.requestDate as string;

      return (
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Calendar className="size-6" />
            {vietnameseDate(requestDate, true)}
          </div>

          <span className="text-sm text-sky-500 font-semibold underline">
            {formatRelativeTime(requestDate)}
          </span>
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Ngày yêu cầu" } },
    },
  },
  {
    id: "Ngày xử lý",
    accessorKey: "processedDate",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="size-6" />
            Ngày xử lý
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const processedDate = row.original.processedDate as string | null;

      return (
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Calendar className="size-6" />
          {processedDate ? (
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                {vietnameseDate(processedDate, true)}
              </div>

              <span className="text-sm text-sky-500 font-semibold underline">
                {formatRelativeTime(processedDate)}
              </span>
            </div>
          ) : (
            <span className="text-slate-700 font-semibold">
              Chưa được xử lý
            </span>
          )}
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Ngày xử lý" } },
    },
  },
  {
    id: "Người xử lý",
    accessorKey: "handler",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <UserRoundCogIcon className="size-6" />
            Người xử lý
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const handler = row.original.handler;

      // const orriginal = row.original;

      return (
        <div className="flex items-center gap-2">
          {handler ? (
            <div className="flex  gap-3">
              <Avatar className="size-14">
                <AvatarImage
                  src={handler.avatar || placeholderImage}
                  alt={handler.name}
                />
                <AvatarFallback>{getUserInitials(handler.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sky-500 text-base">
                  {handler.name}
                </span>
                <span className="text-xs text-slate-700 font-semibold">
                  {handler.email}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-slate-700 font-semibold flex items-center gap-1">
              <User className="h-4 w-4" />
              Chưa được xử lý
            </span>
          )}
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Người xử lý" } },
    },
  },

  {
    id: "Lý do từ chối",
    accessorKey: "reasonReject",
    header: ({}) => {
      return (
        <div className="flex items-center gap-2 font-semibold">
          <CircleXIcon className="size-6" />
          Lý do từ chối
        </div>
      );
    },
    cell: ({ row }) => {
      const reason = row.original?.reasonReject as string | null;

      return reason ? (
        <div
          className=" text-violet-500 font-semibold line-clamp-3 underline"
          title={reason}
        >
          {reason}
        </div>
      ) : (
        <span className="text-slate-500 font-semibold text-base">---</span>
      );
    },
    meta: {
      align: "center",
      export: {
        pdf: { header: "Lý do từ chối" },
        csv: { header: "Lý do từ chối" },
      },
    },
  },

  {
    id: "linkDocument",
    accessorKey: "linkDocument",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <LinkIcon className="size-6" />
            Tài liệu chứng minh
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const linkDocument = row.original.linkDocument as string;

      return linkDocument ? (
        <LinkPreview
          url={linkDocument}
          target="_blank"
          className="text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 text-sm font-medium group"
        >
          <ExternalLink className="size-5" />
          Xem tài liệu
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </LinkPreview>
      ) : (
        <span className="text-slate-500 font-semibold text-base">---</span>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Tài liệu chứng minh" } },
    },
  },

  {
    id: "Phê duyệt",
    // accessorKey: "",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <UserRoundCogIcon className="size-6" />
            Phê duyệt
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const censor = row.original;

      return censor.requestStatus?.toLowerCase() === "processing" ? (
        <ApprovalDialogTrigger requestId={censor.id} rowOriginal={censor} />
      ) : (
        ""
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Phê duyệt" } },
    },
  },

  {
    id: "Hành động",
    cell: ({ row }) => {
      const request = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở tùy chọn</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Button
              className="w-full"
              variant="link"
              onClick={() => {
                navigator.clipboard.writeText(request.id);

                toast.success("ID đơn hàng đã được sao chép vào clipboard");
              }}
            >
              Copy ID Đơn hàng
            </Button>
            <DropdownMenuSeparator />
            {request.linkDocument && (
              <DropdownMenuItem>
                <Link
                  href={request.linkDocument}
                  target="_blank"
                  className="flex items-center w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem document
                </Link>
              </DropdownMenuItem>
            )}
            {/* <DropdownMenuItem>View details</DropdownMenuItem> */}

            <OrderReturnExchangeDetail
              requestId={request.id}
              requestStatus={request.requestStatus}
              rowOriginal={request}
            />

            {request?.requestStatus !== "Completed" &&
              request?.requestStatus !== "Cancelled" && (
                <RejectRequestReturnExchangeDialog requestId={request.id} />
              )}

            {/* <ApprovalDialogTrigger requestId={request.id} 
            
            rowOriginal={request}
            /> */}
            {/* {request.requestStatus === "Pending" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Assign to me</DropdownMenuItem>
                <DropdownMenuItem>Approve request</DropdownMenuItem>
                <DropdownMenuItem>Reject request</DropdownMenuItem>
              </>
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },

    meta: { align: "center", export: false },
    filterFn: "filterRows",
  },
];
