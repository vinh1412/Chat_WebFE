import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGroupConversationService,
  dissolveConversationService,
  findOrCreateConversationService,
  getAllConversationsByUserIdService,
  deleteConversationForUserService,
  getConversationByIdService,
  removeMember,
  updateGroupName,
  leaveGroup,
  addMemberToGroupService,
} from "../services/ConversationService";
import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef } from "react";

const URL_WEB_SOCKET =
  import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

const useConversation = (conversationId) => {
  const queryClient = useQueryClient();
  const client = useRef(null);

  // Websocket setup for real-time updates
  useEffect(() => {
    if (!conversationId) return;
    const socket = new SockJS(URL_WEB_SOCKET);
    client.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 500,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("WebSocket connected for conversation:", conversationId);
        // Đăng ký lắng nghe sự kiện xóa thành viên / thêm thành viên / cập nhật tên nhóm / rời nhóm
        client.current.subscribe(
          `/chat/create/group/${conversationId}`,
          (message) => {
            const data = JSON.parse(message.body);
            console.log(
              "Received message for conversation:",
              conversationId,
              ":",
              data
            );
            // Refetch the conversation to get the latest data
            queryClient.invalidateQueries(["conversation", conversationId]);
            queryClient.invalidateQueries(["conversations"]);
          }
        );
        client.current.activate(); // đảm bảo kích hoạt client
        return () => {
          if (client.current && client.current.connected) {
            client.current.deactivate();
            console.log(
              "WebSocket disconnected for conversation:",
              conversationId
            );
          }
        };
      },
    });
  }, [conversationId, queryClient]);

  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationByIdService(conversationId),
    enabled: !!conversationId, // Only fetch if conservationId is provided
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retryOnMount: false,
  });

  const removeMemberFromGroup = useMutation({
    mutationFn: ({ conversationId, memberId }) =>
      removeMember(conversationId, memberId),
    onSuccess: () => {
      // refetch thông tin cuộc hội thoại
      queryClient.invalidateQueries(["conversation", conversationId]);
      // refetch danh sách cuộc trò chuyện để cập nhật
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      console.log("Send message error:", error.message);
    },
  });

  const updateGroupNameFromGroup = useMutation({
    mutationFn: ({ conversationId, newName }) =>
      updateGroupName(conversationId, newName),
    onSuccess: () => {
      // refetch thông tin cuộc hội thoại
      queryClient.invalidateQueries(["conversation", conversationId]);
      // refetch danh sách cuộc trò chuyện để cập nhật
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      console.log("Update group name error:", error.message);
    },
  });

  const leaveGroupFromGroup = useMutation({
    mutationFn: (conversationId) => leaveGroup(conversationId),
    onSuccess: () => {
      // refetch thông tin cuộc hội thoại
      queryClient.invalidateQueries(["conversation", conversationId]);
      // refetch danh sách cuộc trò chuyện để cập nhật
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      console.log("Leave group error:", error.message);
    },
  });

  const addMemberToGroup = useMutation({
    mutationFn: ({ conversationId, userId }) =>
      addMemberToGroupService(conversationId, userId),
    onSuccess: () => {
      // refetch thông tin cuộc hội thoại
      queryClient.invalidateQueries(["conversation", conversationId]);
      // refetch danh sách cuộc trò chuyện để cập nhật
      queryClient.invalidateQueries(["conversations"]);
      toast.success("Thêm thành viên vào nhóm thành công", {
        position: "top-right",
        autoClose: 500,
      });
    },
    onError: (error) => {
      console.error("Error adding member to group:", error);
      toast.error(
        "Lỗi khi thêm thành viên vào nhóm: " +
          (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-right",
          autoClose: 500,
        }
      );
    },
  });

  const refetchConversation = () => {
    console.log("Refetching conversation with ID:", conversationId);
    queryClient.invalidateQueries(["conversation", conversationId]);
  };

  const { data: conversations, isLoading: isLoadingAllConversations } =
    useQuery({
      queryKey: ["conversations"],
      queryFn: getAllConversationsByUserIdService,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });

  const {
    mutate: findOrCreateConversation,
    isPending: isCreatingConversation,
    error: createConversationError,
  } = useMutation({
    mutationFn: ({ senderId, receiverId }) =>
      findOrCreateConversationService(senderId, receiverId),
    onSuccess: (newConversation) => {
      // Cập nhật lại danh sách hội thoại
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const {
    mutate: createGroupConversation,
    isPending: isCreatingGroupConversation,
    error: createGroupConversationError,
  } = useMutation({
    mutationFn: (data) => createGroupConversationService(data),
    onSuccess: (newGroupConversation) => {
      // Cập nhật lại danh sách hội thoại sau khi tạo nhóm
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const {
    mutate: dissolveConversation,
    isPending: isDissolvingConversation,
    error: dissolveConversationError,
  } = useMutation({
    mutationFn: (conversationId) => dissolveConversationService(conversationId),
    onSuccess: (data) => {
      // Cập nhật lại danh sách hội thoại sau khi giải tán nhóm
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });

  const fetchConversations = async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      return await queryClient.fetchQuery({
        queryKey: ["conversations"],
        queryFn: getAllConversationsByUserIdService,
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  };

  const {
    mutate: deleteConversationForUser,
    isPending: isDeletingConversationForUser,
    error: deleteConversationForUserError,
  } = useMutation({
    mutationFn: (conversationId) =>
      deleteConversationForUserService(conversationId),
    onSuccess: (response) => {
      // Update conversations list
      queryClient.invalidateQueries(["conversations"]);

      if (response.success === false) {
        // Conversation was completely deleted
        queryClient.invalidateQueries(["conversations"]);
        toast.success("Cuộc trò chuyện đã được xóa hoàn toàn", {
          position: "top-right",
          autoClose: 500,
        });
      } else {
        // Conversation was removed from user's list
        // queryClient.invalidateQueries(["conversations"]);
        // toast.success("Đã xóa cuộc trò chuyện khỏi danh sách", {
        //   position: "top-center",
        //   autoClose: 500,
        // });
      }
    },
    onError: (error) => {
      console.error("Error deleting conversation for user:", error);
      toast.error(
        "Lỗi khi xóa cuộc trò chuyện: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    },
  });

  return {
    conversation,
    isLoadingConversation,
    removeMemberFromGroup,
    updateGroupNameFromGroup,
    leaveGroupFromGroup,
    addMemberToGroup,
    refetchConversation,
    conversations,
    isLoadingAllConversations,
    isCreatingConversation,
    findOrCreateConversation, // goi ben SearchSide
    createConversationError,
    createGroupConversation, // Thêm vào để sử dụng khi tạo nhóm
    isCreatingGroupConversation,
    createGroupConversationError,
    dissolveConversation,
    isDissolvingConversation,
    dissolveConversationError,
    fetchConversations,
    deleteConversationForUser,
    isDeletingConversationForUser,
    deleteConversationForUserError,
  };
};

export default useConversation;
