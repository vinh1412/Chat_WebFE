import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';



const WEBSOCKET_URL = 'http://localhost:8080/ws'

export const connectWebSocket = (userId, onMessageReceived) => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = new Client({ 
        webSocketFactory: () => socket, // sử dụng SockJS để tạo kết nối WebSocket
        reconnectDelay: 5000,
        // debug de xem thong tin ket noi
        debug: (str) => {
            console.log(str);
        },
        onConnect: (frame) => {
            console.log('Connected: ' + frame);

            // Đăng ký subscribe cho userId
            stompClient.subscribe(`/user/profile/${userId}`, (message) => {
                if (message.body) {
                    onMessageReceived(JSON.parse(message.body));
                    
                }
                console.log('Message received:', message.body);
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
    });

    stompClient.activate();

    return stompClient;
}
export const disconnectWebSocket = (stompClient) => {
    if (stompClient && stompClient.connected) {
        stompClient.deactivate();
    }
};