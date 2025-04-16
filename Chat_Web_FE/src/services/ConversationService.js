import axiosInstance from "../api/axios";

export const getAllConversationsByUserIdService = async () => {
  try {
    const response = await axiosInstance.get(
      "/conversations/getAllConversationsByUserId"
    );
    // console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching conversations:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách hội thoại"
    );
  }
};

export const getConversationByIdService = async (conversationId) => {
  try {
    const response = await axiosInstance.get(
      `/conversations/${conversationId}`
    );
    // console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching conversation:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi lấy hội thoại");
  }
};
