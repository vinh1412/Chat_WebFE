import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaThumbtack,
  FaStickyNote,
  FaChartPie,
  FaClipboardList,
  FaTimes,
  FaCog,
} from "react-icons/fa";
import {
  getPinnedMessagesService,
} from "../../../services/MessageService";
import "../../../assets/css/GroupBoard.css";

const tabs = [
  { key: "all", label: "Tất cả", icon: <FaClipboardList /> },
  { key: "pinned", label: "Tin ghim", icon: <FaThumbtack /> },
  { key: "notes", label: "Ghi chú", icon: <FaStickyNote /> },
  { key: "polls", label: "Bình chọn", icon: <FaChartPie /> },
];

// Modal for creating a poll (unchanged)
const PollModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Tạo bình chọn</h5>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <label>Chu đề bình chọn</label>
          <textarea placeholder="Đặt câu hỏi bình chọn" rows="3" />
          <div className="char-count">0/200</div>

          <label>Các lựa chọn</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Lựa chọn ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mb-2"
            />
          ))}
          <button
            className="add-option"
            onClick={handleAddOption}
            disabled={options.length >= 10}
          >
            ＋ Thêm lựa chọn
          </button>
        </div>
        <div className="modal-footer">
          <button className="settings-button">
            <FaCog />
          </button>
          <div>
            <button className="cancel-button" onClick={onClose}>
              Hủy
            </button>
            <button className="create-button">Tạo bình chọn</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal for creating a note (unchanged)
const NoteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Tạo ghi chú</h5>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <label>Nội dung</label>
          <textarea
            placeholder="Nhập nội dung mục học dẫn link"
            rows="5"
            style={{ resize: "none" }}
          />
        </div>
        <div className="modal-footer">
          <div>
            <button className="cancel-button" onClick={onClose}>
              Hủy
            </button>
            <button className="create-button">Tạo ghi chú</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupBoard = ({ conversationId, onBack }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pinned messages when the "Tin ghim" tab is active
  useEffect(() => {
    if (activeTab === "pinned" && conversationId) {
      const fetchPinnedMessages = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getPinnedMessagesService(conversationId);
          if (response.status === "SUCCESS") {
            setPinnedMessages(response.response);
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError(err.message || "Failed to fetch pinned messages");
        } finally {
          setLoading(false);
        }
      };
      fetchPinnedMessages();
    }
  }, [activeTab, conversationId]);

  const renderContent = () => {
    switch (activeTab) {
      case "pinned":
        return (
          <div className="tab-content">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : pinnedMessages.length === 0 ? (
              <div>📌 Không có tin ghim nào</div>
            ) : (
              <div>
                <h6>📌 Danh sách tin ghim</h6>
                <ul>
                  {pinnedMessages.map((message) => (
                    <li key={message.id} className="pinned-message">
                      <strong>{message.senderId}</strong>: {message.content}
                      <small> ({new Date(message.timestamp).toLocaleString()})</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case "notes":
        return (
          <div className="tab-content">
            <button
              className="note-button"
              onClick={() => setIsNoteModalOpen(true)}
            >
              ＋ Tạo ghi chú
            </button>
            <NoteModal
              isOpen={isNoteModalOpen}
              onClose={() => setIsNoteModalOpen(false)}
            />
          </div>
        );
      case "polls":
        return (
          <div className="tab-content">
            <button
              className="poll-button"
              onClick={() => setIsPollModalOpen(true)}
            >
              ＋ Tạo bình chọn
            </button>
            <PollModal
              isOpen={isPollModalOpen}
              onClose={() => setIsPollModalOpen(false)}
            />
          </div>
        );
      default:
        return <div className="tab-content">📋 Tất cả nội dung bảng tin</div>;
    }
  };

  return (
    <div className="group-board-container">
      <div className="board-header">
        <button onClick={onBack} className="icon-button">
          <FaArrowLeft />
        </button>
        <h5 className="board-title">Bảng tin nhóm</h5>
        <button className="icon-button blue">
          <FaPlus />
        </button>
      </div>

      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-body">{renderContent()}</div>
    </div>
  );
};

export default GroupBoard;