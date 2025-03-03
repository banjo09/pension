import {
  format,
  parseISO,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  differenceInMonths,
  addMonths,
  isValid,
} from "date-fns";

// Format date for display
export const formatDate = (
  date: Date | string | null | undefined,
  formatStr: string = "dd MMM yyyy"
): string => {
  if (!date) return "N/A";
  
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(parsedDate)) return "Invalid date";
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Format date for form input (YYYY-MM-DD)
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  
  try {
    const parsedDate = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(parsedDate)) return "";
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

// Check if a contribution already exists for a given month
export const hasContributionInMonth = (
  date: Date,
  contributions: Array<{ date: string | Date; type: string }>,
  type: string = "mandatory"
): boolean => {
  return contributions.some((contribution) => {
    const contributionDate = typeof contribution.date === "string"
      ? parseISO(contribution.date)
      : contribution.date;
    
    return (
      contribution.type === type &&
      isSameMonth(contributionDate, date)
    );
  });
};

// Generate monthly date ranges for a period
export const generateMonthlyDateRanges = (
  startDate: Date,
  endDate: Date
): Array<{ start: Date; end: Date; label: string }> => {
  const ranges = [];
  let currentDate = startOfMonth(startDate);
  const lastMonth = endOfMonth(endDate);

  while (currentDate <= lastMonth) {
    const monthEnd = endOfMonth(currentDate);
    ranges.push({
      start: currentDate,
      end: monthEnd,
      label: format(currentDate, "MMMM yyyy"),
    });
    currentDate = addMonths(currentDate, 1);
  }

  return ranges;
};

// Calculate total contribution months between two dates
export const calculateContributionMonths = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  
  return differenceInMonths(end, start) + 1; // Include both start and end months
};

// Get first day of current month
export const getFirstDayOfCurrentMonth = (): Date => {
  return startOfMonth(new Date());
};

// Get last day of current month
export const getLastDayOfCurrentMonth = (): Date => {
  return endOfMonth(new Date());
};

// Get first day of year
export const getFirstDayOfYear = (year: number = new Date().getFullYear()): Date => {
  return new Date(year, 0, 1);
};

// Get last day of year
export const getLastDayOfYear = (year: number = new Date().getFullYear()): Date => {
  return new Date(year, 11, 31);
};

// Check if a date is in the future
export const isFutureDate = (date: Date | string): boolean => {
  const checkDate = typeof date === "string" ? parseISO(date) : date;
  return checkDate > new Date();
};