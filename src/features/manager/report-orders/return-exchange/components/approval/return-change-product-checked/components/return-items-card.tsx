import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Info, Package } from "lucide-react";
import StatusBadge from "./status-badge";
import { formatVND } from "@/lib/format-currency";
import { ReturnExchangeRequestItem } from "../types/return-exchange";
import { OrderReturnItem } from "@/types/order-detail.types";
import { CustomComboThumbnail } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import ImagePreview from "@/components/custom/_custom-image/image-preview";
import ProductStatusBadge from "./product-status-badge";

interface ReturnItemCardProps {
  item: OrderReturnItem;
}

export default function ReturnItemCard({ item }: ReturnItemCardProps) {
  const productDetail = item.orderItem.orderItemDetails?.[0];
  const productImage =
    productDetail?.image ||
    item.orderItem.image ||
    (item.orderItem.customImages && item.orderItem.customImages[0]);

  return (
    <Card className="overflow-hidden border  transition-colors">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex items-center justify-center p-4">
            {productImage ? (
              <>
                <div className="relative">
                  <Image
                    // src="/images/third-background.png"
                    src={productImage ?? ""}
                    alt={productDetail?.name || item.orderItem.name}
                    width={500}
                    height={240}
                    className="h-60 w-full object-cover rounded-xl z-40 group-hover/card:scale-105 cursor-pointer transition duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

                  <div className="absolute top-2 right-2">
                    <StatusBadge status={item.requestItemStatus} />
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                <Package className="h-10 w-10 text-slate-400" />
              </div>
            )}
            {/* </div> */}
          </div>

          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {productDetail?.name || item.orderItem.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-700 font-semibold">
                    Số lượng: {item.customerQuantity}
                  </span>
                  <ProductStatusBadge status={item.productStatus} />

                  {/* <AdvancedColorfulBadges size="md" color="violet">
                    {item.productStatus}
                  </AdvancedColorfulBadges> */}
                </div>

                {/* <AdvancedColorfulBadges size="md" color="violet">
                  {item.productStatus}
                </AdvancedColorfulBadges> */}
                <p className="text-sm text-slate-600 mt-2 font-semibold">
                  {item.productStatus}
                </p>
              </div>

              <div className="text-right mt-2 md:mt-0 space-x-2">
                <span className="font-semibold text-lg text-sky-600">
                  {formatVND(
                    productDetail?.discountedPrice ||
                      item.orderItem.discountPrice
                  )}
                </span>

                {productDetail?.discountPercentage &&
                productDetail?.discountPercentage > 0
                  ? productDetail?.unitPrice > 0 && (
                      <span className="text-sm text-rose-500 font-semibold line-through">
                        {formatVND(productDetail?.unitPrice)}
                      </span>
                    )
                  : null}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <Info className="h-4 w-4 text-slate-400" />
                  Tình trạng sản phẩm
                </h4>
                <AdvancedColorfulBadges size="lg" color="violet">
                  {item.productStatus}
                </AdvancedColorfulBadges>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                  Hình ảnh từ khách hàng
                </h4>
                {item.customerImage ? (
                  <ImagePreview
                    images={[item.customerImage]}
                    alt="Customer provided image"
                    initialHeight={130}
                    initialWidth={130}
                    className="object-cover size-32 rounded-3xl"
                  />
                ) : (
                  // <div className="relative h-24 w-24 rounded-md overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">

                  //   <ImagePreview
                  //     images={[item.customerImage]}
                  //     alt="Customer provided image"
                  //     initialHeight={100}
                  //     initialWidth={100}
                  //     className="object-cover size-full"
                  //   />
                  //   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  // </div>
                  <p className="text-sm text-slate-500 bg-slate-50 p-2 rounded-md">
                    Không có hình ảnh
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
