import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import axios from "axios";

const StickerPicker = ({ onStickerSelect }) => {
    const [activeTab, setActiveTab] = useState("Sticker");
    const [searchTerm, setSearchTerm] = useState("");
    const [gifs, setGifs] = useState([]);
    const [stickers, setStickers] = useState([]);

    // Lấy Sticker từ GIPHY API
    useEffect(() => {
        const fetchStickers = async () => {
            try {
                const response = await axios.get(
                    `https://api.giphy.com/v1/stickers/search`,
                    {
                        params: {
                            q: searchTerm || "funny", // Uncommented search term
                            api_key: import.meta.env.VITE_GIPHY_API_KEY,
                            limit: 20,
                        },
                    }
                );
                setStickers(response.data.data);
            } catch (err) {
                console.error("Lỗi khi lấy sticker:", err);
                setStickers([]);
            }
        };
        if (activeTab === "Sticker" && import.meta.env.VITE_GIPHY_API_KEY) {
            // Fixed case
            fetchStickers();
        }
    }, [searchTerm, activeTab]);

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
                        placeholder={`Tìm kiếm ${activeTab.toLowerCase()}`}
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

                {activeTab === "Sticker" && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "10px",
                        }}
                    >
                        {stickers.length > 0 ? (
                            stickers.map((sticker) => (
                                <img
                                    key={sticker.id}
                                    src={sticker.images.fixed_height.url}
                                    alt={sticker.title}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                    }}
                                    onClick={() =>
                                        onStickerSelect(
                                            sticker.images.fixed_height.url
                                        )
                                    }
                                />
                            ))
                        ) : (
                            <p style={{ color: "#aaa", textAlign: "center" }}>
                                Không tìm thấy sticker
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StickerPicker;
