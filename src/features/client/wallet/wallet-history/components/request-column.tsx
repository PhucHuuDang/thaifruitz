"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import {
  ArrowUpDown,
  Banknote,
  BarcodeIcon,
  Calendar,
  Clock,
  Copy,
  Eye,
  FileText,
  ImageIcon,
  LandmarkIcon,
  MoreHorizontal,
  SquareChartGanttIcon,
  StickyNoteIcon,
  ViewIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { formatVND } from "@/lib/format-currency";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { placeholderImage } from "@/utils/label";
import { CancelWithdrawalDialog } from "./actions/cancel-request";
import { formatAccountNumber } from "../../wallet-lib/transaction";
import ImagePreview from "@/components/custom/_custom-image/image-preview";

export type WithdrawalRequest = {
  id: string;
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  recipientName: string;
  bankLogo: string;
  createdOnUtc: string;
  requestWithdrawalType: "Pending" | "Rejected" | "Refunded" | "Cancelled";
  note: string | null;
  image: string | null;
  reason: string | null;
  processedAt: string | null;
};

// Hàm lấy màu cho trạng thái
const getStatusConfig = (status: string) => {
  switch (status) {
    case "Pending":
      return {
        color:
          "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 p-2",
        icon: "⏳",
        label: "Đang xử lý",
      };
    case "Rejected":
      return {
        color:
          "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 p-2",
        icon: "❌",
        label: "Từ chối",
      };
    case "Refunded":
      return {
        color:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 p-2",
        icon: "✅",
        label: "Đã hoàn tiền",
      };

    case "Cancelled":
      return {
        color:
          "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 p-2",
        icon: "❌",
        label: "Hủy yêu cầu",
      };
    default:
      return {
        color:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 p-2",
        icon: "🔄",
        label: status,
      };
  }
};

// Hàm copy text vào clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const requestHistoryColumns: ColumnDef<WithdrawalRequest>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <BarcodeIcon className="size-5 mr-1" />
          <span className="font-semibold text-slate-700">Mã yêu cầu</span>
          {/* <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-500" /> */}
        </div>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const shortId = id.substring(0, 8);

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-slate-700">
                  {shortId}...
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700"
                  onClick={() => {
                    copyToClipboard(id);
                    toast.success("Đã sao chép mã yêu cầu vào clipboard");
                  }}
                >
                  <Copy className="size-4" />
                  <span className="sr-only">Copy ID</span>
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">{id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Mã yêu cầu" }, csv: { header: "Mã yêu cầu" } },
    },
  },
  {
    id: "bankName",
    accessorKey: "bankName",
    header: () => (
      <div className="flex items-center justify-start">
        <LandmarkIcon className="size-5 mr-1 text-slate-700" />
        <span className="font-semibold text-slate-700">Ngân hàng</span>
      </div>
    ),
    cell: ({ row }) => {
      const bankName = row.getValue("bankName") as string;
      const bankLogo = row.original?.bankLogo;
      const bankAccountNumber = row.original.bankAccountNumber;
      const recipientName = row.original?.recipientName?.trim();

      return (
        <div className="flex items-center space-x-3">
          <div className="relative size-12 overflow-hidden rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
            <Image
              src={bankLogo || placeholderImage}
              alt={bankName}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-semibold text-base text-sky-500">{bankName}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-slate-700 line-clamp-2 max-w-[120px] font-semibold">
                    {formatAccountNumber(bankAccountNumber)}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-base">
                    <p className="font-semibold">{recipientName}</p>
                    <p className="text-semibold text-sky-500">
                      {formatAccountNumber(bankAccountNumber)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Ngân hàng" }, csv: { header: "Ngân hàng" } },
    },
    minSize: 700,
    size: 700,
  },

  {
    id: "requestWithdrawalType",
    accessorKey: "requestWithdrawalType",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <SquareChartGanttIcon className="size-5 mr-1 text-slate-700" />
          <span className="font-semibold text-slate-700">Trạng thái</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("requestWithdrawalType") as string;
      const config = getStatusConfig(status);

      const reason = row.original.reason;

      return (
        <div className="flex flex-col items-center gap-1">
          <Badge
            variant="outline"
            className={`${config.color} font-semibold px-2.5 py-0.5 flex items-center gap-1`}
          >
            <SquareChartGanttIcon className="size-4 mr-1 text-slate-700 text-sm" />
            <span className="mr-1">{config.icon}</span>
            {config.label}
          </Badge>

          {reason && (
            <span className={`italic text-xs font-semibold text-slate-800`}>
              {reason}
            </span>
          )}
        </div>
      );
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
    meta: {
      align: "center",
      export: { pdf: { header: "Trạng thái" }, csv: { header: "Trạng thái" } },
    },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <Banknote className="mr-1" />

          <span className="font-semibold text-slate-700">Số tiền</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));

      return (
        <div className="font-semibold text-sky-500 flex items-center gap-1">
          <Banknote className="mr-1" />
          {formatVND(amount)}
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Số tiền" }, csv: { header: "Số tiền" } },
    },
  },

  {
    id: "note",
    accessorKey: "note",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <StickyNoteIcon className="mr-1" />

          <span className="font-semibold text-slate-700">Ghi chú</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const note = row.getValue("note") as string;

      return (
        note && (
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <StickyNoteIcon className="mr-1" />
            {note}
          </span>
        )
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Ghi chú" }, csv: { header: "Ghi chú" } },
    },
  },

  {
    id: "image",
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          <ImageIcon className="mr-1" />

          <span className="font-semibold text-slate-700">Ảnh đính kèm</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;

      return (
        imageUrl && (
          // <Image
          //   src={imageUrl}
          //   alt={`Ảnh đính kèm từ quản lý ${row.original.id}`}
          //   width={60} // kích thước nhỏ gọn cho bảng
          //   height={60}
          //   className="object-cover rounded"
          // />
          <ImagePreview
            images={[imageUrl]}
            alt={`Ảnh đính kèm từ quản lý ${row.original.id}`}
            initialHeight={80}
            initialWidth={80}
            className="object-cover rounded-xl"
          />
        )
      );
    },

    meta: {
      align: "center",
      export: {
        pdf: { header: "Ảnh đính kèm" },
        csv: { header: "Ảnh đính kèm" },
      },
    },
  },

  {
    id: "createdOnUtc",
    accessorKey: "createdOnUtc",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <Calendar className="mr-1 h-3.5 w-3.5 text-slate-500" />

          <span className="font-semibold text-slate-700">Ngày tạo</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdOnUtc") as string;
      const formattedDate = vietnameseDate(date, true);
      const relativeDate = formatRelativeTime(date);

      return (
        <div className="flex flex-col">
          <span className="flex items-center text-sm font-semibold text-slate-700">
            <Calendar className="mr-1 size-6 text-slate-500" />
            {formattedDate}
          </span>
          <span className="flex items-center text-xs font-semibold text-sky-500 underline">
            <Clock className="mr-1 size-4" />
            {relativeDate}
          </span>
        </div>
      );
    },

    meta: {
      align: "center",
      export: { pdf: { header: "Ngày tạo" }, csv: { header: "Ngày tạo" } },
    },

    minSize: 400,
  },

  {
    id: "processedAt",
    accessorKey: "processedAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          <Calendar className="mr-1 size-4 text-slate-700" />

          <span className="font-semibold text-slate-700">Ngày được xử lý</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("processedAt") as string;
      const formattedDate = vietnameseDate(date, true);
      const relativeDate = formatRelativeTime(date);

      return date ? (
        <div className="flex flex-col">
          <span className="flex items-center text-sm font-semibold text-slate-700">
            <Calendar className="mr-1 size-6 text-slate-500" />
            {formattedDate}
          </span>
          <span className="flex items-center text-xs font-semibold text-sky-500 underline">
            <Clock className="mr-1 size-4" />
            {relativeDate}
          </span>
        </div>
      ) : (
        <span className="font-semibold text-slate-600">---</span>
      );
    },

    meta: {
      align: "center",
      export: {
        pdf: { header: "Ngày được xử lý" },
        csv: { header: "Ngày được xử lý" },
      },
    },

    minSize: 400,
  },

  {
    id: "actions",
    header: () => {
      return (
        <div className="flex items-center justify-end">
          <span className="font-semibold text-slate-700">Thao tác</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const request = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 data-[state=open]:bg-slate-100"
              >
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <Button
                className="flex items-center cursor-pointer w-full"
                onClick={() => {
                  // Xử lý xem chi tiết
                  console.log("View details", request.id);
                }}
                variant="outline"
              >
                <ViewIcon className="mr-1 h-4 w-4" />
                <span>Xem chi tiết</span>
              </Button> */}

              <CancelWithdrawalDialog requestWithdrawalId={request.id} />

              {/* {request.image && (
                <DropdownMenuItem
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    // Xử lý xem hình ảnh
                    console.log("View image", request.id);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Xem chứng từ</span>
                </DropdownMenuItem>
              )} */}

              {/* <Button
                className="flex items-center cursor-pointer w-full"
                onClick={() => copyToClipboard(request.id)}
                variant="outline"
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Sao chép mã</span>
              </Button> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: false },
    },
  },
];
