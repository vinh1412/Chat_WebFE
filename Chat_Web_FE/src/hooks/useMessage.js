import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMessagesByConversationIdService,
  sendMessageService,
} from "../services/MessageService";
const useMessage = (conversationId) => {
  const queryClient = useQueryClient();
  const { data: messages, isLoading: isLoadingAllMessages } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessagesByConversationIdService(conversationId),
    enabled: !!conversationId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retryOnMount: false,
  });

  // Mutation để gửi tin nhắn
  const sendMessageMutation = useMutation({
    mutationFn: (messageRequest) => sendMessageService(messageRequest),
    onSuccess: () => {
      // Refetch tin nhắn sau khi gửi thành công
      queryClient.invalidateQueries(["messages", conversationId]);
      // Refetch danh sách cuộc trò chuyện để cập nhật lastMessage
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      console.error("Send message error:", error.message);
    },
  });

  // Hàm gửi tin nhắn
  const sendMessage = async (messageRequest) => {
    return sendMessageMutation.mutateAsync(messageRequest);
  };

  // Hàm refetch tin nhắn
  const refetchMessages = () => {
    queryClient.invalidateQueries(["messages", conversationId]);
  };
  console.log("conversationId", conversationId);
  console.log("messages ues", messages);
  console.log("isLoadingAllMessages", isLoadingAllMessages);

  return {
    messages,
    isLoadingAllMessages,
    sendMessage,
    sendMessageMutation,
    refetchMessages,
  };
};

export default useMessage;
