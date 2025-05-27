import React from "react";

import { Container, Col, Row, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

import { useDispatch } from "react-redux";
import {
  setShowSearch,
  setShowConversation,
  setSelectedConversation,
} from "../../redux/slice/commonSlice";
import { searchUser } from "../../services/UserService";
import { checkFriend } from "../../services/FriendService";
import useFriend from "../../hooks/useFriend";
import handleClick from "../../modules/chat/conservation/ItemConservation";
import { useDashboardContext } from "../../context/Dashboard_context";
import useConversation from "../../hooks/useConversation";

import { getAccessToken } from "../../services/AuthService";

const ItemSerch = ({ item }) => {
  // console.log("ItemSerch", item);
  const dispatch = useDispatch();
  const [isFriend, setIsFriend] = React.useState(false);
  const [isSentSuccess, setIsSentSuccess] = React.useState(false);
  const [isReceived, setIsReceived] = React.useState(false);
  const { sendRequest, sentRequests, receivedRequests } = useFriend();
  const { currentUser } = useDashboardContext();
  const { findOrCreateConversation } = useConversation();

  const sentReqs = React.useMemo(() => {
    if (!Array.isArray(sentRequests?.response)) return [];
    return sentRequests?.response || []; // Use the response from the sentRequests or an empty array if loading
  }, [sentRequests]);

  const reciveReqs = React.useMemo(() => {
    if (!Array.isArray(receivedRequests?.response)) return [];
    return receivedRequests?.response || []; // Use the response from the sentRequests or an empty array if loading
  }, [receivedRequests]);

  // Kiểm tra xem người dùng đã là bạn bè hay chưa
  React.useEffect(() => {
    const checkFriendStatus = async () => {
      try {
        const response = await checkFriend(item.id);
        setIsFriend(response);
      } catch (error) {
        console.error("Error checking friend status:", error);
      }

      const isSent = sentReqs.find((req) => req?.userId === item?.id);
      const isReceived = reciveReqs.find((req) => req?.userId === item?.id);

      if (isSent) {
        setIsSentSuccess(true);
      }
      if (isReceived) {
        setIsReceived(true);
      }
    };
    checkFriendStatus();
  }, [item.id, sentReqs, reciveReqs]);

  const handleClick = () => {
    // console.log("Item clicked:---------------", item);
    const senderId = currentUser._id || currentUser.id; // hoặc tùy theo cấu trúc user của bạn
    const receiverId = item._id || item.id;
    // console.log("Sender ID:", senderId);
    // console.log("Receiver ID:", receiverId);

    findOrCreateConversation(
      { senderId, receiverId },
      {
        onSuccess: (conversation) => {
          // Đã có hội thoại hoặc tạo mới thành công
          dispatch(setSelectedConversation(conversation));
          dispatch(setShowConversation(true));
        },
        onError: (err) => {
          console.error("Lỗi khi tìm/tao cuộc hội thoại:", err.message);
        },
      }
    );
  };

  return (
    <div
      key={item.id}
      className="overflow-hidden d-flex align-items-center justify-content-between gap-2 mb-2 mt-2"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex align-items-center gap-2">
        <img
          src={item.avatar}
          alt=""
          className="rounded-circle img-fluid object-fit-cover"
          style={{ width: "48px", height: "48px" }}
        />
        <span className="ms-2">{item.display_name}</span>
      </div>
      {/* Kiem tra xem co phai ban khong */}
      {!isFriend ? (
        // Nếu chưa là bạn bè thì hiển thị nút gửi lời mời kết bạn
        isSentSuccess ? (
          <button
            className="rounded-2 btn btn-outline-secondary border"
            style={{ fontSize: "12px", padding: "4px 8px" }}
            disabled
          >
            Đã gửi lời mời
          </button>
        ) : isReceived ? (
          <button
            className="rounded-2 btn btn-outline-secondary border"
            style={{ fontSize: "12px", padding: "4px 8px" }}
            disabled
          >
            Phản hồi
          </button>
        ) : (
          <button
            className="rounded-2 btn btn-outline-secondary border"
            style={{ fontSize: "12px", padding: "4px 8px" }}
            onClick={() => {
              sendRequest(item.id);
            }}
          >
            Kết bạn
          </button>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
};

const SearchSide = () => {
  const dispatch = useDispatch();

  const searchInputFocusRef = React.useRef(null);

  const [keyword, setKeyword] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const { currentUser } = useDashboardContext();

  // tự động focus vào ô tìm kiếm khi mở search
  React.useEffect(() => {
    searchInputFocusRef.current?.focus();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = async (keyword) => {
    // Gọi API tìm kiếm người dùng
    try {
      const response = await searchUser(keyword);
      if (response.status === "SUCCESS") {
        if (response.response.length === 0) {
          setSearchResults([]);
        } else {
          setSearchResults(response.response);
        }
      }
      console.log("Kết quả tìm kiếm:", response.response);
      console.log("Kết quả tìm kiếm:", response);
    } catch (error) {
      console.error("Lỗi khi gọi API tìm kiếm:", error);
    }
  };

  React.useEffect(() => {
    if (keyword) {
      handleSearch(keyword);
    }
  }, [keyword]);
  return (
    <>
      <Container
        fluid
        className="d-flex align-items-center justify-content-between p-3 w-100"
      >
        <Row className="g-0 rounded-2" style={{ backgroundColor: "#E5E7EB" }}>
          <Col xs="auto" className="d-flex align-items-center ps-2">
            <BsSearch />
          </Col>
          <Col className="flex-grow-1">
            <input
              type="text"
              className="form-control bg-transparent border-0 rounded-1"
              placeholder="Tìm kiếm"
              ref={searchInputFocusRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="d-flex align-items-center">
          <Col
            xs="auto"
            onClick={() => {
              dispatch(setShowSearch(false));
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="">Đóng</span>
          </Col>
        </Row>
      </Container>

      <Container
        fluid
        className="w-100 overflow-auto "
        style={{ maxHeight: "calc(100vh - 56px)" }}
      >
        {!keyword && (
          <>
            <h6 className="mt-1">Tìm kiếm gần đây</h6>
            {/* List tìm kiếm gần đây */}
            <div className="d-flex flex-column gap-2 mt-2">
              {/* {searchData.map((item) => (
                            <ItemSerch key={item.id} item={item} />
                        ))} */}
            </div>
          </>
        )}

        {keyword && (
          <>
            <h6 className="mt-1">Kết quả tìm kiếm cho "{keyword}"</h6>
            {/* List tìm kiếm gần đây */}
            <div className="d-flex flex-column gap-2 mt-2">
              {searchResults
                .filter((item) => item.id !== currentUser.id)
                .map((item) => (
                  // Gọi component ItemSerch và truyền props vào
                  <ItemSerch key={item.id} item={item} onClick={handleClick} />
                ))}

              {searchResults.length === 0 && (
                <div className="text-center mt-2">
                  Không tìm thấy kết quả nào
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchSide;
