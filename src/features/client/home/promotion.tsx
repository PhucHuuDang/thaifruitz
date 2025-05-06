"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { CarouselItem } from "@/components/ui/carousel";
import { CarouselCustomized } from "@/components/custom/carousel-customized";

export interface FlashSale {
  id: string;
  name: string;
  image: string;
  description: string;
  percentage: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
}

const Promotion = () => {
  const { data: promotions, isLoading } = useFetch<ApiResponse<FlashSale[]>>(
    "/Promotions",
    ["promotions", "home"]
  );

  // console.log({ promotions });

  if (isLoading) {
    <PromotionSkeleton />;
  }

  return promotions?.value?.length ? (
    <CarouselCustomized title="Sự kiện giảm giá" delay={4000}>
      {promotions?.value?.map((promotion: any) => {
        return (
          <CarouselItem className="hover:cursor-pointer" key={promotion?.id}>
            {/* <PromotionItem promotion={promotion} /> */}
            <div
              key={promotion.id}
              className="relative rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <Image
                className="object-cover w-full h-72 rounded-t-xl"
                // src={"/images/single.jpg"}
                src={promotion.image || "/images/single.jpg"}
                alt={promotion.name}
                height={1000}
                width={1000}
              />
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center bg-gradient-to-r from-slate-500 to-slate-800 backdrop-blur-sm p-6 rounded-3xl w-full max-w-md mx-4">
                  <div className="flex flex-col items-center justify-center mb-4">
                    <h3 className="text-3xl font-bold italic text-white mb-2">
                      {promotion.name}
                    </h3>
                    <span className="text-white text-sm mb-4">
                      {promotion.description}
                    </span>

                    {promotion.maxAmount ? (
                      <span className="text-sm text-white mb-3 line-clamp-2">
                        Giảm tối đa{" "}
                        <span className="text-base font-semibold text-sky-500">
                          {promotion.maxAmount}
                        </span>
                      </span>
                    ) : null}

                    {promotion.percentage ? (
                      <span className="text-sm text-white mb-3 line-clamp-2">
                        Giảm giá{" "}
                        <span className="text-base font-semibold text-sky-500">
                          {promotion.percentage}%
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <Link href={`/promotion/${promotion.id}`}>
                    <Button
                      className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-full font-medium transition-colors duration-200"
                      variant={"outline"}
                      disabled={promotion.isExpired}
                    >
                      {!promotion.isExpired
                        ? "Khám phá ngay"
                        : "Khuyến mãi kết thúc"}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        );
      })}
    </CarouselCustomized>
  ) : null;
};

export default Promotion;

const PromotionSkeleton = () => {
  // Create an array of 3 items to show as skeleton placeholders
  const skeletonItems = Array(3).fill(null);

  return (
    <div className="w-full">
      {/* Title skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Carousel skeleton */}
      <div className="relative overflow-hidden">
        <div className="flex gap-4">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="min-w-[300px] md:min-w-[400px] flex-shrink-0 relative rounded-lg border border-gray-200 shadow-md overflow-hidden"
            >
              {/* Image skeleton */}
              <div className="w-full h-72 bg-gray-200 animate-pulse"></div>

              {/* Content overlay skeleton */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center bg-black/30 backdrop-blur-sm p-6 rounded-xl w-full max-w-md mx-4">
                  {/* Title skeleton */}
                  <div className="h-8 w-3/4 bg-white/30 rounded-lg animate-pulse mx-auto mb-2"></div>

                  {/* Description skeleton - multiple lines */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-white/20 rounded-lg animate-pulse mx-auto"></div>
                    <div className="h-4 w-5/6 bg-white/20 rounded-lg animate-pulse mx-auto"></div>
                  </div>

                  {/* Button skeleton */}
                  <div className="h-10 w-36 bg-white/40 rounded-full animate-pulse mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-white/80 rounded-full shadow-md flex items-center justify-center animate-pulse"></div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 bg-white/80 rounded-full shadow-md flex items-center justify-center animate-pulse"></div>
      </div>
    </div>
  );
};
