import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import axios from "axios";

const StickerPicker = ({ onStickerSelect }) => {
    const [activeTab, setActiveTab] = useState("Sticker");
    const [searchTerm, setSearchTerm] = useState("");
    const [gifs, setGifs] = useState([]);

    // Danh sách sticker (thay bằng URL thực tế từ CDN hoặc local assets)
    const stickerList = [
        {
            id: 1,
            url: "https://via.placeholder.com/100?text=Cat1",
            category: "Mèo",
        },
        {
            id: 2,
            url: "https://via.placeholder.com/100?text=Cat2",
            category: "Mèo",
        },
        {
            id: 3,
            url: "https://via.placeholder.com/100?text=Birthday1",
            category: "Sinh nhật",
        },
        {
            id: 4,
            url: "https://via.placeholder.com/100?text=Birthday2",
            category: "Sinh nhật",
        },
        {
            id: 5,
            url: "https://via.placeholder.com/100?text=Expression1",
            category: "Biểu cảm",
        },
        {
            id: 6,
            url: "https://via.placeholder.com/100?text=Expression2",
            category: "Biểu cảm",
        },
    ];

    // Lấy GIF từ GIPHY API
    useEffect(() => {
        const fetchGifs = async () => {
            try {
                const response = await axios.get(
                    `https://api.giphy.com/v1/gifs/search`,
                    {
                        params: {
                            q: searchTerm || "funny",
                            api_key: import.meta.env.VITE_GIPHY_API_KEY,
                            limit: 20,
                        },
                    }
                );
                setGifs(response.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy GIF:", err);
                setGifs([]);
            }
        };
        if (activeTab === "GIF" && import.meta.env.VITE_GIPHY_API_KEY) {
            fetchGifs();
        }
    }, [searchTerm, activeTab]);
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "10px",
                width: "350px",
                maxHeight: "400px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                color: "#000",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    borderBottom: "1px solid #ddd",
                    background: "#f9f9f9",
                }}
            >
                {["Sticker", "Emoji", "GIF"].map((tab) => (
                    <button
                        key={tab}
                        style={{
                            flex: 1,
                            padding: "10px",
                            background:
                                activeTab === tab ? "#e0e0e0" : "transparent",
                            border: "none",
                            color: activeTab === tab ? "#007bff" : "#000",
                            fontWeight: activeTab === tab ? "bold" : "normal",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            fontSize: "14px",
                        }}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Thanh tìm kiếm */}
            {activeTab !== "Emoji" && (
                <div style={{ padding: "10px" }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sticker"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            background: "#f9f9f9",
                            color: "#000",
                            fontSize: "14px",
                        }}
                    />
                </div>
            )}

            {/* Nội dung theo tab */}
            <div
                style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "10px",
                }}
            >
                {activeTab === "Sticker" && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "10px",
                        }}
                    ></div>
                )}

                {activeTab === "Emoji" && (
                    <div>
                        <Picker
                            onEmojiClick={(emojiObject) =>
                                onStickerSelect(emojiObject.emoji)
                            }
                            width="100%"
                            height="300px"
                            theme="light"
                            searchPlaceholder="Tìm kiếm emoji"
                        />
                    </div>
                )}

                {activeTab === "GIF" && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "10px",
                        }}
                    >
                        {gifs.length > 0 ? (
                            gifs.map((gif) => (
                                <img
                                    key={gif.id}
                                    src={gif.images.fixed_height.url}
                                    alt={gif.title}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                    }}
                                    onClick={() =>
                                        onStickerSelect(
                                            gif.images.fixed_height.url
                                        )
                                    }
                                />
                            ))
                        ) : (
                            <p style={{ color: "#aaa", textAlign: "center" }}>
                                Không tìm thấy GIF
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Danh sách bộ sticker */}
            <div
                style={{
                    display: "flex",
                    gap: "5px",
                    padding: "10px",
                    borderTop: "1px solid #ddd",
                    overflowX: "auto",
                }}
            >
                {["Mèo", "Sinh nhật", "Biểu cảm", "Hoạt hình"].map(
                    (category) => (
                        <button
                            key={category}
                            style={{
                                background: "#f9f9f9",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                color: "#000",
                                cursor: "pointer",
                                fontSize: "12px",
                            }}
                            onClick={() => setSearchTerm(category)}
                        >
                            {category}
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default StickerPicker;
