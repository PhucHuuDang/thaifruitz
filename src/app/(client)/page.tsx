import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import VoucherSlide from "@/features/client/home/voucher-slide";
import Promotion from "@/features/client/home/promotion";
import CategorySlide from "@/features/client/home/category-slide";
import { MarqueeMarketing } from "@/features/client/home/marquee-marketing";
import dynamic from "next/dynamic";
import { AppleCardBlogsCarousel } from "@/features/client/home/apple-card-carousel-blogs";
import { AnimatedTestimonials } from "@/components/global-components/aceternity/animated-testimonial";
import { placeholderImage } from "@/utils/label";
import { API } from "../key/url";
// import { ProductFilterSidebarContainer } from "@/components/custom/filter-product-sidebar/product-filter-sidebar-container";

type Feedback = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  rating: number;
  createdAt: string;
};

const ProductFilterSidebarContainer = dynamic(() =>
  import(
    "@/components/custom/filter-product-sidebar/product-filter-sidebar-container"
  ).then((mod) => mod.ProductFilterSidebarContainer)
);

const ClientPage = async () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",
    "/marque/image-1.avif",
    "/marque/image-2.avif",
    "/marque/image-3.avif",
    "/marque/image-4.avif",
    "/marque/image-5.avif",
    "/marque/image-6.avif",
    "/marque/image-7.avif",
    "/marque/image-8.avif",
  ];

  const rawFeedbackData = await fetch(`${API}/Feedbacks/feedback-home`, {
    cache: "force-cache",
  }).then((res) => res.json());

  const feedbackData: Feedback[] =
    rawFeedbackData?.value?.map(
      (
        item: Omit<Feedback, "createdAt"> & { createdOnUtc: string },
        index: number
      ) => ({
        id: index,
        user: {
          name: item.user.name,
          avatar: item.user.avatar || placeholderImage,
        },
        content: item.content,
        rating: item.rating,
        createdAt: item.createdOnUtc,
      })
    ) ?? [];
  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <ImagesSlider images={images} className="h-[85vh]">
          <BannerText />
        </ImagesSlider>
        <VoucherSlide />
        <Promotion />

        <CategorySlide />

        {feedbackData.length > 0 && (
          <div className="container mx-auto mt-10 mb-10  gap-4 px-4 md:px-0">
            <h1 className="my-4 text-center text-4xl font-bold font-sans ">
              Phản hồi từ khách hàng
            </h1>
            <AnimatedTestimonials testimonials={feedbackData} autoplay />
          </div>
        )}

        <AppleCardBlogsCarousel />

        <MarqueeMarketing />

        {/* <BestSellter /> */}
      </div>
      {/* <ProductFilterSidebar /> */}

      <ProductFilterSidebarContainer />
    </>
  );
};

export default ClientPage;
