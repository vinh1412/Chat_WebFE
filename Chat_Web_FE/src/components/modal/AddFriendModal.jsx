import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Col, Row } from "react-bootstrap";
import { useDashboardContext } from "../../context/Dashboard_context";
import { AiOutlineClose } from "react-icons/ai";
import { searchUser } from "../../services/UserService";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { addToRecentSearches } from "../../redux/slice/searchHistorySlice";

// const data = [
//   {
//     id: "1",
//     name: "Nguyễn Văn A",
//     phoneNumber: "123456789",
//     avatar: "https://i.pravatar.cc/300?img=1",
//   },
//   {
//     id: "2",
//     name: "Trần Văn B",
//     phoneNumber: "123456781",
//     avatar: "https://i.pravatar.cc/300?img=2",
//   },
// ];

const ItemCurrentlyFriend = ({ item, onClick }) => {
  return (
    <Row className="g-0 pt-2" style={{ cursor: "pointer" }} onClick={onClick}>
      <Col xs="auto" className="d-flex align-items-center p-2">
        <div
          className="overflow-hidden"
          style={{ width: "40px", height: "40px" }}
        >
          <img
            src={item.avatar}
            alt=""
            className="rounded-circle img-fluid object-fit-cover"
          />
        </div>
      </Col>

      <Col className="d-flex flex-column justify-content-center p-2">
        <div className="" style={{ fontSize: "1.03rem", fontWeight: "500" }}>
          {item.display_name}
        </div>
        <div className="text-muted" style={{ fontSize: "0.8rem" }}>
          {item.phone}
        </div>
      </Col>
    </Row>
  );
};

const AddFriendModal = () => {
  const {
    addFriendModalRef,
    setShowAddFriendModal,
    setShowAccountInfoSearchModal,
    setSelectedSearchUser,
    currentUser,
    setShowProfileModal,
  } = useDashboardContext();

  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const phoneInputRef = useRef(null);

  const dispatch = useDispatch();
  const recentSearches = useSelector(
    (state) => state.searchHistory.recentSearches
  );

  useEffect(() => {
    if (phoneInputRef.current) {
      const inputEl = phoneInputRef.current.querySelector("input");
      if (inputEl) {
        inputEl.focus();
      }
    }
  }, []);

  // Hàm xử lý khi click vào một kết quả tìm kiếm gần đây
  const handleRecentSearchClick = (item) => {
    setSelectedSearchUser(item);
    setShowAccountInfoSearchModal(true);
    setShowAddFriendModal(false);
  };

  // Hàm xử lý tìm kiếm người bạn bè bằng số điện thoại
  const handleSearch = async () => {
    if (!phone) {
      setNotificationMessage("Vui lòng nhập số điện thoại để tìm kiếm.");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 1000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let phoneNumber = phone;

      if (phone.startsWith("84")) {
        phoneNumber = phoneNumber.substring(2);
      }

      if (!phoneNumber.startsWith("0")) {
        phoneNumber = "0" + phoneNumber;
      }

      // Kiểm tra nếu số điện thoại tìm kiếm là của chính người dùng hiện tại
      const currentUserPhone = currentUser?.phone;

      let formattedSearchPhone = phoneNumber;

      if (formattedSearchPhone.startsWith("0")) {
        formattedSearchPhone = formattedSearchPhone.substring(1);
      }

      formattedSearchPhone = "+84" + formattedSearchPhone;

      // So sánh số điện thoại
      if (
        (currentUserPhone && currentUserPhone === formattedSearchPhone) ||
        (currentUser?.phone && currentUser.phone === phoneNumber)
      ) {
        setShowAddFriendModal(false);
        setShowProfileModal(true);
        setPhone("");
        setIsLoading(false);
        return;
      }

      const result = await searchUser(phoneNumber);

      if (result.response && result.response.length > 0) {
        const user = result.response[0];
        setSelectedSearchUser(user);
        setShowAccountInfoSearchModal(true);
        setShowAddFriendModal(false);
        setPhone("");
        dispatch(addToRecentSearches(user));
      } else {
        setNotificationMessage(
          "Số điện thoại chưa đăng ký tài khoản hoặc không cho phép tìm kiếm."
        );
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 1000);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Đã xảy ra lỗi khi tìm kiếm người dùng.");
      alert("Đã xảy ra lỗi khi tìm kiếm người dùng!");
    }
  };

  return (
    <div ref={addFriendModalRef}>
      <Container
        className="h-100 d-flex flex-column"
        fluid
        style={{
          minHeight: "600px",
          maxHeight: "85vh",
        }}
      >
        <div className="d-flex align-items-center w-100 border-bottom pb-1">
          <span className="fs-5 fw-semibold me-auto">Thêm bạn</span>
          <AiOutlineClose
            role="button"
            className="d-flex align-items-center justify-content-center btn rounded-circle p-1"
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            size={32}
            onClick={() => setShowAddFriendModal(false)}
          />
        </div>

        <div className="mb-3 pt-3" ref={phoneInputRef}>
          <PhoneInput
            disableSearchIcon={true}
            country={"vn"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            enableSearch={true}
            countryCodeEditable={false}
            placeholder="Nhập số điện thoại"
            containerStyle={{
              width: "100%",
            }}
            inputStyle={{
              height: "40px",
              width: "100%",
              border: "1px solid #ced4da",
            }}
            buttonStyle={{
              height: "40px",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              border: "1px solid #ced4da",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            dropdownStyle={{
              maxHeight: "300px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              top: "30px",
              left: "0",
              width: "50vh",
            }}
            searchStyle={{
              color: "#000",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              width: "calc(100% - 16px)",
            }}
          />
        </div>

        {/* Hiển thị kết quả tìm kiếm gần đây */}
        {recentSearches.length > 0 && (
          <div>
            <span className="fs-6 text-muted fw-normal">Kết quả gần đây</span>
            {recentSearches.map((item) => (
              <ItemCurrentlyFriend
                key={item.id}
                item={item}
                onClick={() => handleRecentSearchClick(item)}
              />
            ))}
          </div>
        )}

        {/* button */}
        <div className="d-flex align-items-center py-3 px-4 border-top mt-auto">
          <div className="d-flex align-items-center ms-auto gap-3">
            <button
              className="btn btn-light px-4 py-2"
              onClick={() => setShowAddFriendModal(false)}
            >
              Hủy
            </button>
            <button
              className="btn btn-primary px-3 py-2 text-white"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>

        {error && <div className="text-danger mt-2">{error}</div>}

        {showNotification && (
          <div
            className="position-absolute p-3 text-white"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              borderRadius: "5px",
              animation: "fadeIn 0.3s",
              zIndex: 1050,
              textAlign: "center",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "400px",
            }}
          >
            {notificationMessage}
          </div>
        )}
      </Container>
    </div>
  );
};

export default AddFriendModal;
