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

export const getFriendList = async () => {
  try {
    const response = await axiosInstance.get("/user/my-friends");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching friend list:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch friend list"
    );
  }
};

export const searchUser = async (keyword) => {
  try {
    const response = await axiosInstance.get(`/user/search?keyword=${keyword}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error searching user:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to search user");
  }
};
