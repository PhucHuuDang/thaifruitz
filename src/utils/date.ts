import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  formatDistanceToNow,
  isValid,
} from "date-fns";
import { vi } from "date-fns/locale";

export const YYYY_MM_DD = "yyyy-MM-dd";

// export const formatDateString = (date: Date) => {
//   return format(date, YYYY_MM_DD);
// };

export const formatDateString = (date: Date | string) => {
  const parsedDate = new Date(date);
  if (!isValid(parsedDate)) {
    console.warn("Invalid date passed to formatDateString:", date);
    return ""; // hoặc return null, hoặc throw tùy logic của bạn
  }
  return format(parsedDate, YYYY_MM_DD);
};

export const createDateRange = (
  fromDate: string | Date,
  toDate: string | Date
) => {
  return eachDayOfInterval({
    start: new Date(fromDate),
    end: new Date(toDate),
  }).map((date) => format(date, YYYY_MM_DD)); // Đảm bảo định dạng ngày giống trong dữ liệu của bạn
};

export const formatDateFns = (date: Date) => {
  // return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  return format(new Date(date), "MMM d, yyyy");
};

export const vietnameseDate = (date: Date | string, isTime?: boolean) => {
  const dateTrans = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const day = new Date(dateTrans).toLocaleDateString("vi-VN", options);
  const time = new Date(dateTrans).toLocaleTimeString("vi-VN");

  if (isTime) {
    return `${day} ${time}`;
  }

  return `${day}`;
};

export const currentDate = format(new Date(), "yyyy-MM-dd");

export const fillMissingDatesDynamics = <T>(
  data: T[],
  allDates: string[],
  fieldDate: keyof T & string,
  fields: (keyof T)[]
) => {
  const dataMap = data.reduce(
    (
      acc: Record<string, Record<string, number>>,
      curr: T
    ): Record<string, Record<string, any>> => {
      const date = curr[fieldDate] as string;

      acc[date] = fields.reduce(
        (obj: Record<string, any>, field: keyof T): Record<string, any> => {
          obj[field as string] = curr[field] as number;
          return obj;
        },
        {} as Record<string, number>
      );

      return acc;
    },
    {} as Record<string, Record<string, number>>
  );

  return allDates.map((date: string) => {
    const dayData = dataMap[date] || {};
    const result: Record<string, number | string> = { date };

    // console.log(dayData);
    fields.forEach((field) => {
      result[field as string] = dayData[field as string] || 0;
    });

    // console.log(result);

    return result;
  });
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch (error) {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  } catch (error) {
    return dateString;
  }
};

export const daysSince = (date: string | Date) => {
  return (
    Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24)
    ) < 1
  );
};

export const differenceDate = (date: string | Date) => {
  const estimateDate = new Date(date); // => Tue Apr 15 2025
  const today = new Date(); // giả sử hôm nay là '2025-04-09'

  const daysLeft = differenceInCalendarDays(estimateDate, today);

  return daysLeft;
};

/**
 * Filters data based on a date range and calculates metrics for the current and previous periods.
 * @param {T[]} data - The array of data to filter.
 * @param {(item: T) => Date} getDate - A function to extract the date field from each item.
 * @param {Date} currentFrom - Start date of the current period.
 * @param {Date} currentTo - End date of the current period.
 * @returns {{ currentPeriodData: T[]; previousPeriodData: T[] }} - Filtered data for both periods.
 */
export const filterDataByDateRange = <T>(
  data: T[],
  getDate: (item: T) => Date,
  currentFrom: Date,
  currentTo: Date
): { currentPeriodData: T[]; previousPeriodData: T[] } => {
  // Helper function to filter data by date range
  const filterByRange = (startDate: Date, endDate: Date): T[] => {
    return data.filter((item) => {
      const itemDate = getDate(item);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Calculate the previous period date range
  const previousFrom = new Date(currentFrom);
  previousFrom.setDate(
    previousFrom.getDate() - (currentTo?.getDate() - currentFrom.getDate() + 1)
  );

  const previousTo = new Date(currentFrom);
  previousTo.setDate(previousTo.getDate() - 1);

  // Filter data for current and previous periods
  const currentPeriodData = filterByRange(currentFrom, currentTo);
  const previousPeriodData = filterByRange(previousFrom, previousTo);

  return { currentPeriodData, previousPeriodData };
};

export const getPreviousDate = (dateRange: {
  from: Date | undefined;
  to?: Date | undefined;
}) => {
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

  return {
    previousFrom,
    previousTo,
  };
};

export function groupOrdersByMonth(orders: any[]) {
  const monthlyData: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.buyDate);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }

    monthlyData[monthYear] += order.totalPrice;
  });

  // Convert to array format for charts
  return Object.entries(monthlyData)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => {
      // Sort by date
      const [aMonth, aYear] = a.month.split(" ");
      const [bMonth, bYear] = b.month.split(" ");

      if (aYear !== bYear) {
        return Number.parseInt(aYear) - Number.parseInt(bYear);
      }

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(aMonth) - months.indexOf(bMonth);
    });
}
