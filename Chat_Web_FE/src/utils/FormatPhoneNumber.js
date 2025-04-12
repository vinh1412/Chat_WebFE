const formatPhoneNumber = (phone) => {
  // Chuyển đổi số điện thoại thành định dạng quốc tế
  // Nếu số điện thoại bắt đầu bằng "0", thay thế bằng "+84"
  // Nếu số điện thoại bắt đầu bằng "+84", kiểm tra xem có cần thay thế "0" không
  if (phone.startsWith("0")) {
    return "+84" + phone.slice(1);
  } else if (phone.startsWith("+84")) {
    if (phone[3] === "0") {
      return "+84" + phone.slice(4);
    }
    return phone;
  } else {
    return "+84" + phone;
  }
};

export default formatPhoneNumber;
