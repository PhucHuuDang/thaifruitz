"use client";

import { memo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { FileUpload } from "@/components/global-components/aceternity/file-upload";
import { ReasonContent } from "../order-action-content/reason-content";
import { OrderItem as OrderItemTypes } from "@/features/client/payment/successful/payment-successful.types";
import { GoogleDriveLinkInput } from "@/components/global-components/form/google-drive-link-input";
import {
  ProductInCombo,
  SelectedItemsDetailsType,
} from "../return-order-dialog";
import { useData } from "@/providers/data-provider";
import { OrderItemDetailsTypes } from "../../order-detail-components/order-detail.types";
import { SelectProductStatus } from "./components/select-product-status";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TerminalIcon } from "lucide-react";

interface FirstStepProps {
  orderId: string;
  orderDetail: any;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  selectedItemsDetails: SelectedItemsDetailsType;
  setSelectedItemsDetails: React.Dispatch<
    React.SetStateAction<SelectedItemsDetailsType>
  >;
  itemCondition: string;
  setItemCondition: React.Dispatch<React.SetStateAction<string>>;
  returnReasons: any[];
  selectedReason: string;
  setSelectedReason: React.Dispatch<React.SetStateAction<string>>;
  additionalComments: string;
  setAdditionalComments: React.Dispatch<React.SetStateAction<string>>;
  preferredAction: string;
  setPreferredAction: React.Dispatch<React.SetStateAction<string>>;

  toggleItemSelection: (itemId: string) => void;

  setGoogleDriveLink?: React.Dispatch<React.SetStateAction<string>>;
  googleDriveLink?: string;

  selectProductInCombo: ProductInCombo[];
  setSelectProductInCombo: React.Dispatch<
    React.SetStateAction<ProductInCombo[]>
  >;
}

const itemConditions = [
  { value: "Chưa mở bao bì", label: "Chưa mở bao bì" },
  {
    value: "Đã mở bao bì nhưng chưa sử dụng",
    label: "Đã mở bao bì nhưng chưa sử dụng",
  },
  { value: "Đã dùng thử một phần", label: "Đã dùng thử một phần" },
  {
    value: "Có mùi lạ hoặc hương vị bất thường",
    label: "Có mùi lạ hoặc hương vị bất thường",
  },
  {
    value: "Bị ẩm, mốc hoặc có dấu hiệu hư hỏng",
    label: "Bị ẩm, mốc hoặc có dấu hiệu hư hỏng",
  },
  {
    value: "Bao bì rách, móp khi nhận hàng",
    label: "Bao bì rách, móp khi nhận hàng",
  },
  {
    value: "Hạn sử dụng quá ngắn hoặc đã hết",
    label: "Hạn sử dụng quá ngắn hoặc đã hết",
  },
  { value: "Giao sai loại trái cây sấy", label: "Giao sai loại trái cây sấy" },
];
export const FistStep = memo(
  ({
    additionalComments,
    orderDetail,
    orderId,
    preferredAction,
    returnReasons,
    selectedItems,
    selectedItemsDetails,
    setAdditionalComments,
    setItemCondition,
    setPreferredAction,
    setSelectedItems,
    setSelectedReason,
    setSelectedItemsDetails,
    itemCondition,
    selectedReason,
    toggleItemSelection,

    googleDriveLink,
    setGoogleDriveLink,

    selectProductInCombo,
    setSelectProductInCombo,
  }: FirstStepProps) => {
    // const { combos, customCombo } = useData();

    // console.log("data sau khi duoc lay ve", selectProductInCombo);
    // console.log("san pham don le", selectedItemsDetails);

    const toggleProInductInCombo = (itemId: string, comboId: string) => {
      const isSelected = selectProductInCombo?.some(
        (subItem) => subItem.orderItemDetailId === itemId
      );

      if (isSelected) {
        setSelectProductInCombo((prev) =>
          prev.filter((subItem) => subItem.orderItemDetailId !== itemId)
        );
      } else {
        setSelectProductInCombo((prev) => [
          ...prev,
          {
            orderItemId: comboId,
            orderItemDetailId: itemId,
            images: null,
            quantity: 1, // giá trị mặc định, hoặc lấy từ đâu đó nếu có
            productStatus: "", // giá trị mặc định, ví dụ chuỗi rỗng
          },
        ]);
      }
    };

    const [expandedCombos, setExpandedCombos] = useState<string[]>([]);

    const toggleComboExpand = (comboId: string) => {
      setExpandedCombos((prev) =>
        prev.includes(comboId)
          ? prev.filter((id) => id !== comboId)
          : [...prev, comboId]
      );
    };

    return (
      <div className="p-6 max-h-[60vh] overflow-y-auto motion-preset-focus">
        <Alert className="border-amber-200 mb-2">
          <TerminalIcon className="h-4 w-4" />
          <AlertTitle className="font-semibold text-amber-300">
            Lưu ý!
          </AlertTitle>
          <AlertDescription className="italic underline">
            Trước khi bạn tiến hành yêu cầu đổi trả, hãy đảm bảo rằng thông tin
            bạn gửi lên chính xác với các sản phẩm bạn đã chọn với yêu cầu
          </AlertDescription>
        </Alert>

        <div className="mb-4 flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 px-2 py-1"
          >
            Đã giao hàng
          </Badge>
          <span className="text-sm text-gray-500">
            Đơn hàng{" "}
            <span className="text-sky-500 font-semibold text-base underline">
              #{orderId}
            </span>
          </span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Chọn sản phẩm muốn trả
            </h3>

            {setGoogleDriveLink && (
              <GoogleDriveLinkInput
                label="Link Google Drive ảnh(video) chứng minh?"
                linkGoogleDrive={googleDriveLink}
                setLinkGoogleDrive={setGoogleDriveLink}
              />
            )}
          </div>
          <ScrollArea className="h-[400px] md:h-[600px] lg:h-[700px]">
            {/* // Inside FistStep component */}
            {orderDetail.data?.value?.orderItems.map(
              (
                item: OrderItemTypes & {
                  orderItemDetails: OrderItemDetailsTypes;
                }
              ) => {
                const isCombo =
                  item?.itemType?.toLowerCase() === "combo" ||
                  item?.itemType?.toLowerCase() === "custom";

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start w-full gap-3 p-3 rounded-lg border transition-all duration-200",
                      selectedItems.includes(item.id)
                        ? "border-sky-200 bg-sky-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={
                        selectedItems.includes(item.id) ||
                        selectProductInCombo?.some(
                          (subItem) => subItem.orderItemId === item.id
                        )
                      }
                      onCheckedChange={(checked) => {
                        if (
                          item.itemType.toLowerCase() === "combo" ||
                          item.itemType.toLowerCase() === "custom"
                        ) {
                          toggleProInductInCombo("", item.id); // sản phẩm combo
                        } else {
                          toggleItemSelection(item.id); // sản phẩm đơn
                        }

                        // item.itemType.toLowerCase() !== "custom" &&
                        // item.itemType.toLowerCase() !== "combo"
                        //   ? toggleItemSelection(item.id)
                        //   : toggleProInductInCombo(item.id, item.id)
                      }}
                      className={cn(
                        selectedItems.includes(item.id)
                          ? "border-sky-500 text-sky-500"
                          : ""
                      )}
                    />
                    <div className="flex flex-col items-start flex-1 w-full">
                      <div className="w-full">
                        <OrderItem item={item} />
                      </div>

                      {/* Handle combo products */}
                      {isCombo &&
                        selectProductInCombo.some(
                          (subItem) => subItem.orderItemId === item.id
                        ) && (
                          <div className="w-full">
                            {item.orderItemDetails.map((itemDetail) => {
                              const itemDetailEnriched: OrderItemTypes = {
                                ...itemDetail,
                                referenceId: itemDetail.id,
                                image: itemDetail.image,
                                itemType: "Single",
                                customImages: null,
                                discountPrice: itemDetail.discountedPrice,
                                percentage: itemDetail.discountPercentage,
                                quantity: itemDetail.quantity,
                                name: itemDetail.name,
                                isCanFeedback: true,
                                unitPrice: itemDetail.unitPrice,
                              };

                              const isComboItemSelected =
                                selectProductInCombo?.some(
                                  (subItem) =>
                                    subItem.orderItemDetailId === itemDetail.id
                                );

                              return (
                                <div
                                  key={itemDetail.id}
                                  className={cn(
                                    "flex items-start w-full gap-3 p-3 rounded-lg border transition-all duration-200",
                                    selectProductInCombo?.some(
                                      (subItem) =>
                                        subItem.orderItemId === item.id
                                    )
                                      ? // ?.productStatus
                                        "border-sky-200 bg-sky-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  )}
                                >
                                  <Checkbox
                                    id={`item-${itemDetail.id}`}
                                    checked={
                                      selectProductInCombo?.find(
                                        (subItem) =>
                                          subItem.orderItemDetailId ===
                                          itemDetail.id
                                      )?.orderItemDetailId === itemDetail.id

                                      // ?.orderItemDetailId === itemDetail.id
                                    }
                                    onCheckedChange={() =>
                                      toggleProInductInCombo(
                                        itemDetail.id,
                                        item.id
                                      )
                                    }
                                    className={cn(
                                      selectProductInCombo?.find(
                                        (subItem) =>
                                          subItem.orderItemDetailId ===
                                          itemDetail.id
                                      )?.orderItemDetailId === itemDetail.id
                                        ? "border-sky-500 text-sky-500"
                                        : ""
                                    )}
                                  />
                                  <div className="w-full">
                                    <div className="w-full mb-2">
                                      <OrderItem item={itemDetailEnriched} />
                                    </div>

                                    {selectProductInCombo?.some(
                                      (subItem) =>
                                        subItem.orderItemDetailId ===
                                        itemDetail.id
                                    ) && (
                                      // <div className="w-full ">
                                      <SelectProductStatus
                                        item={{
                                          orderItemDetailId: itemDetail.id,
                                          orderItemId: item.id,
                                          quantity: itemDetail.quantity,
                                        }}
                                        selectProductInCombo={
                                          selectProductInCombo
                                        }
                                        setSelectProductInCombo={
                                          setSelectProductInCombo
                                        }
                                      />
                                      // </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      {/* Handle single products */}
                      {!isCombo && selectedItems.includes(item.id) && (
                        <div className="w-full">
                          <div className="flex items-center gap-2 my-2 w-full">
                            <div className="mb-6 flex-1 w-full">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Tình trạng sản phẩm
                              </h3>
                              <Select
                                value={
                                  selectedItemsDetails[item.id]?.productStatus
                                }
                                onValueChange={(value) =>
                                  setSelectedItemsDetails((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      productStatus: value,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn tình trạng sản phẩm" />
                                </SelectTrigger>
                                <SelectContent>
                                  {itemConditions.map((condition) => (
                                    <SelectItem
                                      key={condition.value}
                                      value={condition.value}
                                    >
                                      {condition.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="mb-6 flex-1 w-full">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Số lượng sản phẩm
                              </h3>
                              <Select
                                value={
                                  selectedItemsDetails[
                                    item.id
                                  ]?.quantity?.toString() ?? "1"
                                }
                                onValueChange={(value) =>
                                  setSelectedItemsDetails((prev) => ({
                                    ...prev,
                                    [item.id]: {
                                      ...prev[item.id],
                                      quantity: parseInt(value),
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn số lượng" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: item.quantity })
                                    .fill(0)
                                    .map((_, index) => (
                                      <SelectItem
                                        key={index}
                                        value={(index + 1).toString()}
                                      >
                                        {index + 1}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="mb-4">
                            <Label className="text-sm font-medium text-slate-700 mb-2">
                              Tải ảnh minh chứng
                            </Label>
                            <FileUpload
                              onChange={(files: File[]) =>
                                setSelectedItemsDetails((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...prev[item.id],
                                    images: files,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </ScrollArea>
        </div>

        <ReasonContent
          reasons={returnReasons}
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
          additionalComments={additionalComments}
          setAdditionalComments={setAdditionalComments}
          preferredAction={preferredAction}
          setPreferredAction={setPreferredAction}
        />
      </div>
    );
  }
);

FistStep.displayName = "FistStep";
