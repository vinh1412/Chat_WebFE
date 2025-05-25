import React, { useEffect, useState, useRef } from "react";
import ReactModal from "react-modal";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import { useDashboardContext } from "../../context/Dashboard_context";
import { toast } from "react-toastify";
import { connectWebSocket, disconnectWebSocket } from "../../services/SocketService1.js";

const VideoCallModal = ({ isOpen, onClose, recipientId, recipientName, conversationId, callType = "video" }) => {
  console.log("VideoCallModal props:", { recipientId, conversationId });
    const { currentUser } = useDashboardContext();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(callType === "video");
    const [callStatus, setCallStatus] = useState("Đang kết nối...");
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const stompClientRef = useRef(null);
    const modalRenderedRef = useRef(false);
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef(null);

    const initializeCall = async () => {
      if (!currentUser?.id || !recipientId || !conversationId) {
          toast.error("Thông tin người dùng hoặc cuộc trò chuyện không hợp lệ.");
          onClose();
          return;
      }
  
      try {
          // Thiết lập WebSocket (STOMP)
          stompClientRef.current = await connectWebSocket(
              currentUser.id,
              (data) => {
                  if (data.status === "accepted") {
                      setCallStatus("Đã kết nối");
                      timerRef.current = setInterval(() => {
                          setCallDuration((prev) => prev + 1);
                      }, 1000);
                  } else if (data.status === "rejected" || data.status === "ended") {
                      setCallStatus("Cuộc gọi đã kết thúc");
                      if (peerConnectionRef.current) {
                          peerConnectionRef.current.close();
                      }
                      if (localStreamRef.current) {
                          localStreamRef.current.getTracks().forEach((track) => track.stop());
                      }
                      clearInterval(timerRef.current);
                      setCallDuration(0);
                      setTimeout(onClose, 1000);
                  } else if (data.status === "offer") {
                      handleOffer(data);
                  } else if (data.status === "answer") {
                      handleAnswer(data);
                  } else if (data.status === "ice-candidate") {
                      handleIceCandidate(data);
                  }
              }
          );
  
          // Đảm bảo stompClient đã kết nối trước khi gửi thông điệp
          if (!stompClientRef.current.connected) {
              throw new Error("WebSocket chưa kết nối");
          }
  
          // Gửi yêu cầu gọi
          stompClientRef.current.publish({
              destination: "/app/call/request",
              body: JSON.stringify({
                  callerId: currentUser.id,
                  recipientId,
                  conversationId,
                  callerName: currentUser.display_name,
                  callType,
              }),
          });
          console.log("Recipient ID--------:", recipientId);
  
          // Thiết lập WebRTC
          const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
          peerConnectionRef.current = new RTCPeerConnection(configuration);
  
          const stream = await navigator.mediaDevices.getUserMedia({
              video: callType === "video",
              audio: true,
          });
          localStreamRef.current = stream;
          if (callType === "video" && localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
          }
  
          stream.getTracks().forEach((track) => {
              peerConnectionRef.current.addTrack(track, stream);
          });
  
          peerConnectionRef.current.onicecandidate = (event) => {
              if (event.candidate && peerConnectionRef.current.signalingState !== 'closed') {
                  stompClientRef.current.publish({
                      destination: "/app/call/ice-candidate",
                      body: JSON.stringify({
                          roomId: conversationId,
                          candidate: event.candidate,
                          recipientId,
                          callerId: currentUser.id,
                      }),
                  });
              }
          };
  
          peerConnectionRef.current.ontrack = (event) => {
              if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = event.streams[0];
              }
          };
  
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          stompClientRef.current.publish({
              destination: "/app/call/offer",
              body: JSON.stringify({
                  roomId: conversationId,
                  offer,
                  recipientId,
                  callerId: currentUser.id,
              }),
          });
  
      } catch (error) {
          console.error("Error initializing call:", error);
          toast.error("Lỗi khởi tạo cuộc gọi: " + error.message);
          onClose();
      }
  };

    const handleOffer = async (data) => {
        try {
            if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                stompClientRef.current.publish({
                    destination: "/app/call/answer",
                    body: JSON.stringify({
                        roomId: conversationId,
                        answer,
                        recipientId,
                        callerId: currentUser.id,
                    }),
                });
            }
        } catch (err) {
            console.error("Error handling offer:", err);
        }
    };

    const handleAnswer = async (data) => {
        try {
            if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                if (!timerRef.current) {
                    timerRef.current = setInterval(() => {
                        setCallDuration((prev) => prev + 1);
                    }, 1000);
                }
            }
        } catch (err) {
            console.error("Error handling answer:", err);
        }
    };

    const handleIceCandidate = async (data) => {
        try {
            if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'closed') {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (err) {
            console.error("Error adding ICE candidate:", err);
        }
    };

    // useEffect(() => {
    //     if (isOpen) {
    //         modalRenderedRef.current = true;
    //         setTimeout(() => {
    //             initializeCall();
    //         }, 0);
    //     }

    //     return () => {
    //         if (peerConnectionRef.current) {
    //             peerConnectionRef.current.close();
    //         }
    //         if (localStreamRef.current) {
    //             localStreamRef.current.getTracks().forEach((track) => track.stop());
    //         }
    //         disconnectWebSocket(stompClientRef.current);
    //         clearInterval(timerRef.current);
    //         setCallDuration(0);
    //         modalRenderedRef.current = false;
    //     };
    // }, [isOpen]);

    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const toggleCamera = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    };

    const endCall = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: "/app/call/end",
                body: JSON.stringify({
                    callerId: currentUser.id,
                    recipientId,
                    conversationId,
                }),
            });
        }
        onClose();
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={endCall}
            className="border-0 bg-dark rounded-4 shadow p-0"
            overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
            style={{ content: { inset: "unset", width: "600px", maxHeight: "90vh" } }}
        >
            <div className="w-100 h-100 position-relative rounded-4 overflow-hidden">
                {/* Remote Video */}
                <div className="w-100 h-100" style={{ minHeight: "400px" }}>
                    <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover rounded-lg" />
                </div>

                {/* Local Video */}
                {callType === "video" && (
                    <div className="absolute bottom-4 right-4 w-1/4 rounded-lg overflow-hidden shadow-lg">
                        <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Call Info */}
                <div className="position-absolute top-0 start-0 w-100 p-3 text-white text-center bg-dark bg-opacity-50">
                    <h5 className="m-0">{recipientName || "Đang gọi..."}</h5>
                    <small>{callStatus}</small>
                    {callStatus === "Đã kết nối" && callDuration > 0 && (
                        <small className="ml-2">{formatDuration(callDuration)}</small>
                    )}
                </div>

                {/* Controls */}
                <div className="position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center gap-3 bg-dark bg-opacity-50">
                    <button
                        className={`btn btn-${isMicOn ? "primary" : "danger"} rounded-circle`}
                        onClick={toggleMic}
                        title={isMicOn ? "Tắt mic" : "Bật mic"}
                    >
                        {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                    </button>
                    {callType === "video" && (
                        <button
                            className={`btn btn-${isCameraOn ? "primary" : "danger"} rounded-circle`}
                            onClick={toggleCamera}
                            title={isCameraOn ? "Tắt camera" : "Bật camera"}
                        >
                            {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
                        </button>
                    )}
                    <button
                        className="btn btn-danger rounded-circle"
                        onClick={endCall}
                        title="Kết thúc cuộc gọi"
                    >
                        <FaPhoneSlash />
                    </button>
                </div>
            </div>
        </ReactModal>
    );
};

export default VideoCallModal;