import axiosInstance from "../api/axios";

export const getUserRoleService = async (conversationId, userId = null) => {
  try {
    let url = `/members/role?conversationId=${conversationId}`;

    // Thêm userId vào URL nếu được cung cấp
    if (userId) {
      url += `&userId=${userId}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user role:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Lỗi khi lấy quyền của người dùng"
    );
  }
};

export const getGroupMembersService = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/conversations/members/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching group members:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Lỗi khi lấy danh sách thành viên nhóm"
    );
  }
};