import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFriendReqReceived,
  acceptFriendReq,
  recallFriendReq,
  getFriendReqSent,
  rejectFriendReq,
  sendFriendReq,
} from "../services/FriendService";
import { getFriendList } from "../services/UserService";
// import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const useFriend = () => {

    const queryClient = useQueryClient();
    const { data: friendList, isLoading: isLoadingFriends } = useQuery({
        queryKey: ["friendList"],
        queryFn: getFriendList,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      });

    const { data: receivedRequests, isLoading: isLoadingRecive } = useQuery({
        queryKey: ["receivedRequests"],
        queryFn: getFriendReqReceived,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const { data: sentRequests, isLoading: isLoadingSent } = useQuery({
        queryKey: ["sentRequests"],
        queryFn: getFriendReqSent,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
  
    // Send friend request
    const { mutate: sendRequest, isPending: isLoadingSending } = useMutation({
        mutationFn: (friendId) => sendFriendReq(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries(["sentRequests"]);
            toast.success("Gửi yêu cầu kết bạn thành công!", {
                position: 'top-center',
                autoClose: 2000,
            });
        },
        onError: (error) => {
            console.error("Send friend request failed:", error);
            toast.error("Gửi yêu cầu kết bạn thất bại.", {
                position: 'top-center',
                autoClose: 2000,
            });
        }
    })

    // Accept friend request
    const { mutate: acceptRequest, isPending: isLoadingAccepting } = useMutation({
        mutationFn: (requestId) => acceptFriendReq(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries(["receivedRequests"]); //  cập nhật lại danh sách yêu cầu đã nhận
            queryClient.invalidateQueries(["friendList"]); // cập nhật lại danh sách bạn bè

            toast.success("Chấp nhận yêu cầu kết bạn thành công!", {
                position: 'top-center',
                autoClose: 1000,
            });

        },
        onError: (error) => {
            console.error("Accept friend request failed:", error);
            toast.error("Từ chối yêu cầu kết bạn thất bại.", {
                position: 'top-center',
                autoClose: 2000,
            });
        }
    })

    // Reject friend request
    const { mutate: rejectRequest } = useMutation({
        mutationFn: (requestId) => rejectFriendReq(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries(["receivedRequests"]);
            toast.success("Thu hồi yêu cầu kết bạn thành công!", {
                position: 'top-center',
                autoClose: 1000,
            });
        },
        onError: (error) => {
            console.error("Reject friend request failed:", error);
            toast.error("Failed to reject friend request.", {
                position: 'top-center',
                autoClose: 1000,
            });
        }
    })

    // Recall friend request
    const { mutate: recallRequest } = useMutation({
        mutationFn: (requestId) => recallFriendReq(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries(["sentRequests"]);
            toast.success("Friend request recalled successfully!", {
                position: 'top-center',
                autoClose: 1000,
            });
        },
        onError: (error) => {
            console.error("Recall friend request failed:", error);
            toast.error("Failed to recall friend request.", {
                position: 'top-center',
                autoClose: 1000,
            });
        }
    })

    return {
            friendList,
            isLoadingFriends,
            receivedRequests, 
            isLoadingRecive,
            sentRequests,
            isLoadingSent,
            sendRequest,
            isLoadingSending,
            acceptRequest,
            isLoadingAccepting,
            rejectRequest,
            recallRequest,

    };
};

export default useFriend;
