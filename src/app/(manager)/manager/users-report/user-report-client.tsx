"use client";

import { Button } from "@/components/ui/button";
import { TotalCard } from "../components/total-card";
import {
  CalendarIcon,
  LucideIcon,
  MapPinIcon,
  User,
  UserCheckIcon,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UserStatisticChart } from "../components/user-statistic-chart";
import { UsersOrdersTotalChart } from "../components/users-orders-total-chart";
import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/global-components/data-table/data-table";
import Image from "next/image";
import { memo, useState } from "react";
import { ReportUserValue } from "./page";
import { CustomerType, userReportColumns } from "./user -report-column";
import { EnhanceDataTableWithAllFeatures } from "@/components/global-components/data-table/enhance-data-table";
import { formatVND } from "@/lib/format-currency";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { REPORT_KEY } from "@/app/key/manager-key";
import { formatDateString, getPreviousDate } from "@/utils/date";
import { NotData } from "@/components/global-components/no-data";
import AnimatedLoadingSkeleton from "@/components/global-components/custom-skeleton/animated-loading-skeleton";
import { calculateGrowthRate } from "@/lib/calculate";
import { format } from "date-fns";
import { toast } from "sonner";

const UserReportClient = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: new Date("2025-01-01"),
    to: new Date(formatDateString(new Date())),
  });

  const { previousFrom, previousTo } = getPreviousDate(dateRange);

  const userReportData = useFetch<ApiResponse<CustomerType[]>>(
    `/Statistics/report/customers`,
    [REPORT_KEY.REPORT_CUSTOMER],
    {
      fromDate: formatDateString(dateRange.from as Date),
      toDate: formatDateString(dateRange.to as Date),
    }
  );

  const historyUserReportData = useFetch<ApiResponse<CustomerType[]>>(
    `/Statistics/report/customers`,
    [REPORT_KEY.REPORT_CUSTOMER],
    {
      fromDate: formatDateString(previousFrom as Date),
      toDate: formatDateString(previousTo as Date),
    }
  );

  const handleDateRangeChange = (values: { range: DateRange }) => {
    if (!values.range.from || !values.range.to) {
      toast.warning("Vui lòng chọn khoảng thời gian hợp lệ");
      return;
    }
    setDateRange(values.range);
  };

  if (userReportData.isLoading) {
    return <AnimatedLoadingSkeleton className="w-full h-full" />;
  }

  if (userReportData.isError) {
    return <NotData className="w-full h-full" />;
  }

  const safeUserReportData = userReportData.data?.value || [];

  const historySafeUserReportData = historyUserReportData.data?.value || [];

  // current data
  const totalCustomers = safeUserReportData?.length;
  const activeCustomers = safeUserReportData?.filter((c) => c.status).length;
  const totalSpend = safeUserReportData?.reduce(
    (sum, customer) => sum + customer.totalSpend,
    0
  );
  const avgSpend = totalSpend / totalCustomers;

  // previous data
  const historyTotalCustomers = historySafeUserReportData?.length;
  const historyActiveCustomers = historySafeUserReportData?.filter(
    (c) => c.status
  ).length;
  const historyTotalSpend = historySafeUserReportData?.reduce(
    (sum, customer) => sum + customer.totalSpend,
    0
  );
  const historyAvgSpend = historyTotalSpend / historyTotalCustomers;

  // calculating growth rate

  const totalCustomersGrowthRate = calculateGrowthRate(
    totalCustomers,
    historyTotalCustomers
  );
  const activeCustomersGrowthRate = calculateGrowthRate(
    activeCustomers,
    historyActiveCustomers
  );
  const totalSpendGrowthRate = calculateGrowthRate(
    totalSpend,
    historyTotalSpend
  );

  const avgSpendGrowthRate = calculateGrowthRate(avgSpend, historyAvgSpend);

  const HeaderTitle = () => {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Báo Cáo người dùng</h1>
        <div className="ml-auto flex items-center gap-4">
          <DateRangePicker
            align="start"
            onUpdate={handleDateRangeChange}
            showCompare={false}
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            locale="vi"
          />

          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <Button>Xuất báo cáo</Button> */}
        </div>
      </header>
    );
  };

  // console.log(userReportData);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <HeaderTitle />

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <TotalCard
            title="Tổng số người dùng"
            value={totalCustomers}
            icon={User}
            // subtitle="Sô lượng khách hàng hiện tại"
            subtitle={totalCustomersGrowthRate}
            classNameIcon="bg-red text"
          />
          <TotalCard
            title="Tổng doanh thu "
            value={formatVND(totalSpend)}
            icon={User}
            // subtitle="Từ đơn hàng khách hàng"
            subtitle={totalSpendGrowthRate}
          />
          <TotalCard
            title="Người dùng đang hoạt động "
            value={activeCustomers}
            icon={User}
            // subtitle="Số lượng khách hàng đang hoạt động"
            subtitle={activeCustomersGrowthRate}
          />
          <TotalCard
            title="Trung bình đơn"
            value={formatVND(avgSpend)}
            icon={User}
            // subtitle="Trung bình đơn hàng mỗi khách hàng"
            subtitle={avgSpendGrowthRate}
          />
        </div>

        <div className=" w-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={37} minSize={30}>
              <UserStatisticChart
                userReportData={safeUserReportData}
                historyUserReportData={historySafeUserReportData}
                dateRange={dateRange}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={63} minSize={50}>
              <UsersOrdersTotalChart
                userReportData={safeUserReportData}
                historyUserReportData={historySafeUserReportData}
                dateRange={dateRange}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="w-full">
          {/* <DataTable
            data={userReportData}
            columns={userReportColumns}
            searchFiled="name"
          /> */}

          <EnhanceDataTableWithAllFeatures
            columns={userReportColumns}
            initialData={safeUserReportData}
            enableExpansion={false}
            enableSelection={false}

            // queryClient={undefined}
          />
        </div>
      </main>
    </div>
  );
};

export default memo(UserReportClient);
