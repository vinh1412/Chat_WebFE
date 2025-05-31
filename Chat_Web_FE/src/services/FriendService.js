import axiosInstance from "../api/axios";

export const getFriendReqReceived = async () => {
    try {
        const response = await axiosInstance.get("/friend/friend-requests/received");
        return response.data;
    } catch (error) {
        console.error("Error fetching friend requests received:", error);
        throw error;
    }
}
export const getFriendReqSent = async () => {
    try {
        const response = await axiosInstance.get("/friend/friend-requests/sent");
        return response.data;
    } catch (error) {
        console.error("Error fetching friend requests sent:", error);
        throw error;
    }
}
export const sendFriendReq = async (receiverId) => {
    try {
        const response = await axiosInstance.post("/friend/send-request", { receiverId });
        return response.data;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
}
export const acceptFriendReq = async (requestId) => {
    try {
        const response = await axiosInstance.post(`/friend/accept-request/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Error accepting friend request:", error);
        throw error;
    }
}
export const rejectFriendReq = async (requestId) => {
    try {
        const response = await axiosInstance.post(`/friend/reject-request/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        throw error;
    }
}
export const recallFriendReq = async (requestId) => {
    try {
        const response = await axiosInstance.post(`/friend/recall-request/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Error recalling friend request:", error);
        throw error;
    }
}

export const checkFriend = async (friendId) => {
    try {
        const response = await axiosInstance.get(`/friend/check-friend?friendId=${friendId}`);
        return response.data.response; 
    } catch (error) {
        console.error("Error checking friend:", error);
        throw error;
    }
}

export const getFriendsList = async () => {
    try {
      const response = await axiosInstance.get("/friend/my-friends");
      return response.data;
    } catch (error) {
      console.error("Error fetching friends list:", error);
      throw error;
    }
  };


export const unfriendFriend = async (friendId) => {
    try {
        const response = await axiosInstance.post(`/friend/unfriend/${friendId}`);
        return response.data.response; 
    } catch (error) {
        console.error("Error unfriending friend:", error);
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.log("Other error:", error.message);
        }
        throw error;
    }
}  