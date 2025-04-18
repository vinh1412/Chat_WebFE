import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllConversationsByUserIdService } from "../services/ConversationService";

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

  return {
    conversations,
    isLoadingAllConversations,
  };
};

export default useConversation;
