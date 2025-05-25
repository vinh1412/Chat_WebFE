import React, { useEffect, useState, useRef } from "react";
import ReactModal from "react-modal";
import { useDashboardContext } from "../../context/Dashboard_context";
import { toast } from "react-toastify";
import VideoCallModal from "./VideoCallModal";
import { connectWebSocket, disconnectWebSocket } from "../../services/SocketService1.js";

const IncomingCallModal = () => {
    const { currentUser } = useDashboardContext();
    const [isOpen, setIsOpen] = useState(false);
    const [callData, setCallData] = useState(null);
    const [showVideoCallModal, setShowVideoCallModal] = useState(false);
    const stompClientRef = useRef(null);
    const modalRenderedRef = useRef(false);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);

    const initializeWebSocket = React.useCallback(() => {
        if (!currentUser?.id) return;

        stompClientRef.current = connectWebSocket(
            currentUser.id,
            (data) => {
                console.log("Incoming call data:", data);
                if (data.status === "request") {
                    setCallData(data);
                    setIsOpen(true);
                    initializeWebRTC();
                } else if (data.status === "ended") {
                    setIsOpen(false);
                    setShowVideoCallModal(false);
                    setCallData(null);
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.close();
                    }
                    if (localStreamRef.current) {
                        localStreamRef.current.getTracks().forEach((track) => track.stop());
                    }
                } else if (data.status === "offer" && showVideoCallModal) {
                    handleOffer(data);
                } else if (data.status === "answer" && showVideoCallModal) {
                    handleAnswer(data);
                } else if (data.status === "ice-candidate" && showVideoCallModal) {
                    handleIceCandidate(data);
                }
            },
            []
        );
    }, [currentUser?.id, showVideoCallModal]);

    const initializeWebRTC = async () => {
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: callData?.callType === "video",
                audio: true,
            });
            localStreamRef.current = stream;

            stream.getTracks().forEach((track) => {
                peerConnectionRef.current.addTrack(track, stream);
            });

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate && peerConnectionRef.current.signalingState !== 'closed') {
                    stompClientRef.current.publish({
                        destination: "/app/call/ice-candidate",
                        body: JSON.stringify({
                            roomId: callData.conversationId,
                            candidate: event.candidate,
                            recipientId: callData.callerId,
                            callerId: currentUser.id,
                        }),
                    });
                }
            };

        } catch (err) {
            console.error("Error initializing WebRTC:", err);
            toast.error("Không thể truy cập webcam hoặc micro.");
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
                        roomId: callData.conversationId,
                        answer,
                        recipientId: callData.callerId,
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
    //     if (currentUser?.id) {
    //         modalRenderedRef.current = true;
    //         setTimeout(() => {
    //             initializeWebSocket();
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
    //         modalRenderedRef.current = false;
    //     };
    // }, [currentUser?.id, initializeWebSocket]);

    const acceptCall = async () => {
        if (!stompClientRef.current || !stompClientRef.current.connected) {
            toast.error("WebSocket chưa kết nối. Vui lòng thử lại.");
            return;
        }

        stompClientRef.current.publish({
            destination: "/app/call/accept",
            body: JSON.stringify({
                callerId: callData.callerId,
                recipientId: currentUser.id,
                conversationId: callData.conversationId,
                status: "accepted",
                callType: callData.callType,
            }),
        });
        setIsOpen(false);
        setShowVideoCallModal(true);
        toast.info("Chấp nhận cuộc gọi...");
    };

    const rejectCall = () => {
        if (!stompClientRef.current || !stompClientRef.current.connected) {
            toast.error("WebSocket chưa kết nối. Vui lòng thử lại.");
            return;
        }

        stompClientRef.current.publish({
            destination: "/app/call/reject",
            body: JSON.stringify({
                callerId: callData.callerId,
                recipientId: currentUser.id,
                conversationId: callData.conversationId,
                status: "rejected",
                callType: callData.callType,
            }),
        });
        setIsOpen(false);
        setCallData(null);
    };

    return (
        <>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={rejectCall}
                className="border-0 bg-white rounded-4 shadow p-3"
                overlayClassName="position-fixed top-0 start-0 z-50 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
                style={{ content: { inset: "unset", width: "400px" } }}
            >
                <h5 className="text-center">{callData?.callType === "video" ? "Cuộc gọi video đến" : "Cuộc gọi thoại đến"}</h5>
                <p className="text-center">Từ: {callData?.callerName}</p>
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-success" onClick={acceptCall}>
                        Chấp nhận
                    </button>
                    <button className="btn btn-danger" onClick={rejectCall}>
                        Từ chối
                    </button>
                </div>
            </ReactModal>
            {showVideoCallModal && (
                <VideoCallModal
                    isOpen={showVideoCallModal}
                    onClose={() => setShowVideoCallModal(false)}
                    recipientId={callData?.callerId}
                    recipientName={callData?.callerName}
                    conversationId={callData?.conversationId}
                    callType={callData?.callType}
                />
            )}
        </>
    );
};

export default IncomingCallModal;