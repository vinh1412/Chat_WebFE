import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConservationDetail from "./ConservationDetail";
import "../../../assets/css/ConservationStyle.css";

const Conservation = ({ onShowDetail, onHideDetail, showDetail }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Hàm gửi tin nhắn
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg = {
            id: Date.now(),
            text: newMessage,
            timestamp: new Date(),
            sender: "me",
        };

        setMessages((prev) => [...prev, newMsg]);
        setNewMessage("");
    };

    // Hàm gửi hình ảnh
    const handleSendImage = (file) => {
        const newMsg = {
            id: Date.now(),
            type: "image",
            content: URL.createObjectURL(file),
            sender: "me",
            timestamp: new Date(),
            fileName: file.name,
        };
        setMessages((prev) => [...prev, newMsg]);
    };

    // Hàm gửi tệp đính kèm
    const handleSendFile = (file) => {
        const newMsg = {
            id: Date.now(),
            type: "file",
            content: URL.createObjectURL(file),
            sender: "me",
            timestamp: new Date(),
            fileName: file.name,
        };
        setMessages((prev) => [...prev, newMsg]);
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
                    <img
                        src="../../../../public/images/avatar/avtdefault.jpg"
                        alt="avatar"
                        width={50}
                        height={50}
                        className="rounded-circle me-3"
                    />
                    <div className="flex-grow-1">
                        <h6 className="mb-0">Dương Dz</h6>
                        <small className="text-muted">
                            Người lạ · Không có nhóm chung
                        </small>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm">
                        <i className="bi bi-search"></i>
                    </button>
                    <button
                        className="btn btn-sm"
                        onClick={showDetail ? onHideDetail : onShowDetail}
                    >
                        <i
                            className={`bi ${
                                showDetail
                                    ? "bi bi-arrow-bar-right"
                                    : "bi bi-arrow-bar-left"
                            } me-2`}
                        ></i>
                    </button>
                </div>
            </div>

            {/* Notification */}
            <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                    <i className="bi bi-person-plus-fill mx-2"></i>
                    <span>Gửi yêu cầu kết bạn tới người này</span>
                </div>
                <button className="btn btn-outline-secondary btn-sm">
                    Gửi kết bạn
                </button>
            </div>

            {/* Chat Messages */}
            <div
                className="card-body bg-light"
                style={{
                    height: "calc(100vh - 230px)",
                    overflowY: "auto",
                    padding: "10px",
                }}
            >
                {messages.length === 0 ? (
                    <p className="text-muted">Chưa có tin nhắn...</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`mb-2 d-flex ${
                                msg.sender === "me"
                                    ? "justify-content-end"
                                    : "justify-content-start"
                            }`}
                        >
                            <div
                                className={`p-2 rounded bg-text shadow-sm ${
                                    msg.sender === "me"
                                        ? " text-black"
                                        : "bg-light border"
                                }`}
                                style={{ maxWidth: "70%" }}
                            >
                                {msg.type === "image" ? (
                                    <img
                                        src={msg.content}
                                        alt="Hình ảnh"
                                        className="img-fluid rounded"
                                        style={{ maxWidth: "100%" }}
                                    />
                                ) : msg.type === "file" ? (
                                    <a
                                        href={msg.content}
                                        download={msg.fileName}
                                        className="text-decoration-none text-black"
                                    >
                                        📎 {msg.fileName}
                                    </a>
                                ) : (
                                    <span>{msg.text}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Section */}
            <div className="card-footer">
                {/* Icons Above Input */}
                <div className="d-flex align-items-center gap-2 mb-2">
                    <button className="btn btn-light">
                        <i className="bi bi-emoji-smile"></i>
                    </button>
                    <label
                        className="btn btn-light mb-0"
                        htmlFor="image-upload"
                    >
                        <i className="bi bi-image"></i>
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleSendImage(file);
                        }}
                    />
                    <label className="btn btn-light mb-0" htmlFor="file-upload">
                        <i className="bi bi-paperclip"></i>
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleSendFile(file);
                        }}
                    />
                    <button className="btn btn-light">
                        <i className="bi bi-hash"></i>
                    </button>
                    <button
                        className="btn btn-light"
                        onClick={() =>
                            alert("Tính năng ghi âm đang được phát triển...")
                        }
                    >
                        <i className="bi bi-mic"></i>
                    </button>
                    <button className="btn btn-light">
                        <i className="bi bi-lightning"></i>
                    </button>
                    <button className="btn btn-light">
                        <i className="bi bi-three-dots"></i>
                    </button>
                </div>

                {/* Input + Gửi */}
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
                    />

                    <button
                        className="btn btn-light d-flex align-items-center"
                        onClick={handleSendMessage}
                    >
                        <i
                            className={`bi ${
                                newMessage.trim()
                                    ? "bi-send-fill text-primary"
                                    : "bi-emoji-smile"
                            }`}
                        ></i>
                    </button>
                    <button className="btn btn-light d-flex align-items-center">
                        <i className="bi bi-hand-thumbs-up"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [showDetail, setShowDetail] = useState(false);
    const [conversationWidth, setConversationWidth] = useState("100%");

    const handleShowDetail = () => {
        setShowDetail(true);
        setConversationWidth("70%");
    };

    const handleHideDetail = () => {
        setShowDetail(false);
        setConversationWidth("100%");
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
                    <ConservationDetail />
                </div>
            )}
        </div>
    );
};

export default App;
