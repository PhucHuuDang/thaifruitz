"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  CreditCard,
  Fingerprint,
  Info,
  Check,
  ArrowRight,
  LockKeyhole,
  HelpCircle,
  BarChart3,
  PlayIcon,
  QrCode,
  Wallet2Icon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

import { ApiResponse, PageResult, Profile } from "@/types/types";
import { USER_KEY } from "@/app/key/user-key";
import { formatVND } from "@/lib/format-currency";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API } from "@/app/key/url";

import Cookies from "js-cookie";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import { TransactionHistoryWallet } from "./wallet-history/history-transaction-wallet";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { WalletTransactionTypes } from "./wallet-lib/transaction";

interface SuccessWalletProps {
  user: ApiResponse<Profile> | undefined;
}

const SUGGESTED_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];

const TABS = [
  {
    id: "success-wallet",
    label: "Nạp tiền",
    icon: Wallet2Icon,
  },
  {
    id: "wallet-transaction-history",
    label: "Lịch sử giao dịch",
    icon: BarChart3,
  },
];
export const SuccessWallet = memo(({ user }: SuccessWalletProps) => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<
    "vnpay" | "payos" | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);

  const accessToken = Cookies.get("accessToken");

  const transactionData = useFetch<
    ApiResponse<PageResult<WalletTransactionTypes>>
  >("/Wallets/wallet-transaction", [USER_KEY.WALLET_TRANSACTION]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const [tab, setTab] = useState("success-wallet");

  const onDeposit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API}/Wallets/deposite`,
        {
          amount: Number(amount),
          paymentMethod: selectedMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setAmount("");
        setSelectedMethod(null);
        toast.success("Yêu cầu nạp thành công!");
        router.push(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra trong quá trình nạp tiền!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <VercelTab tabs={TABS} activeTab={tab} onTabChange={setTab} />

      {tab === "success-wallet" ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="rounded-full bg-green-100 p-6">
            <ShieldCheck className="h-12 w-12 text-green-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-slate-700 text-lg">
              Ví Đã Sẵn Sàng!
            </h3>
            <p className="text-slate-500">
              Ví của bạn đã được tạo thành công và sẵn sàng để sử dụng.
            </p>
          </div>

          {/* Wallet Overview */}
          <div className="w-full bg-gradient-to-br from-sky-50 via-amber-50 to-slate-400 cardStyle p-5 text-slate-700">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold"> Ví Của Bạn</h3>
              </div>
              <CreditCard className="h-8 w-8 " />
            </div>
            <div className="mb-4">
              <span className="text-sm font-semibold ">Số Dư Khả Dụng</span>
              <h2 className="text-2xl font-bold text-sky-500">
                {formatVND(user?.value?.balance ?? 0)}
              </h2>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">
                Mã Ví: <span className="text-base">•••• 4589</span>
              </span>
              <AdvancedColorfulBadges
                color="green"
                size="md"
                className="rounded-full"
              >
                Sẵn sàng
              </AdvancedColorfulBadges>
            </div>
          </div>

          <Separator />

          <div className="w-full space-y-4">
            <h4 className="font-semibold text-base flex items-center gap-1">
              <PlayIcon className="size-6" />
              Bắt Đầu
            </h4>

            <div className="grid gap-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="deposit"
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className=" px-3 py-4 ">
                    <div className="flex items-center gap-3 w-full transition-colors">
                      <div className="bg-primary/10 p-2 rounded">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <h5 className="font-medium text-sm">Nạp Tiền</h5>
                        <p className="text-sm text-muted-foreground">
                          Nạp tiền vào ví của bạn
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <div
                          className={cn(
                            "flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer",
                            selectedMethod === "vnpay"
                              ? "border-primary bg-primary/5"
                              : "hover:bg-accent"
                          )}
                          onClick={() => setSelectedMethod("vnpay")}
                        >
                          <Wallet2Icon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <h6 className="font-medium">VNPay</h6>
                            <p className="text-sm text-muted-foreground">
                              Thanh toán qua thẻ ngân hàng
                            </p>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-muted flex items-center justify-center">
                            {selectedMethod === "vnpay" && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>

                        <div
                          className={cn(
                            "flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer",
                            selectedMethod === "payos"
                              ? "border-primary bg-primary/5"
                              : "hover:bg-accent"
                          )}
                          onClick={() => setSelectedMethod("payos")}
                        >
                          <QrCode className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <h6 className="font-medium">PayOS</h6>
                            <p className="text-sm text-muted-foreground">
                              Thanh toán qua QR Code
                            </p>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-muted flex items-center justify-center">
                            {selectedMethod === "payos" && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">
                          Số tiền muốn nạp
                        </label>
                        <Input
                          type="number"
                          placeholder="Nhập số tiền"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-lg"
                        />

                        <div className="grid grid-cols-3 gap-2">
                          {SUGGESTED_AMOUNTS.map((value) => (
                            <button
                              key={value}
                              onClick={() => setAmount(value.toString())}
                              className={cn(
                                "p-2 text-sm border rounded-lg transition-colors",
                                amount === value.toString()
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-accent"
                              )}
                            >
                              {formatVND(value)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        disabled={!amount || !selectedMethod}
                        onClick={onDeposit}
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer mt-3">
                  <div className="bg-primary/10 p-2 rounded">
                    <Wallet2Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">
                      Liên Kết Phương Thức Thanh Toán
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Kết nối ngân hàng hoặc thẻ của bạn
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer mt-3">
                  <div className="bg-primary/10 p-2 rounded">
                    <Fingerprint className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">
                      Bật Tính Năng Bảo Mật
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Thiết lập bảo vệ bổ sung
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      ) : (
        <TransactionHistoryWallet
          walletTransactions={transactionData.data?.value?.items ?? []}
        />
      )}
    </>
  );
});

SuccessWallet.displayName = "SuccessWallet";
