import { useQuery } from "@tanstack/react-query";
import { getCurrentUserService } from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useUser = () => {
  const navigate = useNavigate();

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

  return {
    currentUser,
    isLoading,
    isError,
    error,
  };
};

export default useUser;
