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

export const transferLeader = async (
  conversationId,
  memberId,
  requestingUserId
) => {
  try {
    const response = await axiosInstance.put("/conversations/update-role", {
      conversationId,
      memberId,
      role: "ADMIN",
      requestingUserId,
    });
    console.log("Response transferLeader data:", response.data);
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
export const removeMember = async (conversationId, userId) => {
  try {
    const response = await axiosInstance.delete(
      `/conversations/leave/${conversationId}/member/${userId}`
    );
    console.log("Removed member from group conversation:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error removing member from group conversation:",
      error.response?.data || error.message
    );
    throw new Error();
    // error.response?.data?.message || "Lỗi khi xóa thành viên khỏi nhóm"
  }
};

export const deleteConversationForUserService = async (conversationId) => {
  try {
    const response = await axiosInstance.post(
      `/conversations/delete-for-user/${conversationId}`
    );
    console.log("Response deleteConversationForUser:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting conversation for user:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi xóa cuộc trò chuyện"
    );
  }
};

export const findLinkGroupByConversationId = async (conversationId) => {
  try {
    const response = await axiosInstance.get(
      `/conversations/linkGroup/${conversationId}`
    );
    console.log("Response findLinkGroupByConversationId data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error finding link group by conversation ID:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi tìm kiếm link nhóm"
    );
  }
};

export const updateGroupName = async (conversationId, newGroupName) => {
  try {
    const response = await axiosInstance.put(
      "/conversations/update-group-name",
      { conversationId, newGroupName }
    );
    console.log("Response updateGroupName data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating group name:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật tên nhóm"
    );
  }
};

export const getAllGroupConversationsByUserIdService = async () => {
  try {
    const response = await axiosInstance.get(
      "/conversations/getAllGroupConversationsByUserId"
    );
    console.log("Response group conversations data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching group conversations:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi lấy danh sách nhóm"
    );
  }
};

export const restrictMessagingService = async (conversationId, restrict) => {
  try {
    const response = await axiosInstance.post(
      "/conversations/restrict-messaging",
      {
        conversationId,
        restrict: restrict.toString(),
      }
    );
    console.log("Restricted messaging updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating messaging restriction:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Lỗi khi cập nhật cài đặt nhắn tin"
    );
  }
};
