import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { findOrCreateConversationService, getAllConversationsByUserIdService } from "../services/ConversationService";

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

    

  return {
    conversations,
    isLoadingAllConversations,
    isCreatingConversation,
    findOrCreateConversation, // goi ben SearchSide
    createConversationError,
  };
};

export default useConversation;
