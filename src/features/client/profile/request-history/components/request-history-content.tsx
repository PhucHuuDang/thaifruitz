import { memo } from "react";
import { ProveImages } from "./prove-images";
import { ChevronDown, ChevronUp, Clock, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { returnExchangeStatusIcon } from "@/features/manager/report-orders/return-exchange/return-exchange-status/update-status";
import {
  ReturnExchangeRequest,
  ReturnExchangeRequestItem,
} from "../request-history";

import { OrderItem as OrderItemTypes } from "@/features/client/payment/successful/payment-successful.types";

import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  justReturnExchangeLabel,
  returnExchangeLabel,
} from "@/features/manager/report-orders/return-exchange/return-exchange-status/status";

interface RequestHistoryContentProps {
  request: ReturnExchangeRequest;

  groupedItems: Record<string, ReturnExchangeRequestItem[]>;

  toggleGroup: (groupId: string) => void;
  expandedGroups: Record<string, boolean>;

  expandedItems: Record<string, boolean>;

  toggleItemDetails: (itemId: string) => void;
}
export const RequestHistoryContent = memo(
  ({
    request,
    groupedItems,
    expandedGroups,
    toggleGroup,
    expandedItems,
    toggleItemDetails,
  }: RequestHistoryContentProps) => {
    return (
      <Card className="overflow-hidden cardStyle motion-preset-slide-right mt-1">
        <CardHeader className="bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Yêu cầu {justReturnExchangeLabel(request.requestType)} #
                {request.orderId}
              </CardTitle>
              <CardDescription className="mt-1 flex flex-col items-start gap-y-3">
                <span className="flex items-center gap-1 text-slate-700">
                  <Clock className="h-4 w-4" />
                  Ngày yêu cầu: {vietnameseDate(request.requestDate, true)}
                </span>
                <span className="text-sky-500 font-semibold underline">
                  {formatRelativeTime(request.requestDate)}
                </span>
              </CardDescription>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              {/* <StatusBadge status={request.requestStatus} /> */}
              <div className="flex items-center gap-1">
                {returnExchangeStatusIcon(request.requestStatus)}
                {returnExchangeLabel(request.requestStatus)}
              </div>
              <span className="text-sm font-semibold">
                Lý do: {request.reason}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {Object.entries(groupedItems).map(([referenceId, items]) => {
            // const hasImages= items[0].

            // items[0].

            const firstChild = items[0].orderItem;

            const combo: OrderItemTypes = {
              customImages: firstChild.customImages,
              discountPrice: firstChild.discountPrice,
              id: firstChild.id,
              referenceId: firstChild.referenceId,
              image: firstChild.image,
              itemType: firstChild.itemType,
              name: firstChild.name,
              percentage: firstChild.percentage,
              quantity: firstChild.quantity,
              unitPrice: firstChild.unitPrice,
              isCanFeedback: firstChild.isCanFeedback,
            };

            return (
              <div key={referenceId} className="border-b last:border-b-0">
                <div
                  className="p-4 flex  flex-col cursor-pointer hover:bg-muted/20 transition-colors w-full"
                  onClick={() => toggleGroup(referenceId)}
                >
                  <OrderItem item={combo} />
                  <div className="w-full"></div>

                  <div className="flex items-center gap-2 mt-1.5">
                    {/* <span className="text-sm font-medium">
                  {formatCurrency(items[0].orderItem.discountPrice)}
                </span> */}
                    {expandedGroups[referenceId] ? (
                      <div className="flex items-center gap-x-1 motion-preset-shake ">
                        <ChevronUp className="h-5 w-5" />
                        <span className="font-semibold text-slate-700">
                          Thu gọn chi tiết
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-x-1 motion-preset-shake ">
                        <ChevronDown className="h-5 w-5" />
                        <span className="font-semibold text-slate-700">
                          Xem chi tiết
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {expandedGroups[referenceId] && (
                  <div className="px-4 pb-4 motion-preset-bounce">
                    {items.map((item) => (
                      <div
                        key={item.returnExchangeRequestItemId}
                        className="mt-3 pl-4 border-l-2 border-muted"
                      >
                        <ProveImages
                          customerImage={item.customerImage}
                          productStatus={item.productStatus}
                          receiveImage={item.receiveImage}
                          note={item.note}
                          acceptQuantity={item.acceptQuantity}
                          refundAmount={item.refundAmount}
                          receiveQuantity={item.receiveQuantity}
                          customerQuantity={item.customerQuantity}
                        />

                        {item.orderItem.orderItemDetails &&
                          item.orderItem.orderItemDetails.length > 0 && (
                            <div className="mt-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 mb-2 h-8 font-semibold hover:underline"
                                onClick={() =>
                                  toggleItemDetails(
                                    item.returnExchangeRequestItemId
                                  )
                                }
                              >
                                {expandedItems[
                                  item.returnExchangeRequestItemId
                                ] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                Chi tiết sản phẩm
                              </Button>

                              {expandedItems[
                                item.returnExchangeRequestItemId
                              ] && (
                                <div className="bg-muted/20 rounded-md p-3 space-y-3 motion-preset-focus">
                                  {item.orderItem.orderItemDetails.map(
                                    (detail) => {
                                      const orderItem: OrderItemTypes = {
                                        id: detail.id,
                                        referenceId: detail.productVariantId,
                                        customImages: null,
                                        discountPrice: detail.discountedPrice,
                                        image: detail.image,
                                        quantity: detail.quantity,
                                        itemType: "Single",
                                        name: detail.name,
                                        percentage: detail.discountPercentage,
                                        unitPrice: detail.unitPrice,
                                        isCanFeedback: false,
                                      };

                                      return (
                                        <OrderItem
                                          item={orderItem}
                                          key={detail.id}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                        <Separator className="my-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }
);

RequestHistoryContent.displayName = "RequestHistoryContent";
