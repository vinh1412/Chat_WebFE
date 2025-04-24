import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserRoleService } from "../services/MemberService";
const useMember = (conversationId, userId = null) => {
  const queryClient = useQueryClient();

  // Query để lấy vai trò của người dùng
  const {
    data: userRole,
    isLoading: isLoadingUserRole,
    error: userRoleError,
    refetch: refetchUserRole,
  } = useQuery({
    queryKey: ["userRole", conversationId, userId],
    queryFn: () => getUserRoleService(conversationId, userId),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    userRole,
    isLoadingUserRole,
    userRoleError,
    refetchUserRole,
  };
};

export default useMember;
