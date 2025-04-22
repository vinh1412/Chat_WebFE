import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGroupConversationService,
  findOrCreateConversationService,
  getAllConversationsByUserIdService,
} from "../services/ConversationService";

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
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
  };
};

export default useConversation;
