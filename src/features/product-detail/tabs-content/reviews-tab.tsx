"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  MessageCircleHeartIcon,
  MessageCircleQuestionIcon,
  MessageSquareHeartIcon,
  Star,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { OverallRate, ProductDetailTypes } from "../product-detail.types";
import { placeholderImage } from "@/utils/label";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { FEEDBACK_KEY } from "@/app/key/admin-key";

import { Skeleton } from "@/components/ui/skeleton";
import { ApiResponse, PageResult } from "@/types/types";

import { NotData } from "@/components/global-components/no-data";
import ImagePreview from "@/components/custom/_custom-image/image-preview";
import { Feedback } from "@/features/feedback/list-feedback";

interface ReviewsTabProps {
  overallRatingResponse: OverallRate;

  productId: string;
}

const starRecord: {
  star: number;
  key: keyof OverallRate;
}[] = [
  { star: 5, key: "fiveStar" },
  { star: 4, key: "fourStar" },
  { star: 3, key: "threeStar" },
  { star: 2, key: "twoStar" },
  { star: 1, key: "oneStar" },
];

export const ReviewsTab = memo(
  ({ overallRatingResponse, productId }: ReviewsTabProps) => {
    const feedbackData = useFetch<
      ApiResponse<
        PageResult<
          Feedback & {
            rating: number;
          }
        >
      >
    >(`/Feedbacks/product/${productId}`, [FEEDBACK_KEY.FEEDBACK]);

    if (feedbackData.isLoading) {
      return <ReviewSkeleton />;
    }

    // if (feedbackData.data?.value?.items.length === 0) {
    //   return (
    //     <NotData
    //       title="Chưa có đánh giá nào"
    //       description="Hãy là người đầu tiên đánh giá sản phẩm này!"
    //       className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl w-full h-full"
    //       icons={[StarIcon, MessageSquareHeartIcon, MessageCircleQuestionIcon]}
    //     />
    //   );
    // }

    const safeFeedbackData = feedbackData.data?.value?.items ?? [];

    const total = overallRatingResponse?.quantityFeedback || 0;

    const getPercent = (count: number) =>
      total > 0 ? Math.round((count / total) * 100) : 0;

    // console.log("danh gia tong quan o day: ", overallRatingResponse)

    return (
      <div className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-lg shadow-sm cardStyle">
              <h3 className="text-lg font-semibold mb-4">Đánh giá tổng quan</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-sky-600">
                  {/* {overallRatingResponse?.overallRating?.toFixed(1) ?? "0.0"} */}
                  {overallRatingResponse?.overallRating}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => {
                      const rating = overallRatingResponse?.overallRating || 0;
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(rating)
                              ? "fill-amber-500"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-slate-600 font-semibold">
                    Dựa trên {overallRatingResponse?.quantityFeedback ?? 0} đánh
                    giá
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {starRecord.map(({ star, key }) => {
                  const total = overallRatingResponse?.quantityFeedback || 0;
                  const count = overallRatingResponse?.[key] || 0;
                  // const percent =
                  //   total > 0 ? Math.round((count / total) * 100) : 0;

                  return (
                    <div key={star} className="flex items-center gap-2">
                      <div className="text-sm w-2">{star}</div>
                      <Progress value={count} className="h-2 flex-1" />
                      <div className="text-sm w-8">{count}%</div>
                    </div>
                  );
                })}
              </div>

              {/* <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm w-2">5</div>
                  <Progress value={66} className="h-2" />
                  <div className="text-sm w-8">
                    {overallRatingResponse?.fiveStar ?? 0}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm w-2">4</div>
                  <Progress value={33} className="h-2" />
                  <div className="text-sm w-8">
                    {overallRatingResponse?.fourStar ?? 0}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm w-2">3</div>
                  <Progress value={0} className="h-2" />
                  <div className="text-sm w-8">
                    {overallRatingResponse?.threeStar ?? 0}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm w-2">2</div>
                  <Progress value={0} className="h-2" />
                  <div className="text-sm w-8">
                    {overallRatingResponse?.twoStar ?? 0}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm w-2">1</div>
                  <Progress value={0} className="h-2" />
                  <div className="text-sm w-8">
                    {overallRatingResponse?.oneStar ?? 0}%
                  </div>
                </div>
              </div> */}

              {/* <Button className="w-full mt-6 bg-sky-600 hover:bg-sky-700">
                Viết đánh giá
              </Button> */}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
              <MessageCircleHeartIcon className="size-6" />
              Đánh giá từ khách hàng
            </h3>
            {safeFeedbackData.length > 0 ? (
              <div className="space-y-4">
                {safeFeedbackData.map((review, index) => (
                  <Card
                    key={index}
                    className="shadow-sm hover:shadow-md transition-shadow cardStyle"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage
                              src={review.user.avatar || placeholderImage}
                              alt={review.user.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
                              {review.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sky-500">
                                {review.user.name}
                              </span>
                              {/* {review.verified && ( */}
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                Đã mua hàng
                              </Badge>
                              {/* )} */}
                            </div>
                            <div className="flex flex-col gap-y-1">
                              <span className="text-base font-semibold text-slate-700">
                                {vietnameseDate(review.createdOnUtc, true)}
                              </span>
                              <span className="text-sm text-sky-500 font-semibold underline">
                                {formatRelativeTime(review.createdOnUtc)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => {
                            const rating = review.rating || 5;

                            return (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < rating
                                    ? "fill-amber-500"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      {/* <h4 className="font-medium mb-2">{review.title}</h4> */}
                      <p className="text-gray-700 mb-4">{review.content}</p>

                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="w-16 h-16 rounded-md overflow-hidden"
                            >
                              <ImagePreview
                                images={review.images}
                                initialIndex={index}
                                initialWidth={64}
                                initialHeight={64}
                                className="w-full h-full object-cover rounded-md cursor-pointer"
                                alt={`Review image ${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <NotData
                title="Chưa có đánh giá nào"
                description="Hãy là người đầu tiên đánh giá sản phẩm này!"
                className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl min-w-full h-full"
                icons={[
                  StarIcon,
                  MessageSquareHeartIcon,
                  MessageCircleQuestionIcon,
                ]}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

ReviewsTab.displayName = "ReviewsTab";

export default function ReviewSkeleton() {
  return (
    <div className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-lg shadow-sm cardStyle">
            <h3 className="text-lg font-semibold mb-4">Đánh giá tổng quan</h3>
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <div className="text-sm w-2">{star}</div>
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>

            <Skeleton className="h-10 w-full mt-6 rounded-md" />
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-1">
            <MessageCircleHeartIcon className="size-5" />
            Đánh giá từ khách hàng
          </h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="shadow-sm cardStyle">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-16 h-16 rounded-md overflow-hidden"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
