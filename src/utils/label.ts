export const placeholderImage = "/placeholder.jpg";

enum SexEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export const getSexLabel = (sex: string) => {
  const lowerSex = sex.toLowerCase();

  if (lowerSex === SexEnum.MALE) {
    return "Nam";
  } else if (lowerSex === SexEnum.FEMALE) {
    return "Nữ";
  } else if (lowerSex === SexEnum.OTHER) {
    return "Khác";
  }

  return "Khác";
};

export const orderTypeLabel = (type: string) => {
  const lowerType = type.toLowerCase();

  if (lowerType === "single") {
    return "Đơn Lẻ";
  } else if (lowerType === "combo") {
    return "Combo";
  } else if (lowerType === "custom") {
    return "Tùy Chỉnh Combo";
  }

  return "Khác";
};

export function getUserInitials(name: string): string {
  if (!name) return "";

  const parts = name.split(" ").filter((part) => part.length > 0);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  // Get first letter of first and last parts
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const returnExchangeLabel = (type: string) => {};

export const getOrderType = (type: string) => {
  const lowerType = type?.toLowerCase() ?? "";

  switch (lowerType) {
    case "buy":
      return "Mua hàng";
    case "return":
      return "Trả hàng";
    case "exchange":
      return "Đổi hàng";
    default:
      return "Khác";
  }
};
