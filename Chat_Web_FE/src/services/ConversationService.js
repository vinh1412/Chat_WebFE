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

export const dissolveConversationService = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(
      `/conversations/dissolve/${conversationId}`
    );
    console.log("Dissolved conversation:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error dissolving conversation:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi xóa hội thoại");
  }
};

// thêm thành viên vào nhóm

export const addMemberToGroupService = async (conversationId, userId) => {
  try {
    const response = await axiosInstance.post(
      `/conversations/add-member/${conversationId}?id=${userId}`
    );
    console.log("Added member to group conversation:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding member to group conversation:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi thêm thành viên vào nhóm"
    );
  }
};

export const leaveGroup = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(
      `/conversations/leave/${conversationId}`
    );
    console.log("Response leaveGroup data:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error leaving group:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Lỗi khi rời nhóm");
  }
};

export const transferLeader = async (conversationId, memberId, requestingUserId) => {
  try {
      const response = await axiosInstance.put('/conversations/update-role', {
          conversationId,
          memberId,
          role: 'ADMIN',
          requestingUserId,
      });
      console.log('Response transferLeader data:', response.data);
      return response.data;
  } catch (error) {
      console.error(
        "Error transferring leader:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Lỗi khi chuyển quyền trưởng nhóm"
      );
  }
};