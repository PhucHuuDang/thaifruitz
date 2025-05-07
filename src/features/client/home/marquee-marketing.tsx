import { ThreeDMarquee } from "@/components/ui/3d-marque";

export const MarqueeMarketing = () => {
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

  return (
    <div className="container mx-auto my-10 max-w-11xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 ">
      <ThreeDMarquee images={images} />
    </div>
  );
};
