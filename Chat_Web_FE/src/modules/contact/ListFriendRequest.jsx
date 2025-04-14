import React from "react";
import "../../assets/css/ListFriendRequest.css";

const FriendRequests = () => {
  const receivedRequests = [
    {
      name: "Dương Nguyễn",
      time: "42 phút - Từ cửa sổ trò chuyện",
      message: "Xin chào, mình là Dương Nguyễn. Kết bạn với mình nhé!",
      avatar: "https://i.pravatar.cc/300?img=1",
    },
    {
      name: "Ngọc Trân",
      time: "1 giờ - Từ cửa sổ trò chuyện",
      message: "Chào bạn, mình là Trân. Kết nối nhé!",
      avatar: "https://i.pravatar.cc/300?img=2",
    },
    {
      name: "Minh Thư",
      time: "2 giờ - Từ cửa sổ trò chuyện",
      message: "Mình muốn làm quen với bạn!",
      avatar: "https://i.pravatar.cc/300?img=3",
    },
  ];

  const sentRequests = [
    { name: "Sharecode",       avatar: "https://i.pravatar.cc/300?img=4"    },
    { name: "Linh",       avatar: "https://i.pravatar.cc/300?img=6"    },
    { name: "Nguyễn Duy Minh", avatar: "https://i.pravatar.cc/300?img=16"  },
  ];

  return (
    <div className="request-container">
      <h2 className="title">Lời mời kết bạn</h2>

      {/* --- Lời mời đã nhận --- */}
      <div className="section">
        <h4 className="section-title">
          Lời mời đã nhận ({receivedRequests.length})
        </h4>
        <div className="request">
          {receivedRequests.map((user, index) => (
            <div className="request-card" key={index}>
              <img src={user.avatar} alt="Avatar" className="avatar" />
              <div className="card-info">
                <div className="name-row">
                  <span className="name">{user.name}</span>
                  <div className="chat-icon" title="Nhắn tin">
                    💬
                  </div>
                </div>
                <span className="time">{user.time}</span>
                <div className="message-box">{user.message}</div>
                <div className="action-buttons">
                  <button className="btn btn-decline">Từ chối</button>
                  <button className="btn btn-accept">Đồng ý</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Lời mời đã gửi --- */}
      <div className="section">
        <h4 className="section-title">Lời mời đã gửi ({sentRequests.length})</h4>
        <div className="sent-list">
          {sentRequests.map((user, index) => (
            <div className="sent-card" key={index}>
              <div className="sent-left">
                <img src={user.avatar} alt="Avatar" className="avatar" />
                <div className="sent-info">
                  <div className="name-row">
                    <span className="name">{user.name}</span>
                    <div className="chat-icon" title="Nhắn tin">
                      💬
                    </div>
                  </div>
                  <span className="time">Bạn đã gửi lời mời</span>
                  <button className="btn btn-cancel">Thu hồi lời mời</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;
