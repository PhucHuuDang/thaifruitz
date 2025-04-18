import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVND } from "@/lib/format-currency";
import { vietnameseDate } from "@/utils/date";
import { memo } from "react";
import {
  getTransactionBadgeColor,
  getTransactionIcon,
} from "../history-transaction-wallet";

interface TransactionTableProps {
  filteredTransactions: Array<{
    id: string;
    transactionType: string;
    content: string;
    amount: number;
    balance: number;
    createdOnUtc: string;
  }>;
  handleTransactionClick: (transaction: any) => void;
}
export const TransactionTable = memo(
  ({ filteredTransactions, handleTransactionClick }: TransactionTableProps) => {
    return (
      <div className="cardStyle">
        <Table className="w-full table-auto ">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Loại</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead className="hidden lg:table-cell">Số dư</TableHead>
              <TableHead className="hidden sm:table-cell">Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-[350px] overflow-y-auto">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer hover:bg-amber-50/70 transition-colors"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 w-24 font-normal ${getTransactionBadgeColor(
                        transaction.transactionType
                      )}`}
                    >
                      {getTransactionIcon(transaction.transactionType)}
                      <span className="hidden sm:inline">
                        {transaction.transactionType === "Buy"
                          ? "Mua"
                          : transaction.transactionType === "Deposite"
                          ? "Nạp tiền"
                          : transaction.transactionType === "Withdrawals"
                          ? "Rút tiền"
                          : "Hoàn tiền"}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.content}
                  </TableCell>
                  <TableCell
                    className={
                      transaction.amount > 0
                        ? "text-emerald-600 font-semibold "
                        : "text-rose-600 font-semibold "
                    }
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {formatVND(transaction.amount)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-semibold text-sky-500">
                    {formatVND(transaction.balance)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {vietnameseDate(transaction.createdOnUtc, true)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy giao dịch nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);

TransactionTable.displayName = "TransactionTable";
