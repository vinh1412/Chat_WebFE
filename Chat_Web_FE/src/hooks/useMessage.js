import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteForUserMessageService,
  getMessagesByConversationIdService,
  reCallMessageService,
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
    console.log("Refetching messages for conversationId:", conversationId);
    queryClient.invalidateQueries(["messages", conversationId]);
  };
  // console.log("conversationId", conversationId);
  // console.log("messages ues", messages);
  // console.log("isLoadingAllMessages", isLoadingAllMessages);

  // Mutation để thu hồi tin nhắn
  const recallMessageMutation = useMutation({
    mutationFn: ({ messageId, senderId, conversationId }) =>
      reCallMessageService({ messageId, senderId, conversationId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", conversationId]);
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      console.error("Recall message error:", error.message);
    },
  });

  // Hàm thu hồi tin nhắn
  const recallMessage = async ({ messageId, senderId, conversationId }) => {
    return recallMessageMutation.mutateAsync({
      messageId,
      senderId,
      conversationId,
    });
  };

  const deleteForUserMessageMutation = useMutation({
    mutationFn: ({ messageId, userId }) =>
      deleteForUserMessageService({ messageId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", conversationId]);
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (error) => {
      console.error("Delete for user message error:", error.message);
    },
  });

  // Hàm xóa tin nhắn cho người dùng
  const deleteForUserMessage = async ({ messageId, userId }) => {
    return deleteForUserMessageMutation.mutateAsync({ messageId, userId });
  };

  return {
    messages,
    isLoadingAllMessages,
    sendMessage,
    sendMessageMutation,
    refetchMessages,
    recallMessage,
    recallMessageMutation,
    deleteForUserMessage,
    deleteForUserMessageMutation,
  };
};

export default useMessage;
