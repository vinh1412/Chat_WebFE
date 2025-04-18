import React from "react";

const Loading = ({ isLoading }) => {
  return (
    <div>
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang cập nhật...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading;
