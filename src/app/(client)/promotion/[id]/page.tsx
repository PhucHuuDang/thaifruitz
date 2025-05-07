"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/format-currency";
import { Calendar, Clock, Percent, ShoppingCart, Tag } from "lucide-react";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useCartStore } from "@/hooks/use-cart-store";

interface ProductVariant {
    productId: string;
    productVariantId: string;
    productName: string;
    image: string,
    packagingType: string;
    netWeight: number;
    price: number;
    discountPrice: number;
    quantity: number;
    quantitySold: number;
}

interface Promotion {
    promotionId: string;
    name: string;
    image: string;
    description: string;
    percentage: number;
    startDate: string;
    endDate: string;
    productVariants: ProductVariant[];
}

const PromotionPage = () => {
    const cartActions = useCartStore((state) => state);
    const { id }: { id: string } = useParams();

    const { data: promotion } = useFetch<ApiResponse<Promotion>>(
        `/Promotions/${id}`,
        ["Promotion", id]
    );

    if (!promotion?.value) return <></>;

    const now = new Date();
    const startDate = new Date(promotion.value.startDate);
    const endDate = new Date(promotion.value.endDate);
    const isActive = now >= startDate && now < endDate;
    const timeRemaining = isActive
        ? formatDistance(endDate, now, { locale: vi, addSuffix: false })
        : "Đã kết thúc";

    const handleAddToCart = (productVariant: ProductVariant) => {
        cartActions.addOrder({
            id: productVariant.productId,
            variant: {
                productVariantId: productVariant.productVariantId,
                netWeight: productVariant.netWeight,
                price: productVariant.price,
                packageType: productVariant.packagingType,
                discountPrice: productVariant.discountPrice,
                stockQuantity: productVariant.quantity - productVariant.quantitySold,
                promotion: {
                    startDate: promotion.value?.startDate as string,
                    endDate: promotion.value?.endDate as string,
                    percentage: promotion.value?.percentage as number,
                    price: productVariant.discountPrice
                },
                imageVariant: productVariant.image,
            },
            categories: [],
            description: "",
            quantitySold: 0,
            rating: 0,
            type: "single",
            mainImageUrl: productVariant.image,
            name: productVariant.productName,
        });

        toast.success(
            `Đã thêm vào giỏ hàng ${1} ${productVariant.productName} - ${productVariant.packagingType}`
        );
    };

    return (
        <div className="md:p-32">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <Image
                                src={promotion.value.image ?? "/images/dried-fruit.webp"}
                                alt={promotion.value.name}
                                width={500}
                                height={500}
                                className="object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-6">
                            <h1 className="text-3xl font-bold text-red-600 mb-2">
                                {promotion.value.name}
                            </h1>
                            <p className="text-gray-700 mb-4">{promotion.value.description}</p>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                                    <div className="text-sm text-gray-500">Thời gian:</div>
                                    <div className="ml-5">
                                        {formatTimeVietNam(new Date(promotion.value.startDate))} -{" "}
                                        {formatTimeVietNam(new Date(promotion.value.endDate))}
                                    </div>

                                </div>

                                <div className="flex items-center">
                                    <Percent className="w-5 h-5 mr-2 text-gray-500" />

                                    <div className="text-sm text-gray-500">Giảm giá:</div>
                                    <div className="font-semibold ml-5">
                                        {promotion.value.percentage}%
                                    </div>

                                </div>

                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                                    <div className="text-sm text-gray-500">
                                        Thời gian còn lại:
                                    </div>
                                    <div className="font-semibold text-amber-600 ml-5">
                                        {isActive ? timeRemaining : "Đã kết thúc"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Tag className="w-6 h-6 mr-2" />
                        Sản phẩm trong chương trình
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {promotion.value.productVariants.map((variant) => {
                            const remaining = variant.quantity - variant.quantitySold;
                            const soldPercentage = (variant.quantitySold / variant.quantity) * 100;

                            return (
                                <Card key={variant.productVariantId} className="overflow-hidden">
                                    <div className="aspect-video relative bg-gray-100">
                                        <Image
                                            src={variant.image}
                                            alt={variant.productName}
                                            width={400}
                                            height={300}
                                            className="w-full h-full object-contain p-4"
                                        />
                                        <div className="absolute top-0 right-0 bg-red-600 text-white font-bold py-1 px-3 rounded-bl-lg">
                                            {promotion?.value?.percentage}%
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">
                                            {variant.productName}
                                        </h3>

                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <span>
                                                {variant.packagingType}g • {variant.netWeight}g
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-lg font-bold text-red-600">
                                                {formatVND(variant.discountPrice)}
                                            </span>
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatVND(variant.price)}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span>
                                                    Đã bán: <strong>{variant.quantitySold}</strong>
                                                </span>
                                                <span>
                                                    Còn lại: <strong>{remaining > 0 ? remaining : 0}</strong>
                                                </span>
                                            </div>
                                            <Progress value={soldPercentage} className="h-2" />
                                        </div>

                                        {isActive && (
                                            <Button
                                                className="w-full h-12 text-lg gap-2 bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all"
                                                onClick={() => handleAddToCart(variant)}
                                                disabled={remaining <=0 }
                                            >
                                                {remaining > 0 ? <>
                                                    <ShoppingCart className="size-8" />
                                                    Thêm vào giỏ hàng
                                                </> : "Hết hàng"}

                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PromotionPage;
