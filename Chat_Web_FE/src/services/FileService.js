import axiosInstance from "../api/axios";

export const uploadFile = async (file, chatMessageRequest) => {
    try {
        const formData = new FormData();
        formData.append("request", JSON.stringify(chatMessageRequest));
        formData.append("anh", file);
        const response = await axiosInstance.post(
            "/messages/upload-img",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error("Failed to upload file");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
