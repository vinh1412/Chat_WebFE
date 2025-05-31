import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserRoleService, getGroupMembersService } from "../services/MemberService";
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

  // Query để lấy danh sách thành viên trong nhóm
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["groupMembers", conversationId],
    queryFn: () => getGroupMembersService(conversationId),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });



  return {
    userRole,
    isLoadingUserRole,
    userRoleError,
    refetchUserRole,
    members,
    isLoadingMembers,
    membersError,
    refetchMembers,
    refetch: () => {
      refetchUserRole();
      refetchMembers();
    },
  };

};

export default useMember;
