import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUserService,
  updateUserService,
} from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: currentUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserService,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Redirect nếu token hết hạn
  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  }, [isError, error, navigate]);

  // Mutation để cập nhật user
  const {
    mutate: updateUser,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation({
    mutationFn: updateUserService,
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
  });
  return {
    currentUser,
    isLoading,
    isError,
    error,
    updateUser,
    isUpdating,
    isUpdateError,
    updateError,
  };
};

export default useUser;
