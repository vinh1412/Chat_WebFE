const formatTime = (createdAt) => {
  if (!createdAt) return "";

  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInMs = now - createdDate;

  if (diffInMs < 0) {
    return createdDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  // Nếu trên 7 ngày => hiển thị ngày/tháng
  return createdDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

export default formatTime;
