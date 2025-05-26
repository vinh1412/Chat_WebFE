import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

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

export const forwardMessageService = async (payload) => {
  try {
    // Kiểm tra v log payload trước khi gửi
    console.log("Payload chuyển tiếp tin nhắn:", payload);

    // Validate đơn giản (nếu cần)
    if (
      !payload.messageId ||
      typeof payload.messageId !== "string" ||
      !payload.senderId ||
      typeof payload.senderId !== "string" ||
      !payload.receiverId ||
      typeof payload.receiverId !== "string" ||
      !payload.content ||
      typeof payload.content !== "string"
    ) {
      throw new Error(
        "Payload không hợp lệ. Vui lòng kiểm tra lại các trường dữ liệu."
      );
    }

    const response = await axiosInstance.post(`/messages/forward`, payload);

    console.log("Phản hồi từ server khi chuyển tiếp:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi chuyển tiếp tin nhắn:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi chuyển tiếp tin nhắn"
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

export const getPinnedMessagesService = async (conversationId) => {
  try {
    if (!conversationId || typeof conversationId !== "string") {
      throw new Error("Conversation ID không hợp lệ.");
    }

    const response = await axiosInstance.get(`/messages/pinned/${conversationId}`);
    console.log("Response getPinnedMessagesService data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching pinned messages:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách tin ghim"
    );
  }
};


export const voteInPoll = async (messageId, userId, optionIndex) => {
  try {
    const response = await axiosInstance.post(
      `/messages/${messageId}/vote`,
      null,
      {
        params: { userId, optionIndex },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Vote response:", response.data);
    toast.success(response.data.message || "Bỏ phiếu thành công!"); // Thêm toast
    return response.data;
  } catch (error) {
    console.error("Error voting:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Lỗi khi bỏ phiếu");
    throw new Error(error.response?.data?.message || "Lỗi khi bỏ phiếu");
  }
};

export const searchMessages = async (params) => {
  try {
    const response = await axiosInstance.get("/messages/search", {
      params: {
        conversationId: params.conversationId,
        keyword: params.keyword,
        senderId: params.senderId,
        date: params.date,
      },
    });
    return response.data.response;
  } catch (error) {
    console.error("Error searching messages:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi tìm kiếm tin nhắn");
  }
};
