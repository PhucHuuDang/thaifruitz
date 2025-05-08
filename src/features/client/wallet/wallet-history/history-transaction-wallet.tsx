"use client";

import { memo, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChartNoAxesGanttIcon,
  CreditCard,
  Download,
  Filter,
  IdCardIcon,
  RefreshCcw,
  Search,
  SquareXIcon,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatVND } from "@/lib/format-currency";
import { TransactionTable } from "./components/transaction-table";
import { TransactionDetail } from "./components/transaction-detail";
import { WalletTransactionTypes } from "../wallet-lib/transaction";
import { NotData } from "@/components/global-components/no-data";

// Helper function to get transaction icon
export const getTransactionIcon = (type: string) => {
  switch (type) {
    case "Buy":
      return <CreditCard className="size-6 text-rose-500" />;
    case "Deposite":
      return <ArrowDownLeft className="size-6 text-emerald-500" />;
    case "Withdrawals":
      return <ArrowUpRight className="size-6 text-rose-500" />;
    case "Refund":
      return <RefreshCcw className="size-6 text-sky-500" />;
    default:
      return <Wallet className="size-6" />;
  }
};

// Helper function to get transaction badge color
export const getTransactionBadgeColor = (type: string) => {
  switch (type) {
    case "Buy":
      return "bg-rose-100 text-rose-700 hover:bg-rose-100";
    case "Deposite":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "Withdrawals":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    case "Refund":
      return "bg-sky-100 text-sky-700 hover:bg-sky-100";
    default:
      return "";
  }
};

interface TransactionHistoryWalletProps {
  walletTransactions: WalletTransactionTypes[];
}

export const TransactionHistoryWallet = memo(
  ({ walletTransactions }: TransactionHistoryWalletProps) => {
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [filterType, setFilterType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    if (walletTransactions.length === 0) {
      return (
        <NotData
          title="Chưa có giao dịch nào"
          description="Bạn chưa thực hiện giao dịch nào trong ví này."
          icons={[Wallet, ChartNoAxesGanttIcon, SquareXIcon]}
          className="min-w-full h-full"
        />
      );
    }

    const filteredTransactions = walletTransactions.filter((transaction) => {
      // Filter by type
      if (filterType !== "all") {
        const typeMap: Record<string, string> = {
          buy: "Buy",
          deposit: "Deposite",
          withdrawal: "Withdrawals",
          refund: "Refund",
        };
        if (transaction.transactionType !== typeMap[filterType]) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        return (
          transaction.content
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return true;
    });

    const handleTransactionClick = (transaction: any) => {
      setSelectedTransaction(transaction);
    };

    const totalDeposit = walletTransactions
      .filter((t) => t.transactionType === "Deposite")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpending = walletTransactions
      .filter(
        (t) =>
          t.transactionType === "Buy" || t.transactionType === "Withdrawals"
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const latestBalance = walletTransactions.length
      ? [...walletTransactions].sort(
          (a, b) =>
            new Date(b.createdOnUtc).getTime() -
            new Date(a.createdOnUtc).getTime()
        )[0].balance
      : 0;

    return (
      <div className="container mx-auto py-6 motion-preset-slide-right">
        <div className="space-y-6">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm giao dịch..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giao dịch</SelectItem>
                <SelectItem value="buy">Mua</SelectItem>
                <SelectItem value="deposit">Nạp tiền</SelectItem>
                <SelectItem value="withdrawal">Rút tiền</SelectItem>
                <SelectItem value="refund">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          {/* <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Calendar className="h-4 w-4" />
              <span>Thời gian</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc nâng cao</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Xuất file</span>
            </Button>
          </div> */}

          {/* Wallet summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 cardStyle p-4 ">
              <div className="text-sm text-emerald-700 font-semibold">
                Số dư hiện tại
              </div>
              <div className="text-2xl font-bold text-emerald-800">
                {formatVND(latestBalance)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 cardStyle p-4 ">
              <div className="text-sm text-sky-700 font-semibold">Tổng nạp</div>
              <div className="text-2xl font-bold text-sky-800">
                {formatVND(totalDeposit)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 cardStyle p-4 ">
              <div className="text-sm text-amber-700 font-semibold">
                Tổng chi tiêu
              </div>
              <div className="text-2xl font-bold text-amber-800">
                {formatVND(totalSpending)}
              </div>
            </div>
          </div>

          <TransactionTable
            filteredTransactions={filteredTransactions}
            handleTransactionClick={handleTransactionClick}
          />

          {/* Transaction details */}
          <TransactionDetail selectedTransaction={selectedTransaction} />

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị 5 trên tổng số 24 giao dịch
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm" className="px-4 font-medium">
                1
              </Button>
              <Button variant="outline" size="sm" className="px-4">
                2
              </Button>
              <Button variant="outline" size="sm" className="px-4">
                3
              </Button>
              <Button variant="outline" size="sm">
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
TransactionHistoryWallet.displayName = "TransactionHistoryWallet";
