import axiosInstance from "../api/axios";

export const getMessagesByConversationIdService = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/messages/${conversationId}`);
    console.log("Response data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách tin nhắn"
    );
  }
};

export const sendMessageService = async (messageData) => {
  try {
    const response = await axiosInstance.post("/messages", messageData);
    console.log("Response data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi gửi tin nhắn");
  }
};

export const reCallMessageService = async ({
  messageId,
  senderId,
  conversationId,
}) => {
  try {
    const response = await axiosInstance.post("/messages/recall", {
      messageId,
      senderId,
      conversationId,
    });
    console.log("Response reCallMessageService data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error recalling message:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi thu hồi tin nhắn"
    );
  }
};

export const deleteForUserMessageService = async ({ messageId, userId }) => {
  try {
    const response = await axiosInstance.post("/messages/delete-for-user", {
      messageId,
      userId,
    });
    console.log("Response deleteForUserMessageService data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting for user message:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi xóa tin nhắn cho người dùng"
    );
  }
};
