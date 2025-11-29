import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { vietnameseDate } from "@/utils/date";
import {
  Calendar,
  Download,
  DownloadIcon,
  ExternalLink,
  ExternalLinkIcon,
  FileText,
  FileTextIcon,
  Info,
  Minus,
  PlusIcon,
  Printer,
  QrCodeIcon,
  RotateCwIcon,
  ShieldCheck,
  Stamp,
  ZoomInIcon,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Certificate, ProductDetailTypes } from "../product-detail.types";
import { isAfter, isBefore, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkPreview } from "@/components/global-components/link-preview";

interface ProductCertificationProps {
  certificates: Pick<ProductDetailTypes, "productCertification">;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stopColor="#f6f7f8" offset="20%" />
      <stop stopColor="#edeef1" offset="50%" />
      <stop stopColor="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlinkHref="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

// this will be used in the blurDataURL prop of the Image component
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const CertificateTab = memo(
  ({ ...certificates }: ProductCertificationProps) => {
    const [selectedCert, setSelectedCert] = useState<
      (typeof productCertification)[0] | null
    >(null);
    const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
    const [zoomLevel, setZoomLevel] = useState(1);
    const [imageRotation, setImageRotation] = useState(0);

    const handleImageLoad = useCallback((id: string) => {
      setImageLoaded((prev) => ({ ...prev, [id]: true }));
    }, []);

    const resetImageControls = useCallback(() => {
      setZoomLevel(1);
      setImageRotation(0);
    }, []);

    const { productCertification } = certificates.certificates;

    const getCertificateStatus = (expiryDate: string) => {
      const now = new Date();
      const expiry = parseISO(expiryDate);

      if (isAfter(now, expiry)) {
        return {
          label: "Hết hạn",
          variant: "destructive" as const,
          description: "Chứng nhận này đã hết hiệu lực",
        };
      }

      // Nếu sắp hết hạn trong vòng 3 tháng
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(now.getMonth() + 3);

      if (isBefore(expiry, threeMonthsFromNow)) {
        return {
          label: "Sắp hết hạn",
          variant: "secondary" as const,
          description: "Chứng nhận sẽ hết hạn trong vòng 3 tháng tới",
        };
      }

      return {
        label: "Còn hiệu lực",
        variant: "success" as const,
        description: "Chứng nhận đang có hiệu lực",
      };
    };

    const getRemainingDays = (expiryDate: string) => {
      const now = new Date();
      const expiry = parseISO(expiryDate);
      const diffTime = Math.abs(expiry.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (isAfter(now, expiry)) {
        return `Đã hết hạn ${diffDays} ngày trước`;
      }

      return `Còn ${diffDays} ngày hiệu lực`;
    };

    return (
      <div className="p-6 lg:p-8 motion-opacity-in-0 motion-preset-slide-right motion-blur-in-md rounded-b-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCertification.map((cert: Certificate) => {
            const status = getCertificateStatus(cert.expiryDate);
            const remainingDays = getRemainingDays(cert.expiryDate);

            return (
              <Card
                key={cert.id}
                className="overflow-hidden border-2 border-muted hover:border-emerald-200 transition-all duration-300 group"
              >
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 space-y-0 relative">
                  <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
                    <Stamp className="h-32 w-32 text-emerald-900 rotate-12" />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.agency}
                      </p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={
                              status.variant === "success"
                                ? "default"
                                : status.variant
                            }
                            className={
                              status.variant === "success"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : ""
                            }
                          >
                            {status.label}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{status.description}</p>
                          <p className="text-xs mt-1">{remainingDays}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Mã số: {cert.id}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-5 relative">
                  <Dialog
                    onOpenChange={(open) => {
                      if (open) {
                        setSelectedCert(cert);
                      } else {
                        resetImageControls();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <div className="relative h-52 w-full overflow-hidden rounded-md cursor-pointer border group-hover:border-emerald-200 transition-all duration-300">
                        {!imageLoaded[cert.id] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                            <Skeleton className="h-full w-full" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/20 to-transparent z-10 pointer-events-none" />
                        <Image
                          src={cert.image || "/placeholder.svg"}
                          alt={`Chứng nhận ${cert.name}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={`object-contain transition-transform duration-500 group-hover:scale-105 ${
                            !imageLoaded[cert.id] ? "opacity-0" : "opacity-100"
                          }`}
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475)
                          )}`}
                          onLoad={() => handleImageLoad(cert.id)}
                          priority={true}
                        />
                        <div className="absolute bottom-2 right-2 bg-background/90 p-1.5 rounded-md shadow-sm">
                          <ZoomInIcon className="h-4 w-4" />
                        </div>
                        <div className="absolute top-2 left-2 bg-emerald-500/90 text-white p-1 px-2 rounded text-xs font-medium">
                          Xem chi tiết
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-600" />
                          {selectedCert?.name} - {selectedCert?.agency}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="relative h-[70vh] w-full bg-muted/30 rounded-lg overflow-hidden">
                        <div className="absolute top-2 right-2 z-20 flex gap-1 bg-background/80 p-1 rounded-md shadow-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
                            }
                            disabled={zoomLevel <= 0.5}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setZoomLevel((prev) => Math.min(prev + 0.1, 3))
                            }
                            disabled={zoomLevel >= 3}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              setImageRotation((prev) => (prev + 90) % 360)
                            }
                          >
                            <RotateCwIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={resetImageControls}
                          >
                            <ZoomInIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        <div
                          className="absolute inset-0 flex items-center justify-center overflow-auto"
                          style={{
                            cursor: zoomLevel > 1 ? "move" : "default",
                          }}
                        >
                          {selectedCert && (
                            <>
                              {!imageLoaded[`dialog-${selectedCert.id}`] && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="relative w-32 h-32">
                                    <Skeleton className="absolute inset-0" />
                                  </div>
                                </div>
                              )}
                              <div
                                className="relative transition-transform duration-200 ease-out"
                                style={{
                                  transform: `scale(${zoomLevel}) rotate(${imageRotation}deg)`,
                                  transformOrigin: "center center",
                                }}
                              >
                                <Image
                                  src={selectedCert.image || "/placeholder.svg"}
                                  alt={`Chứng nhận ${selectedCert.name}`}
                                  width={800}
                                  height={600}
                                  className={`object-contain max-h-[65vh] transition-opacity duration-300 ${
                                    !imageLoaded[`dialog-${selectedCert.id}`]
                                      ? "opacity-0"
                                      : "opacity-100"
                                  }`}
                                  onLoad={() =>
                                    handleImageLoad(`dialog-${selectedCert.id}`)
                                  }
                                  quality={100}
                                />
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-transparent opacity-10">
                                  <div className="absolute bottom-4 right-4 text-muted-foreground/30 text-xs font-semibold rotate-45 transform scale-150">
                                    {selectedCert.agency}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {selectedCert &&
                              vietnameseDate(selectedCert.issueDate, true)}{" "}
                            -{" "}
                            {selectedCert &&
                              vietnameseDate(selectedCert.expiryDate, true)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" />
                            In
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              window.open(
                                selectedCert?.image || "/placeholder.jpg",
                                "_blank"
                              );
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-md">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <div>
                        <span className="text-sm font-medium">
                          Thời hạn hiệu lực:
                        </span>
                        <p className="text-sm">
                          {vietnameseDate(cert.issueDate, true)} -{" "}
                          {vietnameseDate(cert.expiryDate, true)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {remainingDays}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-1" />

                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Chi tiết:</span>
                        <p className="text-sm mt-1">{cert.details}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/20 p-4 flex justify-between gap-2">
                  {/* <Button variant="outline" size="sm" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Quét mã QR
                </Button> */}
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <LinkPreview
                      url="https://dichvucong.gov.vn/p/home/dvc-chi-tiet-cau-hoi.html?id=15755&row_limit=1"
                      target="_blank"
                      height={250}
                      width={200}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Tra cứu chứng nhận
                    </LinkPreview>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-10  p-6 rounded-lg shadow-sm cardStyle">
          <h3 className="text-lg font-semibold mb-4">
            Tại sao chứng nhận quan trọng?
          </h3>
          <span className="text-sm text-slate-700 mb-6">
            Các chứng nhận đảm bảo rằng sản phẩm của chúng tôi đáp ứng các tiêu
            chuẩn nghiêm ngặt về chất lượng, an toàn thực phẩm và tính bền vững.
            Chúng tôi cam kết mang đến cho khách hàng những sản phẩm tốt nhất
            với sự minh bạch hoàn toàn về nguồn gốc và quy trình sản xuất.
          </span>
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-lg shadow-sm"
            defaultValue="organic"
          >
            <AccordionItem value="organic" className="border-b">
              <AccordionTrigger className="px-4 py-3 font-medium hover:bg-slate-50  rounded-t-lg">
                Chứng nhận hữu cơ là gì?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                Chứng nhận hữu cơ xác nhận rằng sản phẩm được trồng và chế biến
                mà không sử dụng phân bón tổng hợp, thuốc trừ sâu, kỹ thuật biến
                đổi gen, hoặc bức xạ ion hóa. Các sản phẩm hữu cơ được sản xuất
                với mục tiêu thúc đẩy sự cân bằng sinh thái và bảo tồn đa dạng
                sinh học.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="haccp" className="border-b">
              <AccordionTrigger className="px-4 py-3 font-medium hover:bg-slate-50">
                HACCP là gì?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                HACCP (Hệ thống Phân tích mối nguy và Điểm kiểm soát tới hạn) là
                một hệ thống quản lý an toàn thực phẩm nhằm xác định và kiểm
                soát các mối nguy có thể xảy ra trong quá trình sản xuất thực
                phẩm. Chứng nhận này đảm bảo rằng các biện pháp phòng ngừa đã
                được thực hiện để giảm thiểu rủi ro về an toàn thực phẩm.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="iso" className="border-0">
              <AccordionTrigger className="px-4 py-3 font-medium hover:bg-slate-50 rounded-b-lg">
                ISO 22000 là gì?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                ISO 22000 là tiêu chuẩn quốc tế về hệ thống quản lý an toàn thực
                phẩm. Nó kết hợp các nguyên tắc HACCP với các chương trình tiên
                quyết và các yếu tố khác của hệ thống quản lý để đảm bảo an toàn
                thực phẩm trong toàn bộ chuỗi cung ứng thực phẩm.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }
);

CertificateTab.displayName = "CertificateTab";
