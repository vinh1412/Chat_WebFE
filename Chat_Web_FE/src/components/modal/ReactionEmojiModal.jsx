import React, { useState, useEffect } from "react";

const ReactionEmojiModal = ({ show, onClose, onSelect, selectedEmoji }) => {
    const [localSelectedEmoji, setLocalSelectedEmoji] = useState(
        selectedEmoji || { id: "thumbs-up", icon: "👍" }
    );

    // Emojis shown in the screenshot
    const emojis = [
        { id: "thumbs-up", icon: "👍" },
        { id: "laugh", icon: "😂" },
        { id: "wow", icon: "😮" },
        { id: "sad", icon: "😢" },
        { id: "heart", icon: "❤️" },
        { id: "angry", icon: "😡" },
    ];

    useEffect(() => {
        if (show && selectedEmoji) {
            setLocalSelectedEmoji(selectedEmoji);
        }
    }, [show, selectedEmoji]);

    if (!show) return null;

    return (
        <div
            className="modal-backdrop"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1050,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="modal-content"
                style={{
                    width: "400px",
                    backgroundColor: "#1e1e1e",
                    borderRadius: "8px",
                    color: "white",
                    overflow: "hidden",
                }}
            >
                <div className="modal-header d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
                    <h5 className="modal-title">Cập nhật biểu tượng cảm xúc</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                    ></button>
                </div>

                <div className="modal-body p-3">
                    <p>Chọn emoji mặc định cho hội thoại này</p>

                    <div className="d-flex justify-content-around my-4">
                        {emojis.map((emoji) => (
                            <div key={emoji.id} className="text-center">
                                <div
                                    className="mb-2"
                                    style={{
                                        fontSize: "2rem",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setLocalSelectedEmoji(emoji)}
                                >
                                    {emoji.icon}
                                </div>
                                <div className="form-check d-flex justify-content-center">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="reactionEmoji"
                                        checked={
                                            localSelectedEmoji.id === emoji.id
                                        }
                                        onChange={() =>
                                            setLocalSelectedEmoji(emoji)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer d-flex justify-content-between p-2 border-top border-secondary">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => onSelect(localSelectedEmoji)}
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReactionEmojiModal;
