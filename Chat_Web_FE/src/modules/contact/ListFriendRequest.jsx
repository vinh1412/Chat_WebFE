import React, {useMemo} from "react";
import "../../assets/css/ListFriendRequest.css";
import useFriend from "../../hooks/useFriend";
import Loading from "../../components/common/Loading";

const FriendRequests = () => {
  // const receivedRequests = [
  //   {
  //     name: "Dương Nguyễn",
  //     time: "42 phút - Từ cửa sổ trò chuyện",
  //     message: "Xin chào, mình là Dương Nguyễn. Kết bạn với mình nhé!",
  //     avatar: "https://i.pravatar.cc/300?img=1",
  //   },
  //   {
  //     name: "Ngọc Trân",
  //     time: "1 giờ - Từ cửa sổ trò chuyện",
  //     message: "Chào bạn, mình là Trân. Kết nối nhé!",
  //     avatar: "https://i.pravatar.cc/300?img=2",
  //   },
  //   {
  //     name: "Minh Thư",
  //     time: "2 giờ - Từ cửa sổ trò chuyện",
  //     message: "Mình muốn làm quen với bạn!",
  //     avatar: "https://i.pravatar.cc/300?img=3",
  //   },
  // ];

  // const sentRequests = [
  //   { name: "Sharecode",       avatar: "https://i.pravatar.cc/300?img=4"    },
  //   { name: "Linh",       avatar: "https://i.pravatar.cc/300?img=6"    },
  //   { name: "Nguyễn Duy Minh", avatar: "https://i.pravatar.cc/300?img=16"  },
  // ];

  const { sentRequests, isLoadingSent, receivedRequests, isLoadingRecive, acceptRequest, isLoadingAccepting, recallRequest, rejectRequest,  } = useFriend();

  const loading = useMemo(() => isLoadingSent || isLoadingRecive || isLoadingAccepting, [isLoadingSent, isLoadingRecive, isLoadingAccepting]);

  const sentReqs = useMemo(() => {
      if(isLoadingSent) return [];
      return sentRequests?.response || []; // Use the response from the sentRequests or an empty array if loading
  }, [isLoadingSent, sentRequests]);

  const reciveReqs = useMemo(() => {
      if(isLoadingRecive) return [];
      return receivedRequests?.response || []; // Use the response from the sentRequests or an empty array if loading
  }, [isLoadingRecive, receivedRequests]);

  return (
    <div className="request-container">
      <h2 className="title">Lời mời kết bạn</h2>

      {/* --- Lời mời đã nhận --- */}
      <div className="section">
        <h4 className="section-title">
          Lời mời đã nhận ({reciveReqs.length})
        </h4>
        <div className="request">
          {reciveReqs.map((request, index) => (
            <div className="request-card" key={index}>
              <img src={request.avatar} alt="Avatar" className="avatar" />
              <div className="card-info">
                <div className="name-row">
                  <span className="name">{request.displayName}</span>
                  <div className="chat-icon" title="Nhắn tin">
                    💬
                  </div>
                </div>
                <span className="time">{request.time}</span>
                <div className="message-box">Xin chào mình là {request.displayName}. Kết bạn với mình nhé</div>
                <div className="action-buttons">
                  <button className="btn btn-decline" onClick={() => rejectRequest(request.requestId)}>Từ chối</button>
                  <button className="btn btn-accept" onClick={() => acceptRequest(request.requestId)}>Đồng ý</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Lời mời đã gửi --- */}
      <div className="section">
        <h4 className="section-title">Lời mời đã gửi ({sentReqs.length})</h4>
        <div className="sent-list">
          {sentReqs.map((request, index) => (
            <div className="sent-card" key={index}>
              <div className="sent-left">
                <img src={request.avatar} alt="Avatar" className="avatar" />
                <div className="sent-info">
                  <div className="name-row">
                    <span className="name">{request.displayName}</span>
                    <div className="chat-icon" title="Nhắn tin">
                      💬
                    </div>
                  </div>
                  <span className="time">Bạn đã gửi lời mời</span>
                  <button className="btn btn-cancel" onClick={() => recallRequest(request.requestId)}>Thu hồi lời mời</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Loading loading={loading} /> {/* Loading component to show loading state */}
    </div>
  );
};

export default FriendRequests;
