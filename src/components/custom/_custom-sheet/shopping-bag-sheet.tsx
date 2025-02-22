import { EmptyState } from "@/components/global-components/empty-state";
import { Logo } from "@/components/global-components/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBagIcon, ShoppingBasket, ShoppingCart } from "lucide-react";
import React from "react";

export const ShoppingBagSheet = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer">
          <div className="relative">
            <ShoppingBagIcon className="size-4 mr-1 relative" />
            <span
              className="
            absolute
            -top-1
            -right-2
            w-4
            h-4
            bg-primary-500
            text-slate-900
            rounded-full
            flex items-center justify-center
            "
            >
              0
            </span>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="min-w-full md:min-w-[600px] lg:min-w-[50%] rounded-2xl">
        <SheetHeader>
          <SheetTitle>
            <div className="text-center">
              <Logo />
            </div>
          </SheetTitle>
          <SheetDescription>
            <div className="w-full">
              <div className="flex items-center justify-center h-full pt-10">
                <EmptyState
                  icons={[ShoppingCart, ShoppingBagIcon, ShoppingBasket]}
                  title="Giỏ hàng của bạn"
                  description="Có vẻ như giỏ hàng của bạn đang trống"
                  action={{
                    label: "Mua ngay nào",
                    onClick: () => setIsOpen(false),
                  }}
                />
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>

        {/* <div className="flex items-center justify-center">
          <div className="flex justify-center">
            <div>Add some items</div>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
};
