const DashboardWelcome = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-4">
            <div className="d-flex flex-column align-items-center justify-content-center gap-2 w-75" style={{ maxWidth: "600px" }}>
                <div className="fs-4 fw-normal text-center">
                    Chào mừng đến với <strong>Chat!</strong>
                </div>
                <p className="text-center text-wrap">
                    Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng
                    người thân, bạn bè được tối ưu hóa trên máy tính của bạn.
                </p>
            </div>
            <div className="w-100" style={{ maxWidth: "380px", height: "228px" }}>
                <img
                    src="/images/bg/quick-message-onboard.png"
                    alt=""
                    className="img-fluid object-fit-cover w-100 h-100"
                />
            </div>
        </div>
    )
};

export default DashboardWelcome;