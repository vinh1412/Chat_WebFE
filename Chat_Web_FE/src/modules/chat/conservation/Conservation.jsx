import React, { useState, useEffect, useRef, useMemo } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import useMessage from "../../../hooks/useMessage";
import { useDashboardContext } from "../../../context/Dashboard_context";
import formatTime from "../../../utils/FormatTime";
import "../../../assets/css/ConservationStyle.css";
import ConversationDetail from "./ConservationDetail";
import { useSelector, useDispatch } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import MessageActionsDropdown from "../../message/MessageActionsDropdown";
import { checkFriend } from "../../../services/FriendService";
import useFriend from "../../../hooks/useFriend";
import { setIsSuccessSent } from "../../../redux/friendSlice";
import ForwardMessageModal from "../../../components/modal/ForwardMessageModal";
import { forwardMessageService } from "../../../services/MessageService";
import ReactionEmojiModal from "../../../components/modal/ReactionEmojiModal";
import { uploadFile } from "../../../services/FileService";
import "../../../assets/css/UploadFile.css";
import "../../../assets/css/StickerGif.css";
import StickerPicker from "../../../components/stickers/StickerPicker";
import { getFileIcon } from "../../../utils/FormatIconFile";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../../redux/slice/commonSlice";
import useConversation from "../../../hooks/useConversation";

import VideoCallModal from "../../../components/modal/VideoCallModal";
import IncomingCallModal from "../../../components/modal/IncomingCallModal";
import { useQueryClient } from "@tanstack/react-query";
import GroupInfoModal from "../../../components/modal/GroupInfoLinkModal";
import Swal from "sweetalert2";

const Conservation = ({
  onShowDetail,
  onHideDetail,
  showDetail,
  selectedConversation,
  client,
  setShowSearchForm,
}) => {
  console.log("Conservation selectedConversation----", selectedConversation);
  const dispatch = useDispatch();
  const bottomRef = React.useRef(null);

  const { conversations, deleteConversationForUser, conversation } =
    useConversation();

  const handleShowSearchForm = () => {
    setShowSearchForm(true); // Kích hoạt hiển thị SearchForm
    if (!showDetail) onShowDetail(); // Nếu panel chi tiết chưa mở, mở nó
  };

  console.log("conversations", conversations);
  useEffect(() => {
    if (selectedConversation && conversations?.length) {
      // Tìm cuộc trò chuyện đã cập nhật trong danh sách
      const updatedConversation = conversations.find(
        (conv) => conv.id === selectedConversation.id
      );

      if (!updatedConversation) {
        // Cuộc trò chuyện đã bị xóa hoàn toàn khỏi danh sách
        console.log(
          "Conversation has been deleted, navigating back to home screen"
        );
        dispatch(setSelectedConversation(null));
        dispatch(setShowConversation(false));
        return;
      }

      // Kiểm tra các thay đổi quan trọng: trạng thái dissolved, tên nhóm, avatar hoặc danh sách thành viên
      if (
        updatedConversation &&
        (updatedConversation.dissolved !== selectedConversation.dissolved ||
          updatedConversation.name !== selectedConversation.name ||
          updatedConversation.avatar !== selectedConversation.avatar ||
          JSON.stringify(updatedConversation.members) !==
            JSON.stringify(selectedConversation.members))
      ) {
        // console.log("Conversation updated, refreshing UI");
        dispatch(setSelectedConversation(updatedConversation));
      }
    }
  }, [conversations, selectedConversation?.id, dispatch]);

  // lấy danh sách tin nhắn theo conversationId
  const {
    messages,
    isLoadingAllMessages,
    recallMessage,
    deleteForUserMessage,
    refetchMessages,
  } = useMessage(selectedConversation?.id);

  console.log("Conservation selectedConversation----", selectedConversation);
  const queryClient = useQueryClient();

  const { currentUser } = useDashboardContext();

  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const [isFriend, setIsFriend] = useState(false);
  const [isSentReq, setIsSentReq] = useState({});
  const [isReceivedReq, setIsReceivedReq] = useState({});
  const [friendRequestId, setFriendRequestId] = useState("");

  const { sendRequest, sentRequests, receivedRequests, acceptRequest } =
    useFriend();

  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // show reaction emoji modal và các emoji mặc định
  const [showReactionModal, setShowReactionModal] = useState(false);

  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [defaultReactionEmoji, setDefaultReactionEmoji] = useState({
    id: "thumbs-up",
    icon: "👍",
  });
  const handleOpenReactionModal = () => {
    setShowReactionModal(true);
  };

  const handleCloseReactionModal = () => {
    setShowReactionModal(false);
  };

  const handleSelectDefaultEmoji = (emoji) => {
    setDefaultReactionEmoji(emoji);
    setShowReactionModal(false);
    // Optionally show a success message
  };

  const handleCloseVideoCallModal = () => {
    setShowVideoCallModal(false);
  };
  const handleOpenAudioCallModal = () => {
    setShowVideoCallModal(true);
  };

  const handleOpenVideoCallModal = () => {
    setShowVideoCallModal(true);
  };

  // friend request
  const sentReqs = React.useMemo(() => {
    if (!Array.isArray(sentRequests?.response)) return [];
    return sentRequests?.response || []; // Use the response from the sentRequests or an empty array if loading
  }, [sentRequests]);

  const reciveReqs = React.useMemo(() => {
    if (!Array.isArray(receivedRequests?.response)) return [];
    return receivedRequests?.response || []; // Use the response from the receivedRequests or an empty array if loading
  }, [receivedRequests]);

  const messageRefs = useRef({});
  // Lấy thông tin người dùng ngẫu nhiên
  const userReceiver = useMemo(() => {
    if (!selectedConversation?.is_group) {
      return selectedConversation?.members.find(
        (member) => member?.id !== currentUser?.id
      );
    }
    return null;
  }, [selectedConversation, currentUser]);
  // console.log("User receiver updated:", userReceiver);
  // console.log("isSuccessSent:", isSuccessSent[userReceiver?.id]);

  console.log("Selected conversation:", selectedConversation);

  useEffect(() => {
    if (userReceiver) {
      console.log("User receiver updated:", userReceiver);
    }
  }, [userReceiver]);

  // check friend status
  useEffect(() => {
    const checkFriendStatus = async () => {
      try {
        const response = await checkFriend(userReceiver?.id);
        setIsFriend(response);
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
      //kiểm tra đã gửi lời mời hay chưa
      const isSent = sentReqs.find((req) => req?.userId === userReceiver?.id);
      if (isSent) {
        setIsSentReq((prev) => ({ ...prev, [userReceiver?.id]: true }));
      } else {
        setIsSentReq((prev) => ({ ...prev, [userReceiver?.id]: false }));
      }

      //kiểm tra đã nhận lời mời hay chưa
      const isReceived = reciveReqs.find(
        (req) => req?.userId === userReceiver?.id
      );
      if (isReceived) {
        setIsReceivedReq((prev) => ({ ...prev, [userReceiver?.id]: true }));
        setFriendRequestId(isReceived?.requestId);
      } else {
        setIsReceivedReq((prev) => ({ ...prev, [userReceiver?.id]: false }));
      }
    };
    if (userReceiver) checkFriendStatus();
  }, [userReceiver, sentReqs, reciveReqs]);

  useEffect(() => {
    if (messages && messages.response && Array.isArray(messages.response)) {
      const filteredMessages = messages.response.filter(
        (msg) => !msg.deletedByUserIds?.includes(currentUser.id)
      );
      const sortedMessages = filteredMessages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      // setLocalMessages(sortedMessages);
      // Chỉ cập nhật nếu có sự thay đổi thực sự
      setLocalMessages((prevMessages) => {
        // Đảm bảo prevMessages luôn là mảng
        const safePrevMessages = Array.isArray(prevMessages)
          ? prevMessages
          : [];
        if (
          JSON.stringify(safePrevMessages) !== JSON.stringify(sortedMessages)
        ) {
          return sortedMessages;
        }
        return safePrevMessages;
      });

      const pinned = filteredMessages.filter((msg) => msg.pinned);
      setPinnedMessages(Array.isArray(pinned) ? pinned : []);
    } else {
      // Nếu messages không có hoặc không có response, set về mảng rỗng
      setLocalMessages([]);
      setPinnedMessages([]);
    }
  }, [messages, currentUser.id]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages]);

  const stompClient = React.useRef(null);

  const handleSelectReceiver = async (receiver) => {
    try {
      await forwardMessageService({
        messageId: selectedMessage.id,
        senderId: currentUser.id,
        receiverId: receiver.id,
        content: messages || selectedMessage.content, // dùng lại nội dung gốc nếu người dùng không nhập gì
      });
      toast.success(`Đã chia sẻ tới ${receiver.name || "người nhận"}`);
    } catch (error) {
      console.error("Forward message error:", error.message);
      toast.error("Lỗi khi chia sẻ tin nhắn: " + error.message);
    }
  };

  const handleForwardMessage = (message) => {
    setSelectedMessage(message);
    setShowForwardModal(true);
  };

  //hàm ghim tin nhắn
  const handlePinMessage = async ({ messageId, userId, conversationId }) => {
    try {
      // Kiểm tra giới hạn 3 tin nhắn ghim
      if (pinnedMessages.length >= 3) {
        setShowLimitWarning(true);
        toast.warn(
          "Bạn chỉ có thể ghim tối đa 3 tin nhắn. Vui lòng bỏ ghim một tin nhắn để ghim tin mới.",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
        return false;
      }

      if (!client.current || !client.current.connected) {
        toast.error("WebSocket không kết nối. Vui lòng thử lại sau.", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }

      const request = {
        messageId,
        userId,
        conversationId,
      };

      client.current.publish({
        destination: "/app/chat/pin",
        body: JSON.stringify(request),
      });

      setShowLimitWarning(false); // Ẩn thông báo nếu ghim thành công
      return true;
    } catch (error) {
      console.error("Error pinning message:", error);
      toast.error(
        "Không thể ghim tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return false;
    }
  };

  //hàm bỏ ghim tin nhắn
  const handleUnpinMessage = async ({ messageId, userId, conversationId }) => {
    try {
      if (!client.current || !client.current.connected) {
        toast.error("WebSocket không kết nối. Vui lòng thử lại sau.", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }

      const request = {
        messageId,
        userId,
        conversationId,
      };

      client.current.publish({
        destination: "/app/chat/unpin",
        body: JSON.stringify(request),
      });

      return true;
    } catch (error) {
      console.error("Error unpinning message:", error);
      toast.error(
        "Không thể bỏ ghim tin nhắn: " + (error.message || "Đã xảy ra lỗi")
      );
      return false;
    }
  };

  //hàm nhảy tới tin nhắn
  const handleJumpToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      messageElement.classList.add("highlight-message");
    }
  };

  const URL_WEB_SOCKET =
    import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

  useEffect(() => {
    // Khởi tạo tạo kết nối WebSocket
    const socket = new SockJS(URL_WEB_SOCKET); // Thay thế bằng URL WebSocket của bạn
    // Tạo một instance của Client từ @stomp/stompjs, để giao tiếp với server qua WebSocket.
    client.current = new Client({
      webSocketFactory: () => socket, // Sử dụng SockJS để tạo kết nối WebSocket
      reconnectDelay: 5000, // Thời gian chờ để kết nối lại sau khi mất kết nối
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        // Hàm được gọi khi kết nối thành công
        console.log("Connected to WebSocket");

        if (client.current && client.current.connected) {
          try {
            client.current.subscribe(
              `/chat/message/single/${selectedConversation?.id}`, //Đăng ký vào một kênh (topic) cụ thể,
              // để nhận tin nhắn từ server liên quan đến cuộc trò chuyện này
              (message) => {
                const newMessage = JSON.parse(message.body);
                console.log("New message received:", newMessage);

                //CASE 1: Kiểm tra nếu là tin nhắn đã thu hồi
                if (newMessage.recalled === true) {
                  setLocalMessages((prevMessages) => {
                    // Đảm bảo prevMessages là array
                    const safePrevMessages = Array.isArray(prevMessages)
                      ? prevMessages
                      : [];
                    return safePrevMessages.map((msg) => {
                      const msgId = String(msg?.id || msg?._id);
                      const recalledMsgId = String(
                        newMessage.id || newMessage._id
                      );

                      if (msgId === recalledMsgId) {
                        return { ...msg, recalled: true };
                      }
                      return msg;
                    });
                  });
                  //CASE 2: Nếu không phải là tin nhắn đã thu hồi, thêm mới hoặc cập nhật tin nhắn
                } else {
                  const messageId = newMessage.id || newMessage._id;

                  // const existingMessageIndex = localMessages.findIndex(
                  //   (msg) =>
                  //     (msg?.id && String(msg?.id) === String(messageId)) ||
                  //     (msg?._id && String(msg?._id) === String(messageId))
                  // );
                  setLocalMessages((prevMessages) => {
                    // Đảm bảo prevMessages luôn là array
                    const safePrevMessages = Array.isArray(prevMessages)
                      ? prevMessages
                      : [];

                    const existingMessageIndex = safePrevMessages.findIndex(
                      (msg) =>
                        (msg?.id && String(msg?.id) === String(messageId)) ||
                        (msg?._id && String(msg?._id) === String(messageId))
                    );

                    //Kiểm tra xem tin nhắn đã tồn tại trong localMessages chưa
                    //CASE 2.1: Nếu tin nhắn đã tồn tại, cập nhật lại nội dung
                    if (existingMessageIndex !== -1) {
                      const newMessages = [...safePrevMessages];
                      newMessages[existingMessageIndex] = newMessage;
                      return newMessages;
                    }
                    //CASE 2.2: Nếu tin nhắn chưa tồn tại, thêm mới
                    else {
                      return [...safePrevMessages, newMessage];
                    }
                  });
                  // Kiểm tra xem tin nhắn có được ghim hay không
                  if (newMessage.pinned) {
                    setPinnedMessages((prev) => {
                      const safePrev = Array.isArray(prev) ? prev : [];
                      const updatedPinned = safePrev.filter(
                        (msg) =>
                          String(msg.id || msg._id) !==
                          String(newMessage.id || newMessage._id)
                      );
                      return [...updatedPinned, newMessage];
                    });
                  }
                  // Nếu tin nhắn không được ghim, xóa nó khỏi danh sách pinnedMessages
                  else {
                    setPinnedMessages((prev) => {
                      const safePrev = Array.isArray(prev) ? prev : [];
                      return safePrev.filter(
                        (msg) =>
                          String(msg.id || msg._id) !==
                          String(newMessage.id || newMessage._id)
                      );
                    });
                  }
                }

                refetchMessages();

                // Tự động cuộn xuống cuối danh sách tin nhắn khi có tin nhắn mới
                if (bottomRef.current) {
                  bottomRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }
            );

            client.current.subscribe(
              `/friend/accept/${currentUser?.id}`,
              async (message) => {
                if (message.body) {
                  const response = await checkFriend(userReceiver?.id);
                  setIsFriend(response);
                }
              }
            );

            client.current.subscribe(
              `/friend/unfriend/${currentUser?.id}`,
              async (message) => {
                if (message.body) {
                  const response = await checkFriend(userReceiver?.id);
                  setIsFriend(response);
                }
              }
            );
          } catch (error) {
            console.error("Error subscribing:", error);
          }
        }
      },
      onStompError: (frame) => {
        // Hàm được gọi khi có lỗi trong giao thức STOMP
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.current.activate(); // Kích hoạt kết nối WebSocket, bắt đầu quá trình kết nối tới server.

    return () => {
      if (client.current && client.current.connected) {
        client.current.deactivate(); // Ngắt kết nối WebSocket nếu client đang ở trạng thái kết nối.
      }
    };
  }, [selectedConversation?.id, currentUser.id, userReceiver?.id, client]);

  //Handle sending GIF or Sticker
  const handleSendGifOrSticker = (url, type) => {
    if (
      !selectedConversation?.id ||
      !client.current ||
      !client.current.connected
    ) {
      toast.error("WebSocket không kết nối. Vui lòng thử lại sau.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (selectedConversation.restrictMessagingToAdmin && !isAdmin) {
      toast.error("Chỉ trưởng nhóm được phép nhắn tin trong nhóm này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    const request = {
      conversationId: selectedConversation?.id,
      senderId: currentUser.id,
      messageType: type.toUpperCase(),
      [type === "EMOJI" ? "content" : "fileUrl"]: url,
    };
    // console.log("Sending GIF request:", request);

    client.current.publish({
      destination: "/app/chat/send",
      body: JSON.stringify(request),
    });

    refetchMessages();
    setShowStickerPicker(false);
  };

  // Ẩn hiện sticker, gif, emoji picker
  const toggleStickerPicker = () => {
    setShowStickerPicker(!showStickerPicker);
  };

  // Handlers for message reactions/actions
  const handleReaction = (messageId, reaction) => {
    console.log(`Reaction ${reaction} on message ${messageId}`);
    // Implement reaction logic here
    toast.success(`Đã thêm biểu cảm: ${reaction}`, {
      position: "top-center",
      autoClose: 1000,
    });
  };

  // const handleCopyText = (text) => {
  //   navigator.clipboard.writeText(text);
  //   toast.info("Đã sao chép tin nhắn", {
  //     position: "top-center",
  //     autoClose: 1000,
  //   });
  // };

  //   const handleOpenAddModel = (messageId) => {
  //     console.log("Deleting message:", messageId);
  //     // Implement delete logic here
  //     toast.info("Tính năng xóa tin nhắn đang được phát triển", {
  //       position: "top-center",
  //       autoClose: 1000,
  //     });
  //   };

  // Toggle message actions visibility
  const toggleMessageActions = (messageId) => {
    if (showActionsFor === messageId) {
      setShowActionsFor(null);
    } else {
      setShowActionsFor(messageId);
    }
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedConversation?.id) {
      // alert("Vui lòng chọn cuộc trò chuyện và nhập tin nhắn");
      return;
    }
    if (selectedConversation.restrictMessagingToAdmin && !isAdmin) {
      toast.error("Chỉ trưởng nhóm được phép nhắn tin trong nhóm này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    try {
      const request = {
        conversationId: selectedConversation?.id,
        senderId: currentUser?.id,
        content: newMessage,
        messageType: "TEXT",
      };

      if (!client.current || !client.current.connected) {
        toast.error("WebSocket không kết nối. Vui lòng thử lại sau.", {
          position: "top-center",
          autoClose: 1000,
        });
        return;
      }

      // Gửi tin nhắn qua WebSocket
      client.current.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(request),
      });

      refetchMessages(); // Cập nhật lại danh sách tin nhắn từ server
      setNewMessage("");
    } catch (error) {
      console.error("Conservation send message error:", error.message);
      alert("Gửi tin nhắn thất bại: " + error.message);
    }
  };

  // Hàm gửi hình ảnh
  const handleSendImage = async (file) => {
    if (!selectedConversation?.id) {
      toast.error("Vui lòng chọn cuộc trò chuyện trước");
      return;
    }
    if (selectedConversation.restrictMessagingToAdmin && !isAdmin) {
      toast.error("Chỉ trưởng nhóm được phép nhắn tin trong nhóm này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Then after uploading
    const tempId = `temp-${Date.now()}`;
    const tempUrl = URL.createObjectURL(file);
    const tempMsg = {
      id: tempId,
      senderId: currentUser.id,
      messageType: "IMAGE",
      fileUrl: tempUrl,
      timestamp: new Date(),
      fileName: file.name,
      uploading: true,
    };

    setLocalMessages((prev) => [...prev, tempMsg]);

    try {
      const chatMessageRequest = {
        senderId: currentUser.id,
        conversationId: selectedConversation.id,
        receiverId: userReceiver?.id,
        messageType: "IMAGE",
        content: file.name,
      };

      const result = await uploadFile(file, chatMessageRequest);
      const updatedRequest = {
        ...chatMessageRequest,
        fileUrl: result.fileUrls?.[0],
      };
      client.current.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(updatedRequest),
      });

      setLocalMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      refetchMessages();
    } catch (error) {
      toast.error(`Lỗi khi gửi hình ảnh: ${error.message}`);
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  // Hàm gửi nhiều hình ảnh
  const handleSendImages = async (files) => {
    for (const file of files) {
      await handleSendImage(file);
    }
  };

  // Hàm gửi tệp đính kèm
  const handleSendFile = async (file) => {
    if (!selectedConversation?.id) {
      toast.error("Vui lòng chọn cuộc trò chuyện trước");
      return;
    }
    if (selectedConversation.restrictMessagingToAdmin && !isAdmin) {
      toast.error("Chỉ trưởng nhóm được phép nhắn tin trong nhóm này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    // Then after uploading
    console.log("File to be sent:", file);

    const tempId = `temp-${Date.now()}`;
    const tempUrl = URL.createObjectURL(file);
    const tempMsg = {
      id: tempId,
      senderId: currentUser.id,
      messageType: "FILE",
      fileUrl: tempUrl,
      timestamp: new Date(),
      uploading: true,
    };

    setLocalMessages((prev) => [...prev, tempMsg]);

    try {
      const chatMessageRequest = {
        senderId: currentUser.id,
        conversationId: selectedConversation.id,
        messageType: "FILE",
        content: file.name,
      };

      const result = await uploadFile(file, chatMessageRequest);
      const updatedRequest = {
        ...chatMessageRequest,
        fileUrl: result.fileUrls?.[0],
      };

      client.current.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(updatedRequest),
      });

      setLocalMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      refetchMessages();
    } catch (error) {
      toast.error(`Lỗi khi gửi tệp đính kèm: ${error.message}`);
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  // Gửi nhiều file
  const handleSendFiles = async (files) => {
    for (const file of files) {
      await handleSendFile(file);
    }
  };

  // Hàm gửi video
  const handleSendVideo = async (file) => {
    if (!selectedConversation?.id) {
      toast.error("Vui lòng chọn cuộc trò chuyện trước");
      return;
    }
    if (selectedConversation.restrictMessagingToAdmin && !isAdmin) {
      toast.error("Chỉ trưởng nhóm được phép nhắn tin trong nhóm này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Kiểm tra kích thước file (ví dụ: tối đa 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video vượt quá giới hạn 50MB");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempUrl = URL.createObjectURL(file);
    const tempMsg = {
      id: tempId,
      senderId: currentUser.id,
      messageType: "VIDEO",
      fileUrl: tempUrl,
      timestamp: new Date(),
      fileName: file.name,
      uploading: true,
    };

    setLocalMessages((prev) => [...prev, tempMsg]);

    try {
      const chatMessageRequest = {
        senderId: currentUser.id,
        conversationId: selectedConversation.id,
        receiverId: userReceiver?.id,
        messageType: "VIDEO",
      };
      console.log("Chat message request:", chatMessageRequest);

      const result = await uploadFile(file, chatMessageRequest);
      const updatedRequest = {
        ...chatMessageRequest,
        fileUrl: result.fileUrls?.[0],
      };

      client.current.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(updatedRequest),
      });

      setLocalMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      refetchMessages();
    } catch (error) {
      toast.error(`Lỗi khi gửi video: ${error.message}`);
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  // Gửi nhiều video
  const handleSendVideos = async (files) => {
    for (const file of files) {
      await handleSendVideo(file);
    }
  };

  // Hàm gửi nhanh emoji
  const handleQuickReaction = () => {
    if (!selectedConversation?.id) return;
    if (!client.current || !client.current.connected) {
      toast.error("WebSocket không kết nối. Vui lòng thử lại sau.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (selectedConversation.restrictMessagingToAdmin && !isAdmin) {
      toast.error("Chỉ trưởng nhóm được phép nhắn tin trong nhóm này", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Send the emoji reaction via WebSocket
    const request = {
      conversationId: selectedConversation?.id,
      senderId: currentUser.id,
      messageType: "EMOJI",
      content: defaultReactionEmoji.icon,
    };

    client.current.publish({
      destination: "/app/chat/send",
      body: JSON.stringify(request),
    });
  };

  // Hàm thu hồi tin nhắn
  const handleRecallMessage = async ({
    messageId,
    senderId,
    conversationId,
  }) => {
    try {
      // console.log("Recalling message:", messageId, senderId, conversationId);

      // Nếu đang sử dụng WebSocket và kết nối đang hoạt động
      if (client.current && client.current.connected) {
        // Đảm bảo messageId đang được dùng là đúng
        const messageToRecall = localMessages.find(
          (msg) =>
            String(msg?.id) === String(messageId) ||
            String(msg?._id) === String(messageId)
        );

        // Kiểm tra xem tin nhắn có tồn tại trong localMessages không, nếu không thì không thu hồi được, thông báo lỗi
        if (!messageToRecall) {
          console.error("Could not find message with ID:", messageId);
          toast.error("Không thể tìm thấy tin nhắn để thu hồi", {
            position: "top-center",
            autoClose: 2000,
          });
          return false;
        }

        // Kiểm tra thời gian gửi tin nhắn, chỉ cho phép thu hồi trong vòng 5 phút
        const messageTime = new Date(
          messageToRecall.timestamp || messageToRecall.created_at
        );
        const currentTime = new Date();
        const timeDifference = currentTime - messageTime;
        const fiveMinutesInMs = 5 * 60 * 1000;

        if (timeDifference > fiveMinutesInMs) {
          toast.error(
            "Chỉ có thể thu hồi tin nhắn trong vòng 5 phút sau khi gửi",
            {
              position: "top-right",
              autoClose: 500,
            }
          );
          return false;
        }

        // console.log("Message to recall:", messageToRecall);

        const request = {
          messageId: messageId,
          senderId: senderId,
          conversationId: conversationId,
        };

        // Gửi yêu cầu thu hồi qua WebSocket, Server sẽ xử lý yêu cầu này và gửi thông báo thu hồi tới tất cả client trong cuộc trò chuyện
        client.current.publish({
          destination: "/app/chat/recall",
          body: JSON.stringify(request),
        });
        await recallMessage({ messageId, senderId, conversationId });

        return true;
      } else {
        // Fallback nếu WebSocket không hoạt động
        await recallMessage({ messageId, senderId, conversationId });
        return true;
      }
    } catch (error) {
      console.error("Error recalling message:", error);
      toast.error(
        "Không thể thu hồi tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return false;
    }
  };

  // Hàm xóa tin nhắn cho người dùng
  const handleDeleteForUser = async ({ messageId, userId }) => {
    try {
      const safeLocalMessages = Array.isArray(localMessages)
        ? localMessages
        : [];
      const messageExists = safeLocalMessages.find(
        (msg) => String(msg.id || msg._id) === String(messageId)
      );

      if (!messageExists) {
        toast.error("Không tìm thấy tin nhắn để xóa");
        return false;
      }
      // Nếu WebSocket đang kết nối, gửi yêu cầu xóa qua WebSocket
      if (client.current && client.current.connected) {
        client.current.publish({
          destination: "/app/chat/delete-for-user",
          body: JSON.stringify({
            messageId: messageId,
            userId: userId,
          }),
        });

        await deleteForUserMessage({ messageId, userId });

        // Cập nhật localMessages ngay lập tức để tránh lỗi UI
        setLocalMessages((prevMessages) => {
          const safePrevMessages = Array.isArray(prevMessages)
            ? prevMessages
            : [];
          return safePrevMessages.filter(
            (msg) => String(msg.id || msg._id) !== String(messageId)
          );
        });

        return true;
      } else {
        // Fallback - gọi API nếu WebSocket không hoạt động
        await deleteForUserMessage({ messageId, userId });

        return true;
      }
    } catch (error) {
      console.error("Error deleting message for user:", error);
      toast.error(
        "Không thể xóa tin nhắn: " + (error.message || "Đã xảy ra lỗi"),
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return false;
    }
  };

  // Handle click outside to close message actions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showActionsFor &&
        !event.target.closest(".message-container") &&
        !event.target.closest(".message-actions")
      ) {
        setShowActionsFor(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionsFor]);

  // Function to find sender info
  const getSenderInfo = (msg) => {
    const isSentByMe = msg.sender === "me" || msg.senderId === currentUser.id;

    if (isSentByMe) {
      return {
        avatar: currentUser.avatar,
        name: currentUser.display_name,
      };
    } else {
      if (!selectedConversation.is_group) {
        // In 1-on-1 chat, the other person is the sender
        const otherMember = selectedConversation.members.find(
          (member) => member.id !== currentUser.id
        );
        return {
          avatar: otherMember?.avatar,
          name: otherMember?.display_name || "User",
        };
      } else {
        // In group chat, find the specific sender
        const sender = selectedConversation.members.find(
          (member) => member.id === msg.senderId
        );
        return {
          avatar: sender?.avatar,
          name: sender?.display_name || "Unknown User",
        };
      }
    }
  };

  const isAdmin = useMemo(() => {
    if (!selectedConversation?.is_group) return true; // Không áp dụng cho cuộc trò chuyện 1-1
    const currentMember = selectedConversation?.members?.find(
      (member) => member.id === currentUser.id
    );
    return currentMember?.role === "ADMIN";
  }, [selectedConversation, currentUser.id]);

  // modal link gr

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (e) => {
    e.stopPropagation(); // ngăn sự kiện nổi bọt
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleJoin = () => {
    // Xử lý khi user bấm Tham gia
    // alert('Bạn đã tham gia nhóm!');
    setShowModal(false);
  };

  // TACH LINKGROUP  chỉ lấy sau qrcode/
  const extractLinkGroup = (text) => {
    const regex = /qrcode\/(.*)/;
    const match = text.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div
      className="card shadow-sm h-100"
      style={{
        width: "100%",
        transition: "width 0.3s ease-in-out",
        height: "100vh",
      }}
    >
      {/* Header */}
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          {selectedConversation?.is_group ? (
            selectedConversation?.avatar ? (
              <img
                src={selectedConversation.avatar}
                alt="avatar group"
                width={50}
                height={50}
                className="rounded-circle me-3"
              />
            ) : (
              <div
                className="d-flex flex-wrap align-items-center me-3"
                style={{
                  width: 50,
                  height: 50,
                }}
              >
                {selectedConversation.members
                  .slice(0, 4)
                  .map((member, index) => (
                    <div
                      key={member.id}
                      style={{
                        width: "50%",
                        height: "50%",
                      }}
                    >
                      <img
                        src={member.avatar}
                        alt={`member-${index}`}
                        className="rounded-circle w-100 h-100"
                        style={{
                          objectFit: "cover",
                          border: "1px solid white",
                        }}
                      />
                    </div>
                  ))}
              </div>
            )
          ) : (
            <img
              src={
                selectedConversation?.members.find(
                  (member) => member?.id !== currentUser?.id
                )?.avatar
              }
              alt="avatar"
              width={50}
              height={50}
              className="rounded-circle me-3"
            />
          )}

          <div className="flex-grow-1">
            <h6 className="mb-0">
              {!selectedConversation?.is_group
                ? selectedConversation?.members.find(
                    (member) => member?.id !== currentUser?.id
                  ).display_name
                : selectedConversation?.name}
            </h6>
            <small className="text-muted">
              {!selectedConversation?.is_group && !isFriend ? "Người lạ" : ""} ·
              Không có nhóm chung
            </small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm" onClick={handleOpenAudioCallModal}>
            <i class="bi bi-telephone"></i>
          </button>
          <button className="btn btn-sm" onClick={handleOpenVideoCallModal}>
            <i className="bi bi-camera-video"></i>
          </button>
          <button className="btn btn-sm" onClick={handleShowSearchForm}>
            <i className="bi bi-search"></i>
          </button>
          <button
            className="btn btn-sm"
            onClick={showDetail ? onHideDetail : onShowDetail}
          >
            <i
              className={`bi ${
                showDetail ? "bi-arrow-bar-right" : "bi-arrow-bar-left"
              } me-2`}
            ></i>
          </button>
        </div>
      </div>

      {selectedConversation?.dissolved && (
        <div className="alert alert-warning mb-0 text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Nhóm này đã bị giải tán. Không thể gửi tin nhắn mới.
        </div>
      )}
      {/* Notification */}
      {!selectedConversation?.is_group && !isFriend && (
        <div
          className="card-body d-flex align-items-center justify-content-between"
          style={{ height: "10px" }}
        >
          {isSentReq[userReceiver?.id] ? (
            <div>
              <span className="">
                Bạn đã gửi lời mời kết bạn và đang chờ phản hồi từ người này
              </span>
            </div>
          ) : isReceivedReq[userReceiver?.id] ? (
            <>
              <div>
                <i className="bi bi-person-plus-fill mx-2"></i>
                <span> Bạn đã nhận được lời mời kết bạn từ người này</span>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  console.log("Friend request ID:", friendRequestId);
                  acceptRequest(friendRequestId);
                }}
              >
                Chấp nhận
              </button>
            </>
          ) : (
            <>
              <div>
                <i className="bi bi-person-plus-fill mx-2"></i>
                <span>Gửi yêu cầu kết bạn tới người này</span>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  sendRequest(userReceiver.id);
                  dispatch(setIsSuccessSent(userReceiver.id));
                }}
              >
                Gửi kết bạn
              </button>
            </>
          )}
        </div>
      )}

      {/* Hiển thị thông báo nếu vượt quá giới hạn (tùy chọn, có thể bỏ nếu chỉ dùng toast) */}

      {showLimitWarning && (
        <div
          className="alert alert-warning alert-dismissible fade show mb-2"
          role="alert"
          style={{ fontSize: "14px", padding: "8px" }}
        >
          Bạn chỉ có thể ghim tối đa 3 tin nhắn. Vui lòng bỏ ghim một tin nhắn
          để ghim tin mới.
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowLimitWarning(false)}
            style={{ fontSize: "12px" }}
          ></button>
        </div>
      )}

      {/* Hộp chứa danh sách tin nhắn ghim */}
      {pinnedMessages.length > 0 ? (
        <div
          className="card-body bg-light"
          style={{
            borderBottom: "1px solid #ddd",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        >
          <h6 className="text-muted mb-2">Tin nhắn đã ghim</h6>
          {pinnedMessages.map((msg) => {
            const messageId = msg?.id || msg?._id;
            const isSentByMe = msg.senderId === currentUser.id;
            const senderInfo = getSenderInfo(msg);
            return (
              <div
                key={`pinned-${messageId}`}
                className="d-flex align-items-center p-2 rounded bg-white mb-2 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => handleJumpToMessage(messageId)}
              >
                {!isSentByMe && (
                  <img
                    src={senderInfo.avatar}
                    alt={senderInfo.name}
                    className="rounded-circle me-2"
                    width={30}
                    height={30}
                    style={{ objectFit: "cover" }}
                  />
                )}
                <div className="flex-grow-1">
                  <small className="text-muted">
                    {isSentByMe ? "Bạn" : senderInfo.name}:{" "}
                    {msg.messageType === "TEXT"
                      ? msg.content.length > 50
                        ? msg.content.substring(0, 50) + "..."
                        : msg.content
                      : msg.messageType === "IMAGE"
                      ? "[Hình ảnh]"
                      : msg.messageType === "FILE"
                      ? "[Tệp đính kèm]"
                      : "[Sticker/GIF]"}
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-light ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnpinMessage({
                      messageId,
                      userId: currentUser.id,
                      conversationId: selectedConversation.id,
                    });
                    setShowLimitWarning(false); // Ẩn thông báo khi bỏ ghim
                  }}
                >
                  <i className="bi bi-pin-angle-fill text-danger"></i>
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Chat Messages */}
      <div
        className="card-body bg-light"
        style={{
          height:
            pinnedMessages.length > 0
              ? "calc(100vh - 300px)"
              : "calc(100vh - 230px)",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {selectedConversation?.restrictMessagingToAdmin && !isAdmin && (
          <div className="alert alert-info mb-2 text-center">
            <i className="bi bi-lock-fill me-2"></i>
            Chỉ trưởng nhóm được phép nhắn tin trong nhóm này.
          </div>
          //
        )}
        {isLoadingAllMessages ? (
          <p className="text-muted text-center">Đang tải tin nhắn...</p>
        ) : !localMessages || localMessages.length === 0 ? (
          selectedConversation?.dissolved ? (
            <div className="text-center my-5">
              <div className="alert alert-warning d-inline-block p-4 shadow-sm">
                <i className="bi bi-x-circle-fill text-danger me-2 fs-4"></i>
                <div className="mt-2">
                  <h5>Nhóm đã bị giải tán</h5>
                  <p className="mb-0 text-muted">
                    Nhóm này đã bị giải tán bởi trưởng nhóm.
                  </p>
                  {selectedConversation.dissolvedAt && (
                    <small className="text-muted d-block mt-2">
                      Thời gian giải tán:{" "}
                      {formatTime(selectedConversation.dissolvedAt)}
                    </small>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted text-center">Chưa có tin nhắn...</p>
          )
        ) : (
          localMessages.map((msg, index) => {
            const messageId = msg?.id || msg?._id || `temp-${index}`;
            const isSentByMe =
              msg?.sender === "me" || msg?.senderId === currentUser?.id;
            const isRecalled = msg?.recalled === true;
            const senderInfo = getSenderInfo(msg);
            return (
              <div
                key={messageId}
                id={`message-${messageId}`}
                className={`mb-2 d-flex position-relative message-container ${
                  msg?.messageType === "SYSTEM"
                    ? "justify-content-center"
                    : isSentByMe
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
                onMouseEnter={() =>
                  msg?.messageType !== "SYSTEM" &&
                  setHoveredMessageId(messageId)
                }
                onMouseLeave={() =>
                  msg?.messageType !== "SYSTEM" && setHoveredMessageId(null)
                }
              >
                {/* Show avatar for messages from other users (hide for system messages) */}
                {!isSentByMe && msg?.messageType !== "SYSTEM" && (
                  <div className="me-2 d-flex flex-column align-items-center justify-content-center">
                    <img
                      src={senderInfo.avatar}
                      alt={senderInfo.name}
                      className="rounded-circle"
                      width={45}
                      height={45}
                      style={{ objectFit: "cover" }}
                    />
                    {selectedConversation.is_group && (
                      <small
                        className="text-muted mt-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {senderInfo.name?.split(" ").pop() || "User"}
                      </small>
                    )}
                  </div>
                )}
                <div
                  className={`p-2 rounded shadow-sm message-bubble ${
                    msg?.messageType === "SYSTEM"
                      ? "text-center bg-light system-message rounded-pill"
                      : isSentByMe
                      ? "text-black message-sent"
                      : "bg-light border message-received"
                  } ${isRecalled ? "message-recalled" : ""} ${
                    msg?.messageType === "STICKER" || msg?.messageType === "GIF"
                      ? "sticker-message"
                      : ""
                  }`}
                  style={{
                    maxWidth: msg?.messageType === "SYSTEM" ? "70%" : "70%",
                    backgroundColor:
                      msg?.messageType === "SYSTEM"
                        ? "#f8f9fa"
                        : isSentByMe
                        ? isRecalled
                          ? "#f0f0f0"
                          : msg?.messageType === "STICKER"
                          ? "transparent"
                          : "#dcf8c6"
                        : msg?.messageType === "STICKER"
                        ? "transparent"
                        : "#ffffff",
                    position: "relative",
                    opacity: isRecalled ? 0.7 : 1,
                    ...(msg?.messageType === "STICKER"
                      ? {
                          boxShadow: "none",
                          border: "none",
                        }
                      : {}),
                    ...(msg?.messageType === "SYSTEM"
                      ? {
                          border: "1px dashed #ddd",
                          fontSize: "0.9rem",
                          color: "#666",
                        }
                      : {}),
                  }}
                  ref={(el) => (messageRefs.current[messageId] = el)}
                  onClick={() =>
                    msg?.messageType !== "SYSTEM" &&
                    toggleMessageActions(messageId)
                  }
                >
                  {isRecalled ? (
                    <span className="text-muted">
                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                      Tin nhắn đã bị thu hồi
                    </span>
                  ) : msg?.messageType === "GIF" ||
                    msg?.messageType === "STICKER" ? (
                    <img src={msg?.fileUrl} alt={msg?.messageType} />
                  ) : msg?.messageType === "IMAGE" || msg?.type === "IMAGE" ? (
                    msg.uploading ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      <button
                        className="btn p-0 border-0 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(msg?.fileUrl, "_blank");
                        }}
                      >
                        {console.log(
                          "msg?.fileUrl:",
                          msg?.fileUrl,
                          "msg:",
                          msg
                        )}
                        <img
                          src={msg?.fileUrl}
                          alt="Hình ảnh"
                          className="img-fluid rounded"
                          style={{
                            maxWidth: "300px",
                            maxHeight: "300px",
                            objectFit: "contain",
                          }}
                        />
                      </button>
                    )
                  ) : msg?.messageType === "VIDEO" ? (
                    msg.uploading ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Đang tải video...</span>
                      </div>
                    ) : (
                      <video
                        controls
                        src={msg?.fileUrl}
                        className="rounded"
                        style={{
                          maxWidth: "300px",
                          maxHeight: "300px",
                          objectFit: "contain",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <source
                          src={msg?.fileUrl}
                          type={msg?.fileType || "video/mp4"}
                        />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                      </video>
                    )
                  ) : msg?.messageType === "FILE" ? (
                    msg.uploading ? (
                      <div className="d-flex align-items-center">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Đang tải tệp...</span>
                      </div>
                    ) : (
                      <div className="file-container">
                        <button
                          className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(msg?.fileUrl, "_blank");
                          }}
                        >
                          <span className="me-2 fs-4">
                            {getFileIcon(msg?.content)}
                          </span>
                          <div className="d-flex flex-column align-items-start">
                            <span className="file-name">{msg?.content}</span>
                            <small className="text-muted">
                              Nhấn để xem • Nhấn phải để tải xuống
                            </small>
                          </div>
                        </button>
                        <a
                          href={msg?.fileUrl}
                          download={msg?.content}
                          className="download-link ms-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // Create a hidden anchor for downloading
                            const downloadLink = document.createElement("a");
                            downloadLink.href = msg?.fileUrl;
                            downloadLink.download = msg?.content;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                          }}
                          title="Tải xuống"
                        >
                          <i className="bi bi-download text-primary"></i>
                        </a>
                      </div>
                    )
                  ) : msg?.messageType === "TEXT" &&
                    msg.content.startsWith("http") ? (
                    <div>
                      <small className="text-muted d-block">
                        <button
                          className="btn btn-link p-0"
                          onClick={handleOpenModal}
                        >
                          {msg.content}
                        </button>
                        {showModal && (
                          <GroupInfoModal
                            onClose={handleCloseModal}
                            onJoin={handleJoin}
                            groupLink={extractLinkGroup(msg.content)}
                          />
                        )}
                      </small>
                    </div>
                  ) : (
                    <span>{msg?.content || msg?.text}</span>
                  )}
                  {/* Only show timestamp for non-system messages */}
                  {msg?.messageType !== "SYSTEM" && (
                    <div>
                      <small className="text-muted d-block">
                        {formatTime(msg?.created_at || msg?.timestamp)}
                      </small>
                    </div>
                  )}
                  {/* {msg?.messageType === "TEXT" && msg.content.startsWith("http") && (
                    <div>
                      <small className="text-muted d-block">
                        <button
                          className="btn btn-link p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(msg.content, "_blank");
                          }}
                        >
                          {msg.content}
                        </button>
                      </small>
                    </div>
                  )} */}
                </div>

                {/* Show message actions on hover OR when clicked */}
                {(hoveredMessageId === messageId ||
                  showActionsFor === messageId) && (
                  <div
                    className="message-actions"
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: isSentByMe
                        ? `${
                            messageRefs.current[messageId]?.offsetWidth + 10
                          }px`
                        : "auto",
                      left: !isSentByMe
                        ? `${messageRefs.current[msg?.id]?.offsetWidth + 65}px`
                        : "auto",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "20px",
                      padding: "5px 10px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      display: "flex",
                      gap: "12px",
                      zIndex: 100,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on actions
                  >
                    <i
                      className="bi bi-chat-quote action-icon"
                      onClick={() => handleReaction(msg?.id, "smile")}
                      style={{
                        cursor: "pointer",
                        color: "#666",
                      }}
                      title="Trả lời"
                    ></i>
                    {isSentByMe ? (
                      <i
                        className="bi bi-reply action-icon"
                        onClick={() => handleForwardMessage(msg)}
                        style={{
                          cursor: "pointer",
                          color: "#666",
                        }}
                        title="Chuyển tiếp"
                      ></i>
                    ) : (
                      <i
                        className="bi bi-reply action-icon"
                        onClick={() => handleForwardMessage(msg)}
                        style={{
                          cursor: "pointer",
                          color: "#666",
                          transform: "scaleX(-1)",
                        }}
                        title="Chuyển tiếp"
                      ></i>
                    )}
                    {/* <i
                      className="bi bi-three-dots action-icon"
                      onClick={() => handleOpenAddModel(msg?.id)}
                      style={{ cursor: "pointer", color: "#666" }}
                      title="Thêm"
                    ></i> */}
                    <MessageActionsDropdown
                      messageId={messageId}
                      senderId={msg?.senderId}
                      conversationId={selectedConversation?.id}
                      onRecallMessage={handleRecallMessage}
                      onDeleteForUser={handleDeleteForUser}
                      currentUserId={currentUser.id}
                      isRecalled={isRecalled}
                      onPinMessage={handlePinMessage}
                      onUnpinMessage={handleUnpinMessage}
                      isPinned={msg.pinned}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} /> {/* Để tự động cuộn xuống cuối */}
      </div>

      {/* Input Section */}
      <div className="card-footer">
        {selectedConversation?.dissolved ? (
          <div className="alert alert-warning mb-0 text-center">
            <i className="bi bi-lock-fill me-2"></i>
            Nhóm đã bị giải tán. Không thể gửi tin nhắn mới.
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={() => {
                // Xác nhận xóa cuộc trò chuyện
                Swal.fire({
                  title: "Bạn có chắc chắn muốn xác nhận xóa",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Xóa",
                  cancelButtonText: "Hủy",
                }).then((result) => {
                  if (result.isConfirmed) {
                    deleteConversationForUser(selectedConversation.id);
                    dispatch(setSelectedConversation(null));
                    dispatch(setShowConversation(false));
                  }
                });
              }}
            >
              <i className="bi bi-trash3 me-1"></i>
              Xóa cuộc trò chuyện
            </button>
          </div>
        ) : selectedConversation?.restrictMessagingToAdmin && !isAdmin ? (
          <div className="alert alert-info mb-0 text-center">
            <i className="bi bi-lock-fill me-2"></i>
            Chỉ trưởng nhóm được phép nhắn tin trong nhóm này.
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center gap-2 mb-2">
              <button className="btn btn-light" onClick={toggleStickerPicker}>
                <i className="bi bi-emoji-smile"></i>
              </button>
              <label className="btn btn-light mb-0" htmlFor="image-upload">
                <i className="bi bi-image"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length) handleSendImages(files);
                }}
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              />
              <label className="btn btn-light mb-0" htmlFor="file-upload">
                <i className="bi bi-paperclip"></i>
              </label>
              <input
                type="file"
                id="file-upload"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files) handleSendFiles(files);
                }}
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              />
              <input
                type="file"
                id="video-upload"
                multiple
                accept="video/*" // Chỉ chấp nhận file video
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length) handleSendVideos(files);
                }}
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              />
              <label className="btn btn-light mb-0" htmlFor="video-upload">
                <i class="bi bi-file-earmark-play-fill"></i>
              </label>
              <button
                className="btn btn-light"
                onClick={() =>
                  alert("Tính năng ghi âm đang được phát triển...")
                }
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              >
                <i className="bi bi-mic"></i>
              </button>
              <button
                className="btn btn-light"
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              >
                <i className="bi bi-lightning"></i>
              </button>
              <button
                className="btn btn-light"
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              >
                <i className="bi bi-three-dots"></i>
              </button>
            </div>
            {/* form sticker/ emoji / gif */}
            {showStickerPicker && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100px",
                  left: "10px",
                  zIndex: 1000,
                }}
              >
                <StickerPicker
                  onStickerSelect={(url) => {
                    const type = url.startsWith("http")
                      ? url.includes("giphy.com")
                        ? "GIF"
                        : "STICKER"
                      : "EMOJI";
                    handleSendGifOrSticker(url, type);
                  }}
                />
              </div>
            )}

            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              />
              <button
                className="btn btn-light d-flex align-items-center"
                onClick={handleSendMessage}
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
              >
                <i
                  className={`bi ${
                    newMessage.trim()
                      ? "bi-send-fill text-primary"
                      : "bi-emoji-smile"
                  }`}
                ></i>
              </button>
              <button
                className="btn btn-light d-flex align-items-center"
                onClick={handleQuickReaction} // Left click sends the reaction
                disabled={
                  selectedConversation?.restrictMessagingToAdmin && !isAdmin
                }
                onContextMenu={(e) => {
                  e.preventDefault(); // Prevent default context menu
                  handleOpenReactionModal(); // Show custom modal on right click
                  return false;
                }}
              >
                {defaultReactionEmoji.id === "thumbs-up" ? (
                  <i className="bi bi-hand-thumbs-up-fill text-warning"></i>
                ) : (
                  <span style={{ fontSize: "1.2rem" }}>
                    {defaultReactionEmoji.icon}
                  </span>
                )}
              </button>
              {/* Form Reaction EmojiModal */}
              <ReactionEmojiModal
                show={showReactionModal}
                onClose={handleCloseReactionModal}
                onSelect={handleSelectDefaultEmoji}
                selectedEmoji={defaultReactionEmoji}
              />
            </div>
          </>
        )}
      </div>

      <ForwardMessageModal
        showForwardModal={showForwardModal}
        setShowForwardModal={setShowForwardModal}
        selectedMessage={selectedMessage}
        currentUser={currentUser}
        handleSelectReceiver={handleSelectReceiver}
        selectedReceivers={selectedReceivers}
        setSelectedReceivers={setSelectedReceivers}
      />

      <VideoCallModal
        isOpen={showVideoCallModal}
        onClose={handleCloseVideoCallModal}
        recipientId={userReceiver?.id}
        recipientName={userReceiver?.display_name}
        conversationId={selectedConversation?.id}
        callType="video"
      />
      <IncomingCallModal />
    </div>
  );
};

const App = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [conversationWidth, setConversationWidth] = useState("100%");
  const [showSearchForm, setShowSearchForm] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.common.selectedConversation
  );
  const { refetch: refetchConversation } = useConversation();

  const handleShowDetail = () => {
    setShowDetail(true);
    setConversationWidth("70%");
  };

  const handleHideDetail = () => {
    setShowDetail(false);
    setConversationWidth("100%");
    setShowSearchForm(false);
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div
        style={{
          width: conversationWidth,
          transition: "width 0.3s",
          height: "100vh",
        }}
      >
        <Conservation
          onShowDetail={handleShowDetail}
          onHideDetail={handleHideDetail}
          showDetail={showDetail}
          selectedConversation={selectedConversation}
          client={Client}
          setShowSearchForm={setShowSearchForm}
          refetchConversation={refetchConversation}
        />
      </div>
      {showDetail && (
        <div
          style={{
            width: "30%",
            marginLeft: "10px",
            height: "100vh",
          }}
        >
          <ConversationDetail
            conversationInfor={selectedConversation}
            client={Client} // Pass WebSocket client
            refetchConversation={refetchConversation} // Pass refetch function
            showSearchForm={showSearchForm} // Truyền trạng thái hiển thị SearchForm
            setShowSearchForm={setShowSearchForm}
          />
        </div>
      )}
    </div>
  );
};

export default App;
