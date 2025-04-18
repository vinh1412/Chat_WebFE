import React from "react";
import { useDashboardContext } from "../../../context/Dashboard_context";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const ConversationDetail = ({ conversationInfor }) => {
    console.log("conversationInfor: ", conversationInfor);
    const { currentUser } = useDashboardContext();
    return (
        <div className="card shadow-sm h-100 " style={{ width: "100%" }}>
            <div className=" card-header text-center">
                <h6 className="mb-0 ">Thông tin hội thoại</h6>
            </div>
            <div className="d-flex flex-column align-items-center mt-3">
                <img
                    src={
                        conversationInfor.is_group
                            ? conversationInfor.avatar
                            : conversationInfor.members.find(
                                  (member) => member.id !== currentUser.id
                              ).avatar
                    }
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-circle mb-2"
                />
                <h6 className="mb-0">
                    {!conversationInfor.is_group
                        ? conversationInfor.members.find(
                              (member) => member.id !== currentUser.id
                          ).display_name
                        : conversationInfor.name}
                </h6>{" "}
                {/* Add name below the avatar */}
            </div>
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-clock me-2"></i>
                    <span>Danh sách nhắc hẹn</span>
                </div>
                <hr />
                <div className="mb-3">
                    <div
                        className="d-flex align-items-center justify-content-between"
                        onClick={() => {}}
                    >
                        <h6 className="mb-0">Ảnh/Video</h6>
                        <i className="bi bi-chevron-down"></i>
                    </div>
                    <div>
                        <small className="text-muted">
                            Chưa có Ảnh/Video được chia sẻ trong hội thoại này
                        </small>
                    </div>
                </div>
                <hr />
                <div className="mb-3">
                    <div
                        className="d-flex align-items-center justify-content-between"
                        onClick={() => {}}
                    >
                        <h6 className="mb-0">File</h6>
                        <i className="bi bi-chevron-down"></i>
                    </div>
                    <div>
                        <small className="text-muted">
                            Chưa có File được chia sẻ trong hội thoại này
                        </small>
                    </div>
                </div>
                <hr />
                <div className="mb-3">
                    <div
                        className="d-flex align-items-center justify-content-between"
                        onClick={() => {}}
                    >
                        <h6 className="mb-0">Link</h6>
                        <i className="bi bi-chevron-down"></i>
                    </div>
                    <div>
                        <small className="text-muted">
                            Chưa có Link được chia sẻ trong hội thoại này
                        </small>
                    </div>
                </div>
                <hr />
                <div>
                    <div
                        className="d-flex align-items-center justify-content-between"
                        onClick={() => {}}
                    >
                        <h6 className="mb-0">Thiết lập bảo mật</h6>
                        <i className="bi bi-chevron-down"></i>
                    </div>
                    <div>
                        <div className="d-flex align-items-center mt-2">
                            <i className="bi bi-clock me-2"></i>
                            <span>
                                Tin nhắn tự xóa{" "}
                                <i className="bi bi-question-circle ms-1"></i>
                            </span>
                        </div>
                        <small className="text-muted ms-4">Không bao giờ</small>
                        <div className="d-flex align-items-center mt-2">
                            <i className="bi bi-eye-slash me-2"></i>
                            <span>Ẩn trò chuyện</span>
                            <div className="form-check form-switch ms-auto">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="d-flex align-items-center mb-2">
                    <i
                        className="bi bi-exclamation-triangle me-2"
                        style={{ color: "red" }}
                    ></i>
                    <span>Báo xấu</span>
                </div>
                <div className="d-flex align-items-center">
                    <i class="bi bi-trash3 me-2" style={{ color: "red" }}></i>
                    <span>Xóa lịch sử trò chuyện</span>
                </div>
            </div>
        </div>
    );
};

export default ConversationDetail;
