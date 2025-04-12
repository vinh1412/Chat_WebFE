const displayPhoneNumber = (phone) => {
  if (!phone) return phone; // Trả về nguyên gốc nếu không có số
  // Xóa tất cả ký tự không phải số
  let cleaned = phone.replace(/\D/g, "");
  // Chuyển +84 hoặc 84 thành 0
  if (cleaned.startsWith("84")) {
    cleaned = "0" + cleaned.slice(2);
  } else if (cleaned.startsWith("+84")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("0")) {
    // Đã ở định dạng 0xxxxxxxxx
    cleaned = this.cleaned;
  }
  // Kiểm tra độ dài (10 chữ số, bao gồm 0 đầu tiên)
  if (cleaned.length === 10 && cleaned.startsWith("0")) {
    return cleaned;
  }
  return phone; // Trả về nguyên gốc nếu không hợp lệ
};

export default displayPhoneNumber;
