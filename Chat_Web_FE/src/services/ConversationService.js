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

export const findOrCreateConversationService = async (senderId, receiverId) => {
  try {
    const response = await axiosInstance.post(
      "/conversations/find-or-create",
      null,
      {
        params: {
          senderId,
          receiverId,
        },
      }
    );
    console.log("Created or found conversation:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating or finding conversation:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi tạo hoặc tìm hội thoại"
    );
  }
};

export const createGroupConversationService = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/conversations/createConversationGroup",
      data
    );
    console.log("Created group conversation:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating group conversation:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi tạo hội thoại nhóm"
    );
  }
};
