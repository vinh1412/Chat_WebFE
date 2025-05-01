import React from "react";
export const getFileIcon = (fileName) => {
    if (!fileName) return "📁";

    const extension = fileName.split(".").pop().toLowerCase();

    // Map extensions to Bootstrap icons
    switch (extension) {
        // Documents
        case "pdf":
            return <i className="bi bi-file-earmark-pdf text-danger"></i>;
        case "doc":
        case "docx":
            return <i className="bi bi-file-earmark-word text-primary"></i>;

        // Spreadsheets
        case "xls":
        case "xlsx":
            return <i className="bi bi-file-earmark-excel text-success"></i>;

        // Presentations
        case "ppt":
        case "pptx":
            return <i className="bi bi-file-earmark-slides text-warning"></i>;

        // Images (should be handled by IMAGE type, but just in case)
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
            return <i className="bi bi-file-earmark-image text-info"></i>;

        // Archives
        case "zip":
        case "rar":
        case "tar":
        case "7z":
            return <i className="bi bi-file-earmark-zip text-secondary"></i>;

        // Text
        case "txt":
            return <i className="bi bi-file-earmark-text"></i>;

        // Audio
        case "mp3":
        case "wav":
        case "ogg":
            return <i className="bi bi-file-earmark-music text-success"></i>;

        // Video
        case "mp4":
        case "mov":
        case "avi":
            return <i className="bi bi-file-earmark-play text-danger"></i>;

        // Code
        case "js":
        case "jsx":
        case "ts":
        case "tsx":
        case "html":
        case "css":
        case "java":
        case "py":
        case "php":
            return <i className="bi bi-file-earmark-code text-primary"></i>;

        // Default
        default:
            return <i className="bi bi-file-earmark"></i>;
    }
};
