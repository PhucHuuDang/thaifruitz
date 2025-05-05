"use client";

import { DataTable } from "@/components/global-components/data-table/data-table";
import { orderListColumns } from "./order-list-column";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { ApiResponse, PageResult } from "@/types/types";
import { OrderData } from "@/types/report-orders.types";
import {
  EnhanceDataTable,
  EnhanceDataTableWithAllFeatures,
} from "@/components/global-components/data-table/enhance-data-table";
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { TotalCard } from "@/app/(manager)/manager/components/total-card";
import {
  BadgeCheckIcon,
  Banknote,
  CheckCircle2,
  Clock,
  ListCheckIcon,
  ListOrderedIcon,
  PackageIcon,
  PackageOpen,
  SendToBackIcon,
  Truck,
  Undo2,
  XCircle,
} from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import { OrderAreaChart } from "./order-area-chart";
import { useMemo, useState } from "react";
import { VercelTab } from "@/components/custom/_custom_tabs/vercel-tabs";
import {
  returnExchangeColumns,
  ReturnExchangeOrders,
} from "./return-exchange/return-exchange-columns";
import { calculateGrowthRate } from "@/lib/calculate";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ORDER_STATUS_TAB = [
  { id: "all", label: "Tất cả", icon: ListOrderedIcon },
  { id: "pending", label: "Chờ xác nhận", icon: Clock },
  { id: "packaging", label: "Đang đóng gói", icon: PackageIcon },
  { id: "shipping", label: "Đang giao", icon: Truck },
  { id: "delivering", label: "Đang giao tới", icon: CheckCircle2 },
  { id: "delivered", label: "Đã giao", icon: PackageOpen },
  { id: "received", label: "Đã nhận", icon: PackageOpen },
  { id: "completed", label: "Hoàn thành", icon: BadgeCheckIcon },
  { id: "cancelled", label: "Đã hủy", icon: XCircle },
  { id: "returned", label: "Đã trả hàng", icon: Undo2 },
  { id: "exchanged", label: "Đổi hàng", icon: SendToBackIcon },
  { id: "return-exchange", label: "Yêu cầu đổi/trả", icon: ListOrderedIcon },
];

interface ReportOrdersListClientProps {
  dateRange: {
    from: Date | undefined;
    to?: Date | undefined;
  };
}

export const ReportOrdersListClient = ({
  dateRange,
}: ReportOrdersListClientProps) => {
  const [tab, setTab] = useState("all");

  const orderList = useFetch<ApiResponse<PageResult<OrderData>>>("/Orders", [
    // ORDERS_KEY.ORDERS_LIST,
    "order_list",
  ]);

  const returnExchange = useFetch<ApiResponse<ReturnExchangeOrders[]>>(
    "/Orders/return-exchange",
    [ORDERS_KEY.RETURN_EXCHANGE]
  );

  const data = orderList.data?.value;

  const returnExchangeData = returnExchange.data?.value;

  // const chartData = data?.items.map((order) => {
  //   return {
  //     userName: `${order.user.name}`,
  //     totalPrice: formatVND(order.totalPrice || 0),
  //     shipFee: formatVND(order.shipFee || 0),
  //     priceAfterShip: formatVND(order.totalPrice - order.shipFee || 0),
  //   };
  // });

  // growth calculate

  if (orderList.isLoading && returnExchange.isLoading) {
    return <DataTableSkeleton />;
  }

  const filterOrdersByDateRange = (
    orders: OrderData[],
    startDate: Date,
    endDate: Date
  ) => {
    return orders?.filter((order) => {
      const orderDate = new Date(order.createdOnUtc);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  // Extract the selected date range
  const { from: currentFrom, to: currentTo } = dateRange as {
    from: Date;
    to: Date;
  };

  // Define the previous period date range
  const previousFrom = new Date(currentFrom as Date);
  previousFrom.setDate(
    previousFrom.getDate() - (currentTo?.getDate() - currentFrom.getDate() + 1)
  );

  const previousTo = new Date(currentFrom as Date);
  previousTo.setDate(previousTo.getDate() - 1);

  // Filter orders for current and previous periods
  const currentPeriodOrders = filterOrdersByDateRange(
    data?.items as OrderData[],
    currentFrom as Date,
    currentTo as Date
  );
  const previousPeriodOrders = filterOrdersByDateRange(
    data?.items as OrderData[],
    previousFrom,
    previousTo
  );

  // Calculate metrics for current and previous periods
  const calculateMetrics = (orders: OrderData[]) => {
    const totalOrders = orders?.length;
    const totalSales = orders?.reduce(
      (sum, order) => sum + order?.totalPrice,
      0
    );
    const totalShipFee = orders?.reduce(
      (sum, order) => sum + order?.shipFee,
      0
    );
    const confirmedOrders = orders?.filter(
      (order) =>
        order?.status?.toLowerCase() !== "pending" &&
        order?.status?.toLowerCase() !== "packaging"
    ).length;
    // const confirmedOrders = data?.items.filter(
    //   (order) => order?.status?.toLowerCase() === "received"
    // ).length;

    return { totalOrders, totalSales, totalShipFee, confirmedOrders };
  };

  const currentMetrics = calculateMetrics(currentPeriodOrders);
  const previousMetrics = calculateMetrics(previousPeriodOrders);

  // Calculate growth rates
  // const calculateGrowthRate = (current: number, previous: number) => {
  //   if (previous === 0) return 0; // Avoid division by zero
  //   return ((current - previous) / previous) * 100;
  // };

  const orderGrowthRate = calculateGrowthRate(
    currentMetrics.totalOrders,
    previousMetrics.totalOrders
  );

  const salesGrowthRate = calculateGrowthRate(
    currentMetrics.totalSales,
    previousMetrics.totalSales
  );

  const shipFeeGrowthRate = calculateGrowthRate(
    currentMetrics.totalShipFee,
    previousMetrics.totalShipFee
  );

  const confirmedOrdersGrowthRate = calculateGrowthRate(
    currentMetrics.confirmedOrders ?? 0,
    previousMetrics.confirmedOrders ?? 0
  );

  // Hàm lọc dữ liệu biểu đồ theo ngày
  const filterChartDataByDateRange = (
    items: OrderData[],
    startDate: Date,
    endDate: Date
  ) => {
    return items
      ?.filter((order) => {
        const orderDate = new Date(order.createdOnUtc);
        return orderDate >= startDate && orderDate <= endDate;
      })
      .map((order) => {
        return {
          userName: `${order.user.name}`,
          totalPrice: order.totalPrice || 0,
          shipFee: order.shipFee || 0,
          priceAfterShip: order.totalPrice - order.shipFee || 0,
        };
      });
  };

  // Hàm tính tổng các giá trị
  const calculateTotal = (data: any[]) => {
    return data?.reduce((acc, item) => {
      const totalPrice = parseFloat(item.totalPrice) || 0;
      const shipFee = parseFloat(item.shipFee) || 0;
      const priceAfterShip = parseFloat(item.priceAfterShip) || 0;

      return acc + totalPrice + shipFee + priceAfterShip;
    }, 0);
  };

  // Lọc dữ liệu biểu đồ cho khoảng thời gian hiện tại
  const chartDataFiltered = filterChartDataByDateRange(
    data?.items as OrderData[],
    currentFrom as Date,
    currentTo as Date
  );

  const historyChartDataFiltered = filterChartDataByDateRange(
    data?.items as OrderData[],
    previousFrom as Date,
    previousTo as Date
  );

  const currentSumAll = calculateTotal(chartDataFiltered || []);
  const historySumAll = calculateTotal(historyChartDataFiltered || []);

  const growthChartData = calculateGrowthRate(
    currentSumAll as number,
    historySumAll as number
  );

  const enrichChartData = chartDataFiltered?.map((value) => {
    return {
      ...value,

      totalPrice: formatVND(value.totalPrice),
      shipFee: formatVND(value.shipFee),
      priceAfterShip: formatVND(value.priceAfterShip),
    };
  });

  const filterOrdersByStatus = (orders: OrderData[], status: string) => {
    if (status === "all") return orders;
    return orders?.filter((order) => order.status?.toLowerCase() === status);
  };

  const filterReturnExchangeOrdersByStatus = (
    orders: ReturnExchangeOrders[],
    status: string
  ) => {
    if (status === "all") return orders;
    return orders?.filter(
      (order) => order.requestStatus?.toLowerCase() === status
    );
  };

  const filteredOrders = filterOrdersByStatus(data?.items || [], tab);
  const filteredReturnExchangeOrders = filterReturnExchangeOrdersByStatus(
    returnExchangeData || [],
    tab
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <TotalCard
          icon={ListOrderedIcon}
          title="Tổng số đơn hàng"
          // value={totalOrders}
          value={currentMetrics?.totalOrders ?? 0}
          // subtitle="--Đơn hàng"
          subtitle={orderGrowthRate}
        />
        <TotalCard
          icon={Banknote}
          title="Tổng doanh thu"
          // value={formatVND(totalSales ?? 0)}
          value={formatVND(currentMetrics?.totalSales ?? 0)}
          // subtitle="--VND"
          subtitle={salesGrowthRate}
        />
        <TotalCard
          icon={Banknote}
          title="Tổng phí ship"
          // value={formatVND(totalShipFee ?? 0)}
          value={formatVND(currentMetrics?.totalShipFee ?? 0)}
          // subtitle="--VND"
          subtitle={shipFeeGrowthRate}
        />
        <TotalCard
          icon={ListCheckIcon}
          title="Đơn hàng xác nhận"
          // value={confirmedOrders ?? 0}
          value={currentMetrics?.confirmedOrders ?? 0}
          // subtitle="--Đơn hàng"
          subtitle={confirmedOrdersGrowthRate}
        />
      </div>

      <div>
        <OrderAreaChart
          chartData={enrichChartData || []}
          growthChartData={growthChartData}
        />
      </div>

      <ScrollArea className="w-full h-[60px] whitespace-nowrap">
        <VercelTab
          tabs={ORDER_STATUS_TAB}
          activeTab={tab}
          onTabChange={setTab}
          // classNameContainer="overflow-x-auto whitespace-nowrap"
        />

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {tab === "return-exchange" ? (
        <EnhanceDataTableWithAllFeatures
          columns={returnExchangeColumns}
          initialData={returnExchangeData || []}
          queryKey={[ORDERS_KEY.RETURN_EXCHANGE]}
          queryClient={{
            refetch: returnExchange.refetch,
            isFetching: returnExchange.isFetching,
            isLoading: returnExchange.isLoading,
          }}
          title="Danh sách đơn hàng yêu cầu đổi trả"
          description="Danh sách đơn hàng yêu cầu đổi trả của khách hàng"
          enableSelection={false}
          enableExpansion={false}
        />
      ) : (
        <EnhanceDataTableWithAllFeatures
          columns={orderListColumns}
          initialData={filteredOrders}
          queryKey={[ORDERS_KEY.ORDERS_LIST]}
          title="Danh sách đơn hàng đã đặt"
          description="Danh sách đơn hàng đã đặt của khách hàng"
          queryClient={{
            refetch: orderList.refetch,
            isFetching: orderList.isFetching,
            isLoading: orderList.isLoading,
          }}
          enableSelection={false}
          enableExpansion={false}
        />
      )}

      {/* {tab === "all" ? (
        <EnhanceDataTableWithAllFeatures
          columns={orderListColumns}
          initialData={data?.items || []}
          queryKey={[ORDERS_KEY.ORDERS_LIST]}
          title="Danh sách đơn hàng đã đặt"
          description="Danh sách đơn hàng đã đặt của khách hàng"
          queryClient={{
            refetch: orderList.refetch,
            isFetching: orderList.isFetching,
            isLoading: orderList.isLoading,
          }}
        />
      ) :  (
        <EnhanceDataTableWithAllFeatures
          columns={returnExchangeColumns}
          initialData={returnExchangeData || []}
          queryKey={[ORDERS_KEY.RETURN_EXCHANGE]}
          queryClient={{
            refetch: returnExchange.refetch,
            isFetching: returnExchange.isFetching,
            isLoading: returnExchange.isLoading,
          }}
          title="Danh sách đơn hàng yêu cầu đổi trả"
          description="Danh sách đơn hàng yêu cầu đổi trả của khách hàng"
        />
      )} */}
    </div>
  );
};
