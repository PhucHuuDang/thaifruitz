"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, Clock, Search, Globe, MapPin } from "lucide-react";

export function DeliveryPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-x-1 cursor-pointer hover:scale-105 transition duration-300">
          <Truck className="size-5" />
          <span className="font-semibold text-moi_moc_green">
            Chính Sách Vận Chuyển
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chính sách vận chuyển
          </DialogTitle>
          <DialogDescription>
            Chi tiết về dịch vụ vận chuyển và giao hàng của ThaiFruiz
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span>Đơn vị vận chuyển và các tùy chọn giao hàng</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ThaiFruiz sử dụng dịch vụ chuyển phát nhanh của Viettel
                    Post, GNH cho các đơn hàng ngoại tỉnh (ngoài khu vực TP. Hồ
                    Chí Minh). Tốc độ giao hàng sẽ phụ thuộc vào tùy chọn của
                    khách hàng qua Viettel Post.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Đối với đơn hàng trong nội thành TP. Hồ Chí Minh, ThaiFruiz
                    đảm bảo sản phẩm đến tay khách hàng nhanh chóng và an toàn.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Vận chuyển miễn phí</span>
                    </h4>
                    <p className="text-sm">
                      ThaiFruiz áp dụng chính sách vận chuyển nhanh cho các đơn
                      hàng giao trong khu vực TP. Hồ Chí Minh, tạo điều kiện
                      thuận lợi nhất cho khách hàng nội thành.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Thời gian giao hàng dự kiến</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center
                        text-primary-foreground font-bold text-xl"
                    >
                      TP
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Nội thành TP. Hồ Chí Minh
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Dự kiến giao hàng trong vòng 2 ngày kể từ ngày đặt hàng.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                    <div
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center
                        text-secondary-foreground font-bold text-xl"
                    >
                      NT
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Ngoại tỉnh</h4>
                      <p className="text-sm text-muted-foreground">
                        Thời gian giao hàng sẽ do Viettel Post, GHN xử lý và phụ
                        thuộc vào lựa chọn vận chuyển của khách hàng.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Kiểm tra tình trạng đơn hàng</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Đơn hàng nội thành</h4>
                    <p className="text-sm text-muted-foreground">
                      Khách hàng có thể liên hệ trực tiếp với quản trị viên
                      fanpage ThaiFruiz để kiểm tra tình trạng đơn hàng.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Đơn hàng ngoại tỉnh</h4>
                    <p className="text-sm text-muted-foreground">
                      Khách hàng có thể theo dõi tình trạng đơn hàng qua ứng
                      dụng Viettel Post hoặc liên hệ với quản trị viên ThaiFruiz
                      để được hỗ trợ.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>Giao hàng quốc tế</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hiện tại, ThaiFruiz chưa hỗ trợ dịch vụ giao hàng quốc tế.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
