import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGroupConversationService,
  dissolveConversationService,
  findOrCreateConversationService,
  getAllConversationsByUserIdService,
  deleteConversationForUserService,
} from "../services/ConversationService";
import { toast } from "react-toastify";

const useConversation = (conservationId) => {
  const queryClient = useQueryClient();

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
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        // Conversation was removed from user's list
        queryClient.invalidateQueries(["conversations"]);
        toast.success("Đã xóa cuộc trò chuyện khỏi danh sách", {
          position: "top-center",
          autoClose: 2000,
        });
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
