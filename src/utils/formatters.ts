// Currency formatter
export const formatCurrency = (
  amount: number,
  currency: string = "NGN",
  options: Intl.NumberFormatOptions = {}
): string => {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currency} ${amount.toFixed(2)}`;
  }
};

// Format percentage
export const formatPercentage = (
  value: number,
  decimalPlaces: number = 1
): string => {
  try {
    return `${value.toFixed(decimalPlaces)}%`;
  } catch (error) {
    console.error("Error formatting percentage:", error);
    return `${value}%`;
  }
};

// Format phone number
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";
  
  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Format for Nigerian numbers (e.g., +234 801 234 5678)
  if (cleaned.startsWith("234") && cleaned.length === 13) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  // Format for 11-digit Nigerian numbers without country code (e.g., 0801 234 5678)
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Default formatting for other numbers
  if (cleaned.length > 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
  }
  
  return phoneNumber;
};

// Truncate text with ellipsis
export const truncateText = (
  text: string,
  maxLength: number = 100
): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Convert snake_case or kebab-case to Title Case
export const toTitleCase = (text: string): string => {
  if (!text) return "";
  
  return text
    .replace(/[-_]/g, " ")
    .replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Format contribution type
export const formatContributionType = (type: string): string => {
  switch (type.toLowerCase()) {
    case "mandatory":
      return "Mandatory";
    case "voluntary":
      return "Voluntary (AVC)";
    default:
      return toTitleCase(type);
  }
};

// Format contribution status
export const formatContributionStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "processing":
      return "Processing";
    default:
      return toTitleCase(status);
  }
};

// Get status color class for Tailwind CSS
export const getStatusColorClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};