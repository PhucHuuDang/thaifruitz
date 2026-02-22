"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TagIcon,
  InfoIcon,
  PackageIcon,
  TruckIcon,
  StarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatVND } from "@/lib/format-currency";
import { CategoryTypes, useCartStore } from "@/hooks/use-cart-store";
import { AdvancedColorfulBadges } from "../badge/advanced-badge";
import StatusButton from "@/components/custom/_custom-button/status-button";
import { toast } from "sonner";
import { useFromStore } from "@/hooks/use-from-store";
import { omit } from "lodash";

interface ProductVariant {
  productId: string;
  productVariantId: string;
  name: string;
  image: string;
  packageType: string;
  netWeight: number;
  price: number;
  quantity: number;
}

export interface ComboProduct {
  id: string;
  name: string;
  image: string;
  quantity: number;
  event: string;
  description: string;
  price: number;
  save: number;
  netWeight: number;
  categories: CategoryTypes[];
  variant: ProductVariant[];
  quantitySold: number;
  rating: number;

  type: "combo";
}

interface ComboProductCardProps {
  product: ComboProduct;
}

export default function ComboProductCard({ product }: ComboProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const cartActions = useCartStore((state) => state);

  const cart = useFromStore(useCartStore, (state) => state.orders);

  const existCombo = cart?.find((item) => item.id === product.id);

  const originalPrice = product.price + product.save;
  const discountPercentage = Math.round((product.save / originalPrice) * 100);

  const ordersData = {
    id: product.id,
    categories: product.categories,
    mainImageUrl: product.image,
    name: product.name,
    // : product.price,
    description: product.description,
    quantitySold: product.quantitySold,
    rating: product.rating,
    variant: {
      productVariantId: product.id,
      netWeight: product.netWeight,
      price: originalPrice,
      stockQuantity: product.quantity,
      packageType: product.event,

      // imageVariant: product.variant

      promotion: {
        price: product.price,
        endDate: "",
        startDate: "",
        percentage: discountPercentage,
      },
    },

    type: product.type,
    quantityOrder: existCombo?.quantityOrder ?? 1,
  };

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-md cardStyle motion-preset-pop">
      <div className="grid md:grid-cols-5 gap-0">
        {/* Product Image */}
        <div className="relative h-[280px] md:h-full md:col-span-2 overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-3xl"
            priority
          />
          {product.event && (
            <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 text-xs">
              {product.event}
            </Badge>
          )}
          {/* {product.save > 0 && (
            <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600 text-xs">
              -{discountPercentage}%
            </Badge>
          )} */}
        </div>

        {/* Product Details */}
        <CardContent className="p-4 md:p-5 flex flex-col h-full md:col-span-3">
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs ml-1">Mới</span>
                </div>
              </div>

              <div className="flex items-center  gap-1 mt-1">
                {product.categories.slice(0, 2).map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className="text-xs px-2 py-0 h-5 text-[#9333ea] border border-[#9333ea]"
                  >
                    {category.name}
                  </Badge>
                ))}

                {product.categories.length > 3 ? (
                  <span className="text-sm text-gray-500">
                    +{product.categories.length - 3} loại
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-sky-600">
                {formatVND(product.price)}
              </span>
              {product.save > 0 && (
                <span className="text-base text-rose-400 line-through">
                  {formatVND(originalPrice)}
                </span>
              )}
            </div>

            {product.save > 0 && (
              <>
                <span className="text-sm font-thin text-slate-700">
                  Tiết kiệm:{" "}
                  <AdvancedColorfulBadges
                    color="maroon"
                    className=" rounded-3xl text-xs"
                    size="sm"
                  >
                    -{formatVND(product.save)}
                  </AdvancedColorfulBadges>
                </span>
              </>
            )}

            <span className="text-sm text-slate-800 line-clamp-2">
              {product.description}
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <TagIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-semibold">
                  {product.netWeight}g
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShoppingCartIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-semibold">
                  Còn {product.quantity}
                </span>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">
                  Bao gồm ({product.variant.length}):
                </h3>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <InfoIcon className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span className="text-xs">
                        Xem chi tiết trong tab sản phẩm
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {product.variant.slice(0, 5).map((item, index) => (
                  <TooltipProvider
                    key={`${item.name}-${item.productVariantId}-${index}`}
                    delayDuration={100}
                  >
                    <Tooltip>
                      <TooltipTrigger
                        asChild
                        className="cursor-pointer hoverAnimate"
                      >
                        <div className="relative h-12 w-full rounded-md overflow-hidden border border-border/50">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <span className="text-xs font-medium">{item.name}</span>
                        <span className="text-xs">
                          {formatPrice(item.price)}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {product.variant.length > 5 && (
                  <div className="relative h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      +{product.variant.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center w-full gap-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (Number(existCombo?.quantityOrder) > 1) {
                    cartActions.decreaseQuantity(ordersData);
                    toast.success("Đã giảm số lượng Combo trong giỏ hàng");
                  }
                }}
                disabled={Number(existCombo?.quantityOrder) <= 1}
                className="h-8 w-8 rounded-none"
              >
                <MinusIcon className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">
                {existCombo?.quantityOrder ?? 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  cartActions.addOrder(omit(ordersData, "quantityOrder"));
                  toast.success("Thêm số lượng Combo trong giỏ hàng");
                }}
                disabled={Number(existCombo?.quantityOrder) >= product.quantity}
                className="h-8 w-8 rounded-none"
              >
                <PlusIcon className="h-3 w-3" />
              </Button>
            </div>

            <StatusButton
              handleAddToCart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                cartActions.addOrder({
                  id: product.id,
                  categories: product.categories,
                  mainImageUrl: product.image,
                  name: product.name,
                  // : product.price,
                  description: product.description,
                  quantitySold: product.quantitySold,
                  rating: product.rating,
                  variant: {
                    productVariantId: product.id,
                    netWeight: product.netWeight,
                    price: originalPrice,
                    stockQuantity: product.quantity,
                    packageType: product.event,

                    promotion: {
                      price: product.price,
                      endDate: "",
                      startDate: "",
                      percentage: discountPercentage,
                    },
                  },

                  type: product.type,
                  quantityOrder: quantity,
                });
              }}
              className="h-8 flex-1 min-w-0 text-xs w-full sm:w-auto"
            />
          </div>
        </CardContent>
      </div>

      <Tabs defaultValue="details" className="px-4 py-3">
        <Accordion
          type="single"
          defaultValue="information"
          collapsible
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="details" className="text-xs">
              <InfoIcon className="h-3.5 w-3.5 mr-1.5" /> Chi tiết
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs">
              <PackageIcon className="h-3.5 w-3.5 mr-1.5" /> Sản phẩm
            </TabsTrigger>
            <TabsTrigger value="shipping" className="text-xs">
              <TruckIcon className="h-3.5 w-3.5 mr-1.5" /> Vận chuyển
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-3">
            <div className="bg-muted/30 cardStyle p-3">
              <AccordionItem value="information">
                <AccordionTrigger>
                  <div className="flex items-center mb-2">
                    <InfoIcon className="h-4 w-4 text-primary mr-2" />
                    <h3 className="text-sm font-medium">Thông tin sản phẩm</h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-3">
                    <div className="bg-background rounded-md p-2.5  cardStyle">
                      <h4 className="text-xs font-semibold text-slate-700 mb-1.5">
                        Mô tả
                      </h4>
                      <span className="text-xs text-slate-800 leading-relaxed">
                        {product.description ||
                          "Combo Hè Rực Rỡ bao gồm các loại trái cây sấy cao cấp, được tuyển chọn kỹ lưỡng và chế biến theo công nghệ hiện đại, giữ nguyên hương vị tự nhiên và các dưỡng chất có lợi cho sức khỏe."}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 ">
                      <div className="bg-background rounded-md p-2.5  cardStyle">
                        <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                          Thông số
                        </h4>
                        <ul className="space-y-1.5">
                          <li className="flex justify-between text-xs">
                            <span className="text-slate-800">Trọng lượng:</span>
                            <span className="font-medium">
                              {product.netWeight}g
                            </span>
                          </li>
                          <li className="flex justify-between text-xs">
                            <span className="text-slate-800">Số lượng:</span>
                            <span className="font-medium">
                              {product.quantity} sản phẩm
                            </span>
                          </li>
                          <li className="flex justify-between text-xs">
                            <span className="text-slate-800">Sự kiện:</span>
                            <span className="font-medium">{product.event}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-background rounded-md p-2.5 cardStyle">
                        <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                          Phân loại
                        </h4>
                        <ul className="space-y-1.5">
                          <li className="flex justify-between text-xs">
                            <span className="text-slate-800">Danh mục:</span>
                            <span className="font-medium">
                              {product.categories.map((c) => c.name).join(", ")}
                            </span>
                          </li>
                          <li className="flex justify-between text-xs">
                            <span className="text-slate-800">Mã sản phẩm:</span>
                            <span className="font-medium">
                              {product.id.substring(0, 8)}
                            </span>
                          </li>
                          <li className="flex justify-between text-xs">
                            <span className="text-slate-800">Đã bán:</span>
                            <span className="font-medium">
                              {product.quantitySold} sản phẩm
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-background rounded-md p-2.5  cardStyle">
                      <h4 className="text-xs font-semibold text-slate-900 mb-1.5">
                        Lợi ích
                      </h4>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <li className="flex items-center text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span>Giàu vitamin và khoáng chất</span>
                        </li>
                        <li className="flex items-center text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span>Không chất bảo quản</span>
                        </li>
                        <li className="flex items-center text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span>Tiện lợi, dễ bảo quản</span>
                        </li>
                        <li className="flex items-center text-xs">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span>Thích hợp cho mọi lứa tuổi</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-3">
            <div className="bg-muted/30 cardStyle p-3">
              <AccordionItem value="products">
                <AccordionTrigger className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <PackageIcon className="h-4 w-4 text-primary mr-2" />
                    <h3 className="text-sm font-medium">
                      Sản phẩm trong combo
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs h-5">
                    {product.variant.length} sản phẩm
                  </Badge>
                  {/* </div> */}
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin cardStyle">
                    {product.variant.map((item, index) => (
                      <div
                        key={item.productVariantId}
                        className="bg-background rounded-md p-2 border border-border/50 flex gap-3 hover:border-primary/30 transition-colors"
                      >
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-border/50">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[10px] px-1 rounded">
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate">
                              {item.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-4"
                            >
                              {item.netWeight}g
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-800 truncate mt-0.5">
                            {item.packageType}
                          </p>

                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center">
                              <TagIcon className="h-3 w-3 text-slate-800 mr-1" />
                              <span className="text-xs text-slate-800">
                                SL: {item.quantity}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-primary">
                              {formatVND(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 bg-background rounded-md p-2.5  cardStyle">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium">
                        Tổng giá trị sản phẩm:
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs line-through text-slate-800">
                          {formatPrice(
                            product.variant.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0,
                            ),
                          )}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                      <span className="text-xs text-green-600">
                        Tiết kiệm {formatPrice(product.save)} khi mua combo
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="mt-3">
            <div className="bg-muted/30 cardStyle p-3">
              <AccordionItem value="policy">
                <AccordionTrigger>
                  <div className="flex items-center mb-2">
                    <TruckIcon className="h-4 w-4 text-slate-700 mr-2" />
                    <h3 className="text-sm font-medium">
                      Thông tin vận chuyển & bảo quản
                    </h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-3">
                    <div className="bg-background rounded-md p-2.5  cardStyle">
                      <h4 className="text-xs font-semibold text-slate-700 mb-1.5">
                        Phương thức vận chuyển
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <TruckIcon className="h-3 w-3 text-primary" />
                          </div>
                          <div className="ml-2">
                            <span className="text-xs font-medium">
                              Giao hàng tiêu chuẩn
                            </span>
                            <span className="text-xs text-slate-800">
                              Khoảng 2-3 ngày làm việc
                            </span>
                          </div>
                          <div className="ml-auto text-xs font-semibold text-sky-600">
                            20.000₫
                          </div>
                        </div>

                        {/* <div className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <TruckIcon className="h-3 w-3 text-primary" />
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium">
                              Giao hàng nhanh
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1-2 ngày làm việc
                            </p>
                          </div>
                          <div className="ml-auto text-xs font-medium">
                            50.000₫
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 ">
                      <div className="bg-background rounded-md p-2.5  cardStyle">
                        <h4 className="text-xs font-semibold text-slate-800 mb-1.5">
                          Chính sách đổi trả
                        </h4>
                        <ul className="space-y-1.5">
                          <li className="flex items-start text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 mr-1.5 flex-shrink-0"></div>
                            <span>Đổi trả miễn phí trong 7 ngày</span>
                          </li>
                          <li className="flex items-start text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 mr-1.5 flex-shrink-0"></div>
                            <span>Sản phẩm còn nguyên bao bì</span>
                          </li>
                          <li className="flex items-start text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 mr-1.5 flex-shrink-0"></div>
                            <span>Hoàn tiền trong vòng 24h</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-background rounded-md p-2.5  cardStyle">
                        <h4 className="text-xs font-semibold text-slate-800 mb-1.5">
                          Hướng dẫn bảo quản
                        </h4>
                        <ul className="space-y-1.5">
                          <li className="flex items-start text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 mr-1.5 flex-shrink-0"></div>
                            <span>Bảo quản nơi khô ráo, thoáng mát</span>
                          </li>
                          <li className="flex items-start text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 mr-1.5 flex-shrink-0"></div>
                            <span>Tránh ánh nắng trực tiếp</span>
                          </li>
                          <li className="flex items-start text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 mr-1.5 flex-shrink-0"></div>
                            <span>Sử dụng trong vòng 6 tháng</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-background rounded-md p-2.5  cardStyle">
                      <h4 className="text-xs font-semibold text-slate-800 mb-1.5">
                        Khu vực giao hàng
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Giao hàng toàn quốc. Miễn phí giao hàng cho đơn hàng từ
                        500.000₫ trong khu vực nội thành Hà Nội và TP. Hồ Chí
                        Minh.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </div>
          </TabsContent>
        </Accordion>
      </Tabs>
    </Card>
  );
}
