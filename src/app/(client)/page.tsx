import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import { placeholderImage } from "@/utils/label";
import { API } from "../key/url";
import { metaConfig } from "@/lib/config";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic imports for performance
const VoucherSlide = dynamic(
  () => import("@/features/client/home/voucher-slide"),
  {
    loading: () => (
      <div className="h-40 animate-pulse bg-slate-100 rounded-2xl" />
    ),
  },
);

const Promotion = dynamic(() => import("@/features/client/home/promotion"), {
  loading: () => (
    <div className="h-60 animate-pulse bg-slate-100 rounded-2xl" />
  ),
});

const CategorySlide = dynamic(
  () => import("@/features/client/home/category-slide"),
  {
    loading: () => (
      <div className="h-80 animate-pulse bg-slate-100 rounded-2xl" />
    ),
  },
);

const MarqueeMarketing = dynamic(
  () =>
    import("@/features/client/home/marquee-marketing").then(
      (mod) => mod.MarqueeMarketing,
    ),
  {
    ssr: true,
  },
);

const AnimatedTestimonials = dynamic(
  () =>
    import("@/components/global-components/aceternity/animated-testimonial").then(
      (mod) => ({ default: mod.AnimatedTestimonials }),
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-slate-100 rounded-2xl" />
    ),
  },
);

const AppleCardBlogsCarousel = dynamic(
  () =>
    import("@/features/client/home/apple-card-carousel-blogs").then(
      (mod) => mod.AppleCardBlogsCarousel,
    ),
  {
    loading: () => (
      <div className="h-96 animate-pulse bg-slate-100 rounded-2xl" />
    ),
  },
);

const ProductFilterSidebarContainer = dynamic(
  () =>
    import("@/components/custom/filter-product-sidebar/product-filter-sidebar-container").then(
      (mod) => mod.ProductFilterSidebarContainer,
    ),
  {
    loading: () => (
      <div className="h-screen animate-pulse bg-slate-100 rounded-2xl" />
    ),
  },
);

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
    next: { revalidate: 3600 }, // Revalidate every hour
  }).then((res) => res.json());

  const feedbackData: Feedback[] =
    rawFeedbackData?.value?.map(
      (
        item: Omit<Feedback, "createdAt"> & { createdOnUtc: string },
        index: number,
      ) => ({
        id: index,
        user: {
          name: item.user.name,
          avatar: item.user.avatar || placeholderImage,
        },
        content: item.content,
        rating: item.rating,
        createdAt: item.createdOnUtc,
      }),
    ) ?? [];

  // Structured Data - WebSite Schema
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ThaiFruitz",
    url: metaConfig.baseUrl,
    description: metaConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${metaConfig.baseUrl}/find?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Structured Data - Organization Schema
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ThaiFruitz",
    url: metaConfig.baseUrl,
    logo: `${metaConfig.baseUrl}/logo.png`,
    description: metaConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "VN",
      availableLanguage: ["vi", "en"],
    },
  };

  // Structured Data - BreadcrumbList Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: metaConfig.baseUrl,
      },
    ],
  };

  return (
    <>
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Hero Section - Optimized height */}
        <ImagesSlider images={images} className="h-[60vh] lg:h-[70vh]">
          <BannerText />
        </ImagesSlider>

        {/* Trust Signals - Moved up for credibility */}
        <Suspense
          fallback={<div className="h-20 animate-pulse bg-slate-100" />}
        >
          <MarqueeMarketing />
        </Suspense>

        {/* Value Propositions Section - NEW */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-orange-50/40 via-amber-50/30 to-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-8 md:mb-12">
              Tại sao chọn ThaiFruitz?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Value Prop 1 */}
              <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  100% Organic
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sản phẩm từ nông dân địa phương, không chất bảo quản, không
                  đường thêm
                </p>
              </div>

              {/* Value Prop 2 */}
              <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  Giao hàng nhanh
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Giao hàng toàn quốc trong 24-48 giờ, đảm bảo độ tươi ngon
                </p>
              </div>

              {/* Value Prop 3 */}
              <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-sky-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">
                  Giá tốt nhất
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Cam kết giá tốt nhất thị trường với nhiều ưu đãi hấp dẫn
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vouchers */}
        <Suspense
          fallback={
            <div className="h-40 animate-pulse bg-slate-100 rounded-2xl mx-4" />
          }
        >
          <VoucherSlide />
        </Suspense>

        {/* Promotions */}
        <Suspense
          fallback={
            <div className="h-60 animate-pulse bg-slate-100 rounded-2xl mx-4" />
          }
        >
          <Promotion />
        </Suspense>

        {/* Categories */}
        {/* <Suspense
          fallback={
            <div className="h-80 animate-pulse bg-slate-100 rounded-2xl mx-4" />
          }
        >
          <CategorySlide />
        </Suspense> */}

        {/* Testimonials */}
        {/* {feedbackData.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-8 md:mb-12">
                Phản hồi từ khách hàng
              </h2>
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse bg-slate-100 rounded-2xl" />
                }
              >
                <AnimatedTestimonials testimonials={feedbackData} autoplay />
              </Suspense>
            </div>
          </section>
        )} */}

        {/* Blog Content */}
        <Suspense
          fallback={
            <div className="h-96 animate-pulse bg-slate-100 rounded-2xl mx-4" />
          }
        >
          <AppleCardBlogsCarousel />
        </Suspense>

        {/* Section Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />
      </div>

      {/* Product Catalog */}
      <div id="san-pham" aria-labelledby="product-section-heading">
        <h2 id="product-section-heading" className="sr-only">
          Sản phẩm trái cây sấy Thai Fruitz
        </h2>
        <Suspense
          fallback={
            <div className="h-screen animate-pulse bg-slate-100 rounded-2xl mx-4" />
          }
        >
          <ProductFilterSidebarContainer />
        </Suspense>
      </div>
    </>
  );
};

export default ClientPage;
