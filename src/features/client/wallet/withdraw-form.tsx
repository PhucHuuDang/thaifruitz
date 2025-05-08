"use client";

import type React from "react";

import { memo, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Loader2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatVND } from "@/lib/format-currency";
import { placeholderImage } from "@/utils/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { interactApiClient } from "@/actions/client/interact-api-client";
import { formatAccountNumber } from "./wallet-lib/transaction";
import { useQueryClient } from "@tanstack/react-query";
import { USER_KEY } from "@/app/key/user-key";

// Dữ liệu ngân hàng Việt Nam
const banks = [
  {
    id: 17,
    name: "Ngân hàng TMCP Công thương Việt Nam",
    code: "ICB",
    bin: "970415",
    shortName: "VietinBank",
    logo: "https://api.vietqr.io/img/ICB.png",
    transferSupported: 1,
    lookupSupported: 1,
    short_name: "VietinBank",
    support: 3,
    isTransfer: 1,
    swift_code: "ICBVVNVX",
  },
  {
    id: 43,
    name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
    code: "VCB",
    bin: "970436",
    shortName: "Vietcombank",
    logo: "https://api.vietqr.io/img/VCB.png",
    transferSupported: 1,
    lookupSupported: 1,
    short_name: "Vietcombank",
    support: 3,
    isTransfer: 1,
    swift_code: "BFTVVNVX",
  },
  {
    id: 4,
    name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
    code: "BIDV",
    bin: "970418",
    shortName: "BIDV",
    logo: "https://api.vietqr.io/img/BIDV.png",
    transferSupported: 1,
    lookupSupported: 1,
    short_name: "BIDV",
    support: 3,
    isTransfer: 1,
    swift_code: "BIDVVNVX",
  },
  {
    id: 42,
    name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
    code: "VBA",
    bin: "970405",
    shortName: "Agribank",
    logo: "https://api.vietqr.io/img/VBA.png",
    transferSupported: 1,
    lookupSupported: 1,
    short_name: "Agribank",
    support: 3,
    isTransfer: 1,
    swift_code: "VBAAVNVX",
  },
];

// Định nghĩa kiểu dữ liệu cho form
interface WithdrawalFormData {
  amount: string;
  bankName: string;
  bankAccountNumber: string;
  recipientName: string;
  bankLogo: string;
}

// Định nghĩa kiểu dữ liệu cho lỗi
interface FormErrors {
  amount?: string;
  bankName?: string;
  bankAccountNumber?: string;
  recipientName?: string;
}

type WithDrawPayload = {
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  recipientName: string;
  bankLogo: string;
};

interface WithdrawFormProps {
  wallet:
    | {
        walletId: string;
        balance: number;
      }
    | null
    | undefined;
}

export const WithdrawForm = memo(({ wallet }: WithdrawFormProps) => {
  const [open, setOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<(typeof banks)[0] | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalFormData>({
    amount: "",
    bankName: "",
    bankAccountNumber: "",
    recipientName: "",
    bankLogo: "",
  });

  const queryClient = useQueryClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWithdrawalData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBankSelect = (bank: (typeof banks)[0]) => {
    setSelectedBank(bank);
    setWithdrawalData((prev) => ({
      ...prev,
      bankName: bank.shortName,
      bankLogo: bank.logo,
    }));
    setBankOpen(false);

    if (errors.bankName) {
      setErrors((prev) => ({ ...prev, bankName: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const amountValue = Number(withdrawalData.amount.replace(/\D/g, ""));
    if (!withdrawalData.amount) {
      newErrors.amount = "Vui lòng nhập số tiền";
      isValid = false;
    } else if (amountValue < 10000) {
      newErrors.amount = "Số tiền phải từ 10.000 ₫ trở lên";
      isValid = false;
    } else if (amountValue > 100000000) {
      newErrors.amount = "Số tiền không được vượt quá 100.000.000 ₫";
      isValid = false;
    }

    if (!withdrawalData.bankName) {
      newErrors.bankName = "Vui lòng chọn ngân hàng";
      isValid = false;
    }

    if (!withdrawalData.bankAccountNumber) {
      newErrors.bankAccountNumber = "Vui lòng nhập số tài khoản";
      isValid = false;
    } else if (
      !/^\d{8,16}$/.test(withdrawalData.bankAccountNumber.replace(/\s/g, ""))
    ) {
      newErrors.bankAccountNumber = "Số tài khoản không hợp lệ (8-16 chữ số)";
      isValid = false;
    }

    if (!withdrawalData.recipientName) {
      newErrors.recipientName = "Vui lòng nhập tên người nhận";
      isValid = false;
    } else if (withdrawalData.recipientName.length < 2) {
      newErrors.recipientName = "Tên người nhận quá ngắn";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      amount: Number(withdrawalData.amount.replace(/\D/g, "")),
      bankName: withdrawalData.bankName,
      bankAccountNumber: withdrawalData.bankAccountNumber.replace(/\s/g, ""),
      recipientName: withdrawalData.recipientName,
      bankLogo: withdrawalData.bankLogo,
    };

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOpen(true);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu rút tiền");
      console.error("Error submitting withdrawal request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);

    try {
      const response = await interactApiClient.post<object, WithDrawPayload>(
        "/Wallets/request-withdrawal",
        {
          amount: Number(withdrawalData.amount.replace(/\D/g, "")),
          bankName: withdrawalData.bankName,
          bankAccountNumber: withdrawalData.bankAccountNumber.replace(
            /\s/g,
            ""
          ),
          recipientName: withdrawalData.recipientName,
          bankLogo: withdrawalData.bankLogo,
        }
      );

      console.log({ response });

      if (!response) {
        toast.error("Có lỗi xảy ra khi xác nhận rút tiền");

        return;
      }

      queryClient.invalidateQueries({
        queryKey: [USER_KEY.PROFILE],
      });
      queryClient.invalidateQueries({
        queryKey: [USER_KEY.REQUEST_WITHDRAWAL],
      });
      queryClient.invalidateQueries({
        queryKey: [USER_KEY.WALLET_TRANSACTION],
      });

      toast.success("Yêu cầu rút tiền đã được gửi thành công");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOpen(false);

      setWithdrawalData({
        amount: "",
        bankName: "",
        bankAccountNumber: "",
        recipientName: "",
        bankLogo: "",
      });
      setSelectedBank(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xác nhận rút tiền");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Định dạng số tài khoản

  // Các giá trị tiền phổ biến
  const commonAmounts = [
    { label: "50.000 ₫", value: "50000" },
    { label: "100.000 ₫", value: "100000" },
    { label: "200.000 ₫", value: "200000" },
    { label: "300.000 ₫", value: "300000" },
    { label: "400.000 ₫", value: "400000" },
    { label: "500.000 ₫", value: "500000" },
    { label: "1.000.000 ₫", value: "1000000" },
    { label: "2.000.000 ₫", value: "2000000" },
    { label: "5.000.000 ₫", value: "5000000" },
  ];

  // const disabledWithdraw = Object.keys(errors).length > 0 || !validateForm();
  const disabledWithdraw =
    Object.keys(errors).length > 0 ||
    Object.values(withdrawalData).some((value) => {
      return value === "" || value === undefined;
    });

  const isEligibleToWithdraw = useMemo(() => {
    if (!wallet?.balance) return false;
    const balance = wallet.balance;

    const isInCommonAmounts = commonAmounts.some(
      (amount) => Number(amount.value) <= balance
    );

    return balance >= 10000 || isInCommonAmounts;
  }, [wallet?.balance]);

  // console.log({ isEligibleToWithdraw });

  return (
    <div className="w-full mx-auto p-4 relative motion-preset-slide-right ">
      <Card
        className={cn(
          "overflow-hidden cardStyle w-full relative",
          !isEligibleToWithdraw && "blur-sm pointer-events-none"
        )}
      >
        <CardHeader className="bg-gradient-to-br from-sky-50 via-amber-50 to-slate-400">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-sky-900 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <CardTitle className=" flex items-center justify-between gap-2 relative">
            <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <Wallet className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              Yêu cầu rút Tiền
            </span>
            <div className="flex items-center gap-1">
              <span className="text-base">Số dư hiện tại: </span>
              <span className="text-lg text-sky-500 font-semibold">
                {wallet?.balance ? formatVND(wallet.balance) : "0 ₫"}
              </span>
            </div>
          </CardTitle>
          <CardDescription className="relative">
            Chuyển tiền từ ví của bạn đến tài khoản ngân hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Số tiền */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex justify-between ">
                <span className="font-semibold">Số Tiền</span>
                <span className="text-xs text-slate-500 underline">
                  Tối thiểu: 10.000 ₫
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className={cn(
                    "pl-4 pr-16 text-right text-lg font-medium transition-all",
                    errors.amount
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : "",
                    Number(withdrawalData.amount.replace(/\D/g, "")) >= 10000 &&
                      !errors.amount
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  )}
                  value={withdrawalData.amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const formattedValue =
                      value === ""
                        ? ""
                        : new Intl.NumberFormat("vi-VN").format(Number(value));
                    setWithdrawalData((prev) => ({
                      ...prev,
                      amount: formattedValue,
                    }));

                    if (errors.amount) {
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                    }
                  }}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 font-medium">
                  VND
                </div>
              </div>

              {/* Hiển thị lỗi hoặc số tiền bằng chữ */}
              {errors.amount ? (
                <div className="text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </div>
              ) : withdrawalData.amount ? (
                <div className="text-sm text-slate-700">
                  {formatVND(withdrawalData.amount.replace(/\D/g, ""))}
                </div>
              ) : null}

              {/* Các giá trị phổ biến */}
              <div className="flex flex-wrap gap-2 mt-2">
                {commonAmounts.map((amount) => {
                  const balance = wallet?.balance || 0;

                  const isDisabled = balance < Number(amount.value);

                  return (
                    <Button
                      key={amount.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`text-xs font-semibold ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        const formattedValue = new Intl.NumberFormat(
                          "vi-VN"
                        ).format(Number(amount.value));
                        setWithdrawalData((prev) => ({
                          ...prev,
                          amount: formattedValue,
                        }));
                        if (errors.amount) {
                          setErrors((prev) => ({ ...prev, amount: undefined }));
                        }
                      }}
                      disabled={isDisabled}
                    >
                      {amount.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Chọn ngân hàng */}
            <div className="space-y-2 w-full">
              <Label htmlFor="bank" className="font-semibold">
                Chọn Ngân Hàng
              </Label>
              <Popover open={bankOpen} onOpenChange={setBankOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={bankOpen}
                    className={cn(
                      "w-full justify-between h-auto py-3",
                      errors.bankName ? "border-rose-500" : "",
                      selectedBank ? "border-green-500" : ""
                    )}
                  >
                    {selectedBank ? (
                      <div className="flex items-center gap-3">
                        {/* <Image
                          src={selectedBank.logo || placeholderImage}
                          alt={selectedBank.shortName}
                          width={24}
                          height={24}
                          className="h-6 w-auto object-cover"
                        /> */}

                        <Image
                          src={selectedBank.logo || placeholderImage}
                          alt={selectedBank.shortName}
                          width={90}
                          height={90}
                          className="object-cover rounded-sm"
                        />
                        <div className="text-left">
                          <span className="font-semibold text-sky-600 text-base">
                            {selectedBank.shortName}
                          </span>
                          <div className="text-xs text-slate-700 font-semibold text-ellipsis">
                            {selectedBank.name}
                          </div>
                        </div>
                      </div>
                    ) : (
                      "Chọn ngân hàng..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]" sideOffset={4}>
                  <Command className="min-w-full">
                    <CommandInput placeholder="Tìm kiếm ngân hàng..." />
                    <CommandList className="w-full">
                      <CommandEmpty>Không tìm thấy ngân hàng.</CommandEmpty>
                      <CommandGroup className="w-full">
                        {banks.map((bank) => (
                          <CommandItem
                            key={bank.id}
                            value={bank.shortName}
                            onSelect={() => handleBankSelect(bank)}
                            className="flex items-center gap-3 py-3 w-full"
                          >
                            <Image
                              src={bank.logo || placeholderImage}
                              alt={bank.shortName}
                              width={90}
                              height={90}
                              className="object-cover rounded-sm"
                            />
                            <div className="flex flex-col w-full">
                              <span className="font-semibold text-sky-600 text-base">
                                {bank.shortName}
                              </span>
                              <span className="text-xs text-slate-700 font-semibold  max-w-[200px]">
                                {bank.name}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedBank?.id === bank.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.bankName && (
                <div className="text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.bankName}
                </div>
              )}
            </div>

            {/* Số tài khoản */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="font-semibold">
                Số Tài Khoản
              </Label>
              <Input
                id="accountNumber"
                name="bankAccountNumber"
                placeholder="Nhập số tài khoản"
                className={cn(
                  errors.bankAccountNumber
                    ? "border-rose-500 focus-visible:ring-rose-500"
                    : "",
                  withdrawalData.bankAccountNumber && !errors.bankAccountNumber
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
                )}
                value={withdrawalData.bankAccountNumber}
                onChange={(e) => {
                  // Chỉ cho phép số và khoảng trắng
                  const rawValue = e.target.value.replace(/[^\d\s]/g, "");
                  // Định dạng số tài khoản
                  const formattedValue = formatAccountNumber(rawValue);
                  setWithdrawalData((prev) => ({
                    ...prev,
                    bankAccountNumber: formattedValue,
                  }));

                  // Xóa lỗi khi người dùng bắt đầu sửa
                  if (errors.bankAccountNumber) {
                    setErrors((prev) => ({
                      ...prev,
                      bankAccountNumber: undefined,
                    }));
                  }
                }}
                required
              />
              {errors.bankAccountNumber && (
                <div className="text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.bankAccountNumber}
                </div>
              )}
            </div>

            {/* Tên người nhận */}
            <div className="space-y-2">
              <Label htmlFor="recipientName" className="font-semibold">
                Tên Người Nhận
              </Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="Nhập tên người nhận"
                className={cn(
                  errors.recipientName
                    ? "border-rose-500 focus-visible:ring-rose-500"
                    : "",
                  withdrawalData.recipientName && !errors.recipientName
                    ? "border-green-500 focus-visible:ring-green-500"
                    : ""
                )}
                value={withdrawalData.recipientName}
                onChange={handleInputChange}
                required
              />
              {errors.recipientName && (
                <div className="text-sm text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.recipientName}
                </div>
              )}
            </div>

            {/* Thông tin bổ sung */}
            <Alert className="cardStyle bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900">
              <AlertDescription className="text-xs font-semibold">
                Lưu ý: Giao dịch rút tiền sẽ được xử lý trong vòng 24 giờ làm
                việc. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
              </AlertDescription>
            </Alert>

            {/* Sheet xác nhận */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white"
                  disabled={isSubmitting || disabledWithdraw}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Rút Tiền"
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Xác Nhận Rút Tiền</DialogTitle>
                  <DialogDescription>
                    Vui lòng kiểm tra thông tin rút tiền trước khi xác nhận.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 space-y-6">
                  {selectedBank && (
                    <WithdrawalConfirmation
                      amount={Number(withdrawalData.amount.replace(/\D/g, ""))}
                      bank={selectedBank}
                      bankAccountNumber={withdrawalData.bankAccountNumber}
                      recipientName={withdrawalData.recipientName}
                    />
                  )}
                  <DialogFooter className="flex-col">
                    <Button
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                      onClick={handleConfirmWithdrawal}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Xác Nhận Rút Tiền"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => setOpen(false)}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 font-semibold">
          <div className="w-full text-center">
            Giao dịch rút tiền thường được xử lý trong vòng 24 giờ làm việc.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
});
WithdrawForm.displayName = "WithdrawForm";

interface WithdrawalConfirmationProps {
  amount: number;
  bank: (typeof banks)[0];
  bankAccountNumber: string;
  recipientName: string;
}

function WithdrawalConfirmation({
  amount,
  bank,
  bankAccountNumber,
  recipientName,
}: WithdrawalConfirmationProps) {
  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return "";
    const cleanNumber = accountNumber.replace(/\s/g, "");
    const lastFour = cleanNumber.slice(-4);
    return "••••" + lastFour;
  };

  const formatDate = () => {
    const date = new Date();
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Tạo mã giao dịch ngẫu nhiên
  const transactionId = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();

  return (
    <div className="rounded-lg border bg-card p-5 space-y-5">
      <div className="flex justify-between items-center pb-4 border-b">
        <div className="text-sm text-slate-700 font-semibold">Mã Giao Dịch</div>
        <div className="text-sm font-mono">{transactionId}</div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-700 font-semibold">Số Tiền</div>
          <span className="text-xl font-semibold text-sky-500">
            {formatVND(amount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-semibold">Ngân Hàng</div>
          <div className="flex items-center gap-2">
            <Image
              src={bank.logo || "/placeholder.svg"}
              alt={bank.shortName}
              width={20}
              height={20}
              className="size-full object-cover"
            />
            <span>{bank.shortName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-semibold">
            Mã Ngân Hàng
          </div>
          <div className="font-mono">{bank.bin}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-semibold">
            Số Tài Khoản
          </div>
          <div className="font-mono">
            {maskAccountNumber(bankAccountNumber)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-semibold">Người Nhận</div>
          <div>{recipientName}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-semibold">Thời Gian</div>
          <div className="text-sm">{formatDate()}</div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-slate-700 font-semibold">
            Phí Giao Dịch
          </div>
          <div>0 ₫</div>
        </div>

        <div className="flex items-center justify-between font-medium">
          <div>Tổng Cộng</div>
          <span className="font-semibold text-sky-500 text-xl">
            {formatVND(amount)}
          </span>
        </div>
      </div>
    </div>
  );
}
