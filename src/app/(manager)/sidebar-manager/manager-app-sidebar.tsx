"use client";

import * as React from "react";
import {
  LayoutList,
  TableProperties,
  TicketPercent,
  GalleryHorizontal,
  BookOpen,
  BookOpenText,
  BookKey,
  UserRound,
  Settings,
  MessageSquareMore,
  NewspaperIcon,
  NotebookPen,
  Import,
  ShieldCheck,
  Fan,
  Gift,
  ChartPie,
  History
} from "lucide-react";

import { NavMain } from "@/components/_sidebar-configuration/nav-main";
import { NavProjects } from "@/components/_sidebar-configuration/nav-projects";
import { NavUser } from "@/components/_sidebar-configuration/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";

import { ApiResponse, Profile } from "@/types/types";
import { toast } from "sonner";
import { Logo } from "@/components/global-components/logo";

const data = {
  navMain: [
    {
      title: "Quản lý đơn hàng",
      url: "#",
      icon: LayoutList,
      items: [
        {
          title: "Các đơn hàng",
          url: "/manager/order-list",
        },
      ],
    },
    {
      title: "Quản lý sản phẩm",
      url: "/manager/product",
      icon: BookOpen,
      items: [
        {
          title: "Sản phẩm",
          url: "/manager/product",
          icon: BookOpen,
        },
        {
          title: "Sản phẩm trong kho",
          url: "/manager/inventory",
          icon: BookKey,
        },
        {
          title: "Lịch sử kho",
          url: "/manager/picking-item",
          icon: History,
        },
        // {
        //   title: "Tình trạng sản phẩm",
        //   url: "#",
        //   icon: BookOpenText,
        // },
        // {
        //   title: "Phương pháp sấy",
        //   url: "#",
        //   icon: BookOpenText,
        // },
      ],
    },
    // {
    //   title: "Cài đặt",
    //   url: "/admin/settings",
    //   icon: Settings,
    //   items: [
    //     {
    //       title: "Thanh trượt",
    //       url: "/admin/settings/sliders",
    //       icon: GalleryHorizontal,
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Báo cáo Doanh Thu",
      url: "/manager",
      icon: TableProperties,
    },
    {
      name: "Báo cáo người dùng",
      url: "/manager/users-report",
      icon: UserRound,
    },
    {
      name: "Bài viết",
      url: "/manager/blog",
      icon: NewspaperIcon,
    },
    // {
    //   name: "Quản Lý Sự Kiện",
    //   url: "/manager/event",
    //   icon: TicketPercent,
    // },
    {
      name: "Các phản hồi",
      url: "/manager/feedback",
      icon: MessageSquareMore,
    },
    {
      name: "Kế hoạch",
      url: "/manager/plan",
      icon: NotebookPen,
    },
    {
      name: "Nhập hàng",
      url: "/manager/product-batch",
      icon: Import,
    },
    // {
    //   name: "Chứng chỉ",
    //   url: "/manager/certification",
    //   icon: ShieldCheck,
    // },
    // {
    //   name: "Khuyến mãi",
    //   url: "/manager/promotion",
    //   icon: Fan,
    // },
    // {
    //   name: "Gói quà",
    //   url: "/manager/combo",
    //   icon: Gift,
    // },
    // {
    //   name: "Báo cáo biến thể",
    //   url: "/manager/dashboard",
    //   icon: ChartPie,
    // },
    // {
    //   name: "Loại sản phẩm",
    //   url: "/manager/category",
    //   icon: TableProperties,
    // },
    // {
    //   name: "Mã giảm giá",
    //   url: "/manager/voucher",
    //   icon: TicketPercent,
    // },
  ],
};

export function ManagerAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
    // classNameChildren="border-[2px] rounded-3xl border-gray-200 shadow-lg bg-zinc-50"
    >
      <SidebarHeader>
        <Logo height={100} width={100} isTextHidden={!sidebar.open} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
