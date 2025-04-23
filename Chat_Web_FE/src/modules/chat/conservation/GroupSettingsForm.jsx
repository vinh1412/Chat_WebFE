import React from "react";

const GroupSettingsForm = ({ onBack }) => {
  return (
    <div
      className="card p-3"
      style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      <div className="d-flex align-items-center gap-2 mb-3 justify-content-between">
        <span style={{ cursor: "pointer" }} onClick={onBack}>
          <i class="bi bi-arrow-left-short fs-3"></i>
        </span>
        <div className="w-100 d-flex justify-content-center">
          <h6 className="mb-0 fs-5">Quản lý nhóm</h6>
        </div>
      </div>

      {/* Các checkbox quyền */}
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="changeName"
        />
        <label className="form-check-label" htmlFor="changeName">
          Thay đổi tên & ảnh đại diện của nhóm
        </label>
      </div>

      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="pinMessages"
        />
        <label className="form-check-label" htmlFor="pinMessages">
          Ghim tin nhắn, ghi chú, bình chọn lên đầu hội thoại
        </label>
      </div>

      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="newNote"
        />
        <label className="form-check-label" htmlFor="newNote">
          Tạo mới ghi chú, nhắc hẹn
        </label>
      </div>

      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="createPoll"
        />
        <label className="form-check-label" htmlFor="createPoll">
          Tạo mới bình chọn
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="sendMessage"
        />
        <label className="form-check-label" htmlFor="sendMessage">
          Gửi tin nhắn
        </label>
      </div>

      <hr className="border-5 rounded-1" />

      {/* Các switch */}
      <div className="form-switch form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="requireApproval"
        />
        <label className="form-check-label" htmlFor="requireApproval">
          Chế độ phê duyệt thành viên mới
        </label>
      </div>

      <div className="form-switch form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="markLeaderMessages"
        />
        <label className="form-check-label" htmlFor="markLeaderMessages">
          Đánh dấu tin nhắn từ trưởng/phó nhóm
        </label>
      </div>

      <div className="form-switch form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="newMemberAccess"
        />
        <label className="form-check-label" htmlFor="newMemberAccess">
          Cho phép thành viên mới đọc tin nhắn gần nhất
        </label>
      </div>

      <div className="form-switch form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          defaultChecked
          id="linkJoin"
        />
        <label className="form-check-label" htmlFor="linkJoin">
          Cho phép dùng link tham gia nhóm
        </label>
      </div>

      {/* Link tham gia nhóm */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          readOnly
          value="zalo.me/g/hcdimo839"
        />
        <button className="btn btn-outline-secondary">Sao chép</button>
      </div>

      <hr className="border-5 rounded-1" />

      <div className="mb-3">
        <button className="btn btn-light w-100 text-start mb-2 fs-6">
          <i className="bi bi-person-x me-2"></i> Chặn khỏi nhóm
        </button>
        <button className="btn btn-light w-100 text-start fs-6">
          <i className="bi bi-key me-2"></i> Trưởng & phó nhóm
        </button>
      </div>

      <hr className="border-5 rounded-1" />

      <div style={{ backgroundColor: "#f8d7da" }} className="rounded-2">
        <button className="btn btn-outline-danger w-100 fs-6">
          Giải tán nhóm
        </button>
      </div>
    </div>
  );
};

export default GroupSettingsForm;
