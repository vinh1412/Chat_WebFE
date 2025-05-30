import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { searchMessages } from "../../../services/MessageService";
import { setSearchResults } from "../../../redux/slice/commonSlice";
import { toast } from "react-toastify";
import "../../../assets/css/SearchForm.css";

const SearchForm = ({ conversationId }) => {
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [senderFilter, setSenderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { currentUser, members } = useSelector((state) => state.common);

  // Real-time search with debounce
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchKeyword.trim() && !senderFilter && !dateFilter) {
        dispatch(setSearchResults([]));
        return;
      }
      try {
        const results = await searchMessages({
          conversationId,
          keyword: searchKeyword,
          senderId: senderFilter,
          date: dateFilter,
        });
        dispatch(setSearchResults(results));
      } catch (error) {
        console.error("Error searching messages:", error);
        // toast.error("Lỗi khi tìm kiếm: " + error.message);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchKeyword, senderFilter, dateFilter, conversationId, dispatch]);

  const senderOptions =
    members
      ?.filter((member) => member.id !== currentUser?.id)
      .map((member) => ({
        value: member.id,
        label: member.display_name,
      })) || [];

  return (
    <div className="search-form-container p-3 rounded shadow-sm bg-light">
      <Form className="mb-4">
        <Row className="align-items-end g-2">
          <Col xs={12} md={10}>
            <Form.Group
              controlId="searchKeyword"
              style={{ position: "relative" }}
            >
              <Form.Label className="fw-medium">Từ khóa tìm kiếm</Form.Label>
              <Form.Control
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nhập từ khóa..."
                className="custom-input"
                autoComplete="off"
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="clear-keyword-btn"
                  onClick={() => setSearchKeyword("")}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 45,
                    background: "none",
                    border: "none",
                    color: "#888",
                    fontSize: 15,
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  tabIndex={-1}
                  aria-label="Xóa từ khóa"
                >
                  xóa
                </button>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="align-items-end g-2">
          <Col xs={12} md={6}>
            <Form.Group controlId="senderFilter">
              <Form.Label className="fw-medium">Người gửi</Form.Label>
              <Form.Select
                value={senderFilter}
                onChange={(e) => setSenderFilter(e.target.value)}
                className="custom-select"
              >
                <option value="">Tất cả</option>
                {senderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="dateFilter">
              <Form.Label className="fw-medium">Ngày gửi</Form.Label>
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="custom-input"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
