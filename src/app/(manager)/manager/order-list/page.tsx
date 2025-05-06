"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ReportOrdersListClient } from "@/features/manager/report-orders/report-orders-clients";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

const OrderListPage = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: new Date("2025-01-01"),
    to: new Date("2025-04-10"),
  });

  const HeaderTitle = () => {
    const handleDateRangeChange = (values: { range: DateRange }) => {
      if (!values.range.from || !values.range.to) {
        toast.warning("Vui lòng chọn khoảng thời gian hợp lệ");
        return;
      }
      setDateRange(values.range);
    };

    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 justify-between">
        <h1 className="text-xl font-semibold">Báo Cáo Đơn hàng</h1>

        <DateRangePicker
          align="start"
          onUpdate={handleDateRangeChange}
          showCompare={false}
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          locale="vi"
        />
      </header>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col ">
      <HeaderTitle />
      <ReportOrdersListClient dateRange={dateRange} />;
    </div>
  );
};

export default OrderListPage;
