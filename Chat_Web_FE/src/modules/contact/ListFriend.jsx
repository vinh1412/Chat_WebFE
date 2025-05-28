import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FaSearch,
  FaSortAlphaDown,
  FaFilter,
  FaCheck,
  FaUserFriends,
} from "react-icons/fa";
import { AiOutlineEllipsis } from "react-icons/ai";
import "../../assets/css/ListFriend.css";
import useFriend from "../../hooks/useFriend";
import Loading from "../../components/common/Loading";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useDashboardContext } from "../../context/Dashboard_context";
import { useDispatch } from "react-redux";
import {
  setSelectedConversation,
  setShowConversation,
} from "../../redux/slice/commonSlice";
import { setCurrentTab } from "../../redux/slice/chatSlice";

import Swal from "sweetalert2";
import ActionFriendDropdown from "../../components/modal/ActionFriendDropdown";
import useConversation from "../../hooks/useConversation";
const ListFriend = () => {
  const { currentUser } = useDashboardContext();
  const { friendList, isLoadingFriends, unfriend } = useFriend();
  const [loading, setLoading] = useState(false);
  const { findOrCreateConversation } = useConversation();
  const dispatch = useDispatch();

  const friends = useMemo(() => {
    if (isLoadingFriends) return [];
    return friendList?.response || [];
  }, [isLoadingFriends, friendList]);

  //   console.log("Friends:", friends);

  const [dropdownState, setDropdownState] = useState({});
  //   const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // To handle dropdown for each friend
  const dropdownRef = useRef(null);

  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSubOpen, setFilterSubOpen] = useState(false); // To handle subcategory dropdown
  const [sortBy, setSortBy] = useState("Tên (A-Z)");
  const [filterBy, setFilterBy] = useState("Tất cả");

  const filteredFriends = friends
    .filter(
      (friend) =>
        friend?.displayName?.toLowerCase().includes(search?.toLowerCase()) &&
        (filterBy === "Tất cả" || friend?.category === filterBy)
    )
    .sort((a, b) => {
      if (sortBy === "Tên (A-Z)") {
        return a?.displayName.localeCompare(b?.displayName);
      } else if (sortBy === "Tên (Z-A)") {
        return b?.displayName.localeCompare(a?.displayName);
      }
      return 0;
    });

  const handleSortSelect = (option) => {
    setSortBy(option);
    setSortOpen(false);
  };

  const handleFilterSelect = (option) => {
    setFilterBy(option);
    setFilterOpen(false);
    setFilterSubOpen(false); // Close subcategory dropdown
  };

  const handleCategorySelect = (category) => {
    setFilterBy(category);
    setFilterSubOpen(false);
    setFilterOpen(false);
  };

  const toggleDropdown = (friendId) => {
    setActiveDropdown(activeDropdown === friendId ? null : friendId);
    setDropdownState((prev) => ({
      ...prev,
      [friendId]: !prev[friendId],
    }));
  };

  const handleFriendClick = (friend) => {
    if (!friend || !currentUser) return;

    const senderId = currentUser.id;
    const receiverId = friend.userId;

    findOrCreateConversation(
      { senderId, receiverId },
      {
        onSuccess: (conversation) => {
          dispatch(setSelectedConversation(conversation));
          dispatch(setShowConversation(true));
          dispatch(setCurrentTab("Chat"));
        },
        onError: (err) => {
          console.error("Lỗi khi tìm/tạo cuộc hội thoại:", err.message);
        },
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".options")
      ) {
        // Khi click ra ngoài, cập nhật cả activeDropdown và dropdownState
        setActiveDropdown(null);
        setDropdownState((prev) => ({
          ...prev,
          [activeDropdown]: false,
        }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Xử lý nhấp chuột ra bên ngoài để đóng menu thả xuống
  // useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //         setShowDropdown(false);
  //         console.log("Clicked outside the dropdown");
  //       }
  //     };

  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  // }, []);

  //socket
  // const client = useRef(null);
  //     useEffect(() => {
  //         // Khởi tạo tạo kết nối WebSocket
  //         const socket = new SockJS("http://localhost:8080/ws"); // Thay thế bằng URL WebSocket của bạn
  //         // Tạo một instance của Client từ @stomp/stompjs, để giao tiếp với server qua WebSocket.
  //         client.current = new Client({
  //           webSocketFactory: () => socket, // Sử dụng SockJS để tạo kết nối WebSocket
  //           reconnectDelay: 5000, // Thời gian chờ để kết nối lại sau khi mất kết nối
  //           debug: (str) => {
  //             console.log(str);
  //           },
  //           onConnect: () => {
  //             // Hàm được gọi khi kết nối thành công
  //             console.log("Connected to WebSocket");
  //             client.current.subscribe(
  //                 `/friend/accept/${currentUser?.id}`,
  //                 (message) => {
  //                     if (message.body) {
  //                         const data = JSON.parse(message.body);
  //                         console.log("Nhận được tin nhắn từ WebSocket:", data);

  //                         // Cập nhật danh sách bạn bè trong cache
  //                         queryClient.setQueryData(['friendList'], (oldData) => {
  //                             if(!oldData.response) return oldData;

  //                             // Kiểm tra xem người dùng đã có trong danh sách bạn bè chưa
  //                             const existingFriend = oldData.response.find(friend => friend.userId === data.userId);
  //                             if(existingFriend) {
  //                                 return oldData;
  //                             }

  //                             return {...oldData, response: [...oldData.response, data] };
  //                         });

  //                         // You can also display some notification if needed
  //                         console.log("Friend request accepted:", data);
  //                     }
  //                 }
  //             );
  //           },
  //           onStompError: (frame) => {
  //             // Hàm được gọi khi có lỗi trong giao thức STOMP
  //             console.error("Broker reported error: " + frame.headers["message"]);
  //             console.error("Additional details: " + frame.body);
  //           },
  //         });

  //         client.current.activate(); // Kích hoạt kết nối WebSocket, bắt đầu quá trình kết nối tới server.

  //         return () => {
  //           if (client.current && client.current.connected) {
  //             client.current.deactivate(); // Ngắt kết nối WebSocket nếu client đang ở trạng thái kết nối.
  //           }
  //         };
  //     }, [client, currentUser?.id, queryClient]);

  return (
    <div className="group-list-wrapper">
      <div className="ListFriend__header">
        <FaUserFriends />
        <span>Danh sách bạn bè</span>
      </div>
      <div className="friend-header">
        <h3>Bạn bè ({filteredFriends.length})</h3>
        <div className="friend-controls">
          <div className="search-box">
            <FaSearch className="icon" />
            <input
              type="text"
              placeholder="Tìm bạn"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            className="dropdown-container"
            onMouseLeave={() => setSortOpen(false)}
          >
            <div className="sort-box" onClick={() => setSortOpen(!sortOpen)}>
              <FaSortAlphaDown />
              <span>{sortBy}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {sortOpen && (
              <div className="dropdown">
                <div
                  className={`dropdown-item ${
                    sortBy === "Tên (A-Z)" ? "selected" : ""
                  }`}
                  onClick={() => handleSortSelect("Tên (A-Z)")}
                >
                  {sortBy === "Tên (A-Z)" && <FaCheck className="mr-2" />}
                  <span>Tên (A-Z)</span>
                </div>
                <div
                  className={`dropdown-item ${
                    sortBy === "Tên (Z-A)" ? "selected" : ""
                  }`}
                  onClick={() => handleSortSelect("Tên (Z-A)")}
                >
                  {sortBy === "Tên (Z-A)" && <FaCheck className="mr-2" />}
                  <span>Tên (Z-A)</span>
                </div>
              </div>
            )}
          </div>

          <div
            className="dropdown-container"
            onMouseLeave={() => setFilterOpen(false)}
          >
            <div
              className="filter-box"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FaFilter />
              <span>{filterBy}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {filterOpen && (
              <div className="dropdown">
                <div
                  className={`dropdown-item ${
                    filterBy === "Tất cả" ? "selected" : ""
                  }`}
                  onClick={() => handleFilterSelect("Tất cả")}
                >
                  {filterBy === "Tất cả" && <FaCheck className="mr-2" />}
                  <span>Tất cả</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setFilterSubOpen(!filterSubOpen)}
                >
                  <span>Phân loại</span>
                </div>
                {filterSubOpen && (
                  <div className="dropdown-submenu">
                    <div
                      className={`dropdown-item ${
                        filterBy === "Công việc" ? "selected" : ""
                      }`}
                      onClick={() => handleCategorySelect("Công việc")}
                    >
                      {filterBy === "Công việc" && <FaCheck className="mr-2" />}
                      <span>Công việc</span>
                    </div>
                    <div
                      className={`dropdown-item ${
                        filterBy === "Cá nhân" ? "selected" : ""
                      }`}
                      onClick={() => handleCategorySelect("Cá nhân")}
                    >
                      {filterBy === "Cá nhân" && <FaCheck className="mr-2" />}
                      <span>Cá nhân</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="friend-list">
        <div className="alphabet-header">A</div>
        {filteredFriends.map((friend) => {
          return (
            <div
              className="friend-item"
              key={friend?.userId}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                onClick={(e) => {
                  if (!e.target.closest(".options")) {
                    handleFriendClick(friend);
                  }
                }}
                style={{ display: "flex", alignItems: "center", flex: "1" }}
              >
                <img
                  src={friend?.avatar}
                  alt={friend?.displayName}
                  className="avatar"
                />
                <span className="name">{friend?.displayName}</span>
              </div>
              <div style={{ position: "relative" }}>
                <div
                  className="options"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(friend.userId);
                  }}
                >
                  <AiOutlineEllipsis size={30} />
                </div>
                <div className="" style={{ position: "relative" }}>
                  {dropdownState[friend.userId] && (
                    <div ref={dropdownRef} className="actions-dropdown">
                      <ActionFriendDropdown
                        friend={friend}
                        setShowDropdown={() => {
                          setDropdownState((prev) => ({
                            ...prev,
                            [friend.userId]: false,
                          }));
                          setActiveDropdown(null);
                        }}
                        showDropdown={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Loading loading={isLoadingFriends} />{" "}
      {/* Loading component to show loading state */}
    </div>
  );
};

export default ListFriend;
