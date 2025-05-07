"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "./logo";
import { LoginDialog } from "../custom/_custom-dialog/login-dialog";
import { RegisterDialog } from "../custom/_custom-dialog/register-dialog";
import { ShoppingBagSheet } from "../custom/_custom-sheet/shopping-bag-sheet";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { BlogCategory } from "@/app/(admin)/admin/blog/category/page";

import { ApiResponse, Profile } from "@/types/types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bell,
  Boxes,
  Heart,
  LogOut,
  MapPinHouse,
  Menu as MenuIcon,
  UserRoundPen,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VerifyDialog } from "../custom/_custom-dialog/verify-account-dialog";
import { useRouter } from "next/navigation";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { logOut } from "@/actions/auth";

import Notification from "@/features/notification/notification";
import { Skeleton } from "../ui/skeleton";
import { USER_KEY } from "@/app/key/user-key";

import { toast } from "sonner";
import { UserMenu } from "./user-menu";
import { DeliveryPolicy } from "./footer/policy/delivery-policy";
import { PaymentPolicy } from "./footer/policy/payment-policy";
import { PrivacyPolicy } from "./footer/policy/privacy-policy";
import { ReturnPolicy } from "./footer/policy/return-policy";
import { ServicePolicy } from "./footer/policy/service-policy";
import { Event } from "@/features/event/list-event";

export const Navigate = () => {
  const { data: blogCategories } = useFetch<ApiResponse<BlogCategory[]>>(
    "/BlogCategories",
    ["BlogCategories", "Guest"]
  );
  const { data: events } = useFetch<ApiResponse<Event[]>>("/Events", [
    "events",
  ]);

  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginDialog = useLoginDialog();

  // const { data: user, isLoading: isUserLoading } = useQuery<Profile>({
  //   queryKey: ["authUser"],
  //   queryFn: async () => {
  //     const response = await getProfile();
  //     if (!response || !response.isSuccess || !response.data) {
  //       toast.error("Lỗi hệ thống");
  //       return undefined; // Handle error case
  //     }
  //     return response.data; // Ensure this matches `Profile`
  //   },
  // });

  // console.log(user);
  // console.log({ isUserLoading });

  const navItemClassName =
    "relative inline-flex text-sm h-11 w-full md:w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0 before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer font-semibold";

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16 w-full shadow-lg backdrop-blur-md bg-neutral-100/50 dark:bg-neutral-800/50 rounded-b-2xl",
        "w-full rounded-none list-none shadow-sm"
      )}
    >
      <Menu
        setActive={setActive}
        className="h-full flex items-center justify-between w-full rounded-none md:px-4"
      >
        <div className="hidden md:flex items-center">
          <Logo height={60} width={60} />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className={navItemClassName}>
            Trang chủ
          </Link>
          {/* <Link href="/find" className={navItemClassName}>
            Sản phẩm
          </Link> */}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Quà tặng"
            className={navItemClassName}
          >
            <div className="  text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Tất cả"
                href="/"
                src="/images/combo.jpg"
                description=""
              />
              {events?.value?.map((event: Event) => (
                <ProductItem
                  key={event.id}
                  title={event.name}
                  src={event.image}
                  href={`/`}
                  description={event.description}
                />
              ))}
            </div>
          </MenuItem>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Chính sách"
            className={navItemClassName}
          >
            <div className="flex flex-col space-y-4 text-sm pl-4">
              <DeliveryPolicy />
              <PaymentPolicy />
              <PrivacyPolicy />
              <ReturnPolicy />
              <ServicePolicy />
            </div>
          </MenuItem>
          {/* <Link href="/blogs">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Bài viết"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm">
                {blogCategories?.value?.map((item: BlogCategory, index) => (
                  <HoveredLink
                    key={index + 1}
                    href={`/blogs?category=${item.name}`}
                  >
                    {item.name}
                  </HoveredLink>
                ))}
              </div>
            </MenuItem>
          </Link> */}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <ShoppingBagSheet />

          <UserMenu />
        </div>
      </Menu>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-neutral-100/95 dark:bg-neutral-800/95 border-t shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              className={navItemClassName}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/find"
              className={navItemClassName}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Quà tặng"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm pl-4">
                <HoveredLink href="/hobby">Hobby</HoveredLink>
                <HoveredLink href="/individual">Individual</HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <HoveredLink href="/enterprise">Enterprise</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem
              setActive={setActive}
              active={active}
              item="Chính sách"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm pl-4">
                <DeliveryPolicy />
                <PaymentPolicy />
                <PrivacyPolicy />
                <ReturnPolicy />
                <ServicePolicy />
              </div>
            </MenuItem>
            {/* <MenuItem
              setActive={setActive}
              active={active}
              item="Bài viết"
              className={navItemClassName}
            >
              <div className="flex flex-col space-y-4 text-sm pl-4">
                {blogCategories?.value?.map((item: BlogCategory, index) => (
                  <HoveredLink
                    key={index + 1}
                    href={`/blogs?category=${item.name}`}
                  >
                    {item.name}
                  </HoveredLink>
                ))}
              </div>
            </MenuItem> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigate;

//yru84817@jioso.com
