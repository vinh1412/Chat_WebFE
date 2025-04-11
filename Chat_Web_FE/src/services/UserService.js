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
