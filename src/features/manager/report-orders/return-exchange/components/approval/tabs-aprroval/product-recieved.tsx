import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/format-currency";
import { OrderReturnItem } from "@/types/order-detail.types";
import { CheckCircleIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { ReturnRequestDataType } from "../approval-dialog-trigger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { justReturnExchangeLabel } from "../../../return-exchange-status/status";
import { placeholderImage } from "@/utils/label";
import StatusBadge from "../return-change-product-checked/components/status-badge";

interface ProductReceivedProps {
  itemsData: {
    returnExchangeRequestItemId: string;
    receiveQuantity: number;
    note: string;
    acceptQuantity: number;
  }[];
  // returnRequestData: OrderReturnItem[];
  returnRequestData: ReturnRequestDataType[];
  handleItemReceiveQuantityChange: (id: string, quantity: number) => void;
  handleItemAcceptQuantityChange: (id: string, quantity: number) => void;
  handleItemNoteChange: (id: string, note: string) => void;
  totalRefundAmount: number;

  requestType: string;
}
export const ProductReceived = memo(
  ({
    itemsData,
    returnRequestData,
    handleItemReceiveQuantityChange,
    handleItemAcceptQuantityChange,
    handleItemNoteChange,
    totalRefundAmount,
    requestType,
  }: ProductReceivedProps) => {
    const entichReturnRequestData = returnRequestData.map((data) => {});

    return (
      <ScrollArea className="max-h-[60vh] h-full sm:h-[70vh] lg:h-[85vh]  space-y-4 motion-preset-slide-right motion-duration-300 p-4 pb-16">
        {itemsData.map((item, index) => {
          const originalItem = returnRequestData.find(
            (original) =>
              original.returnExchangeRequestItemId ===
              item.returnExchangeRequestItemId
          );

          const discountPrice = originalItem?.orderItem?.discountPrice ?? 0;
          const originalPrice = originalItem?.orderItem?.unitPrice ?? 0;
          const hasDiscount = discountPrice < originalPrice;

          return (
            <Card
              key={item.returnExchangeRequestItemId}
              className="overflow-hidden border-slate-200 cardStyle"
            >
              <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageIcon className="size-8 text-slate-500" />
                    <CardTitle className="text-sm font-semibold">
                      {originalItem?.orderItem.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs font-normal">
                    ID: {item.returnExchangeRequestItemId.substring(0, 8)}
                    ...
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex w-full gap-2">
                  {/* <div className="col-span-12 md:col-span-3">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                      <Image
                        src={
                          originalItem?.orderItem.image || "/placeholder.svg"
                        }
                        alt={originalItem?.orderItem.name || "Sản phẩm"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div> */}

                  <div className="relative">
                    <Image
                      // src="/images/third-background.png"
                      src={originalItem?.orderItem.image ?? placeholderImage}
                      alt={originalItem?.orderItem.name || "Sản phẩm"}
                      width={500}
                      height={240}
                      className="h-60 w-full object-cover rounded-xl z-40 group-hover/card:scale-105 cursor-pointer transition duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                      quality={85}
                    />

                    <div className="absolute top-2 right-2">
                      <StatusBadge status={requestType} />
                    </div>
                  </div>

                  <div className=" space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor={`receive-quantity-${index}`}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Số lượng đã nhận
                        </Label>
                        <div className="flex items-center mt-1.5">
                          {/* <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-r-none"
                            onClick={() =>
                              handleItemReceiveQuantityChange(
                                item.returnExchangeRequestItemId,
                                Math.max(0, item.receiveQuantity - 1)
                              )
                            }
                            // disabled={item.receiveQuantity <= 0}
                            disabled
                          >
                            <span>-</span>
                          </Button> */}
                          <Input
                            id={`receive-quantity-${index}`}
                            type="number"
                            min="0"
                            max={originalItem?.orderItem.customerQuantity || 1}
                            value={item.receiveQuantity}
                            onChange={(e) =>
                              handleItemReceiveQuantityChange(
                                item.returnExchangeRequestItemId,
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            autoFocus
                            disabled
                            className="rounded-none text-center h-9"
                          />
                          {/* <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-l-none"
                            onClick={() =>
                              handleItemReceiveQuantityChange(
                                item.returnExchangeRequestItemId,
                                Math.min(
                                  originalItem?.orderItem?.customerQuantity ||
                                    1,
                                  item.receiveQuantity + 1
                                )
                              )
                            }
                            // disabled={
                            //   item.receiveQuantity >=
                            //   (originalItem?.orderItem?.customerQuantity || 1)
                            // }
                            disabled
                          >
                            <span>+</span>
                          </Button> */}
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Số lượng thực tế nhận được từ khách hàng
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor={`accept-quantity-${index}`}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Số lượng chấp nhận
                        </Label>
                        <div className="flex items-center mt-1.5">
                          <Select
                            value={item.acceptQuantity.toString() ?? "1"}
                            onValueChange={(value) =>
                              handleItemAcceptQuantityChange(
                                item.returnExchangeRequestItemId,
                                Number.parseInt(value) || 0
                              )
                            }
                          >
                            <SelectTrigger className="w-full h-9">
                              <SelectValue placeholder="Chọn số lượng" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: item.receiveQuantity })
                                .fill(0)
                                .map((_, index) => {
                                  return (
                                    <SelectItem
                                      key={index}
                                      value={(index + 1).toString()}
                                    >
                                      {index + 1}
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Số lượng được chấp nhận để hoàn tiền
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor={`item-note-${index}`}
                        className="text-sm font-semibold text-slate-700"
                      >
                        Ghi chú cho sản phẩm
                      </Label>
                      <Textarea
                        id={`item-note-${index}`}
                        placeholder="Nhập ghi chú cho sản phẩm này"
                        value={item.note}
                        onChange={(e) =>
                          handleItemNoteChange(
                            item.returnExchangeRequestItemId,
                            e.target.value
                          )
                        }
                        className="mt-1.5 resize-none cardStyle"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 cardStyle">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600">
                          Đơn giá:
                        </span>
                        <div className="flex items-center gap-x-2 font-semibold text-amber-500">
                          {formatVND(originalItem?.orderItem.unitPrice || 0)}
                        </div>
                      </div>
                      {(originalItem?.orderItem.percentage || 0) > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm font-semibold text-slate-600">
                            Giảm giá:
                          </span>
                          <span className="text-rose-500 font-semibold">
                            -{originalItem?.orderItem.percentage}%
                          </span>
                        </div>
                      )}

                      {hasDiscount && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-600">
                            Giá đã giảm:
                          </span>
                          <div className="flex items-center gap-x-2 font-semibold text-green-500">
                            {formatVND(discountPrice || 0)}
                          </div>
                        </div>
                      )}

                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">
                          {justReturnExchangeLabel(requestType)} sản phẩm:
                        </span>
                        <div className="flex items-center gap-1 text-sky-500 text-base font-semibold">
                          <span>x{item.receiveQuantity}</span>

                          <SelectSeparator className="h-4 w-[1px] mx-1 bg-slate-500 " />
                          <span>
                            {formatVND(
                              (hasDiscount ? discountPrice : originalPrice) *
                                item.receiveQuantity
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="size-8 text-green-500" />
              <span className="font-semibold text-slate-700">
                <StatusBadge status={requestType} />
              </span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatVND(totalRefundAmount)}
            </span>
          </div>
        </div> */}
      </ScrollArea>
    );
  }
);

ProductReceived.displayName = "ProductReceived";
