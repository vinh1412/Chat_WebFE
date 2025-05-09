import axiosInstance from "../api/axios";

export const getCurrentUserService = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data.response;
};

export const updateUserService = async ({
  name,
  gender,
  birthdate,
  avatar,
}) => {
  const formData = new FormData();

  const requestPayload = {
    display_name: name,
    gender: gender,
    dob: birthdate,
  };

  formData.append("request", JSON.stringify(requestPayload));

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await axiosInstance.put("/user/me/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const changePasswordService = async (oldPassword, newPassword) => {
  const response = await axiosInstance.put("/user/change-password", {
    oldPassword: oldPassword,
    newPassword: newPassword,
  });
  console.log("Change password response:", response.data);
  return response.data;
};

export const checkPhoneExistsService = async (phone) => {
  try {
    const response = await axiosInstance.post("/user/check-phone", { phone });
    console.log("Check phone exists response:", response.data);
    return response.data.exists; // Trả về boolean
  } catch (error) {
    console.error(
      "Error checking phone:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi kiểm tra số điện thoại"
    );
  }
};
