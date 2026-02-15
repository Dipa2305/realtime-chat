import { addMessage, setConnectionStatus, updateMessageStatus } from "../features/chat/chatSlice";
import { setUsers } from "../features/users/usersSlice";


let socket = null;
let userInfo = null;


export const connectWebSocket = (dispatch, user) => {
    const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
    socket = new WebSocket(`${WS_URL}/${user.userId}`);
    userInfo = user;

    socket.onopen = () => {
        console.log("WebSocket connected");
        dispatch(setConnectionStatus("connected"));
        if (userInfo) {
            socket.send(JSON.stringify({
                type: 'join',
                userId: userInfo.userId,
                username: userInfo.username,
                avatarUrl: userInfo.avatarUrl || '',
            }));
        }
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'userList') {
            dispatch(setUsers(message.users));
        } else if (message.type === "image" || message.type === "text") {
            dispatch(addMessage(message));
            const state = window.store?.getState?.();
            if (state) {
                const myUserId = state.auth.userId;
                const activeUserId = state.users.activeUserId;
                if (message.receiverId === myUserId && message.senderId !== activeUserId) {
                    dispatch({ type: 'users/incrementUnread', payload: message.senderId });
                }
                if (message.receiverId === myUserId) {
                    sendWebSocketMessage({
                        type: 'delivered',
                        messageId: message.id,
                        senderId: message.senderId,
                        receiverId: myUserId,
                    });
                }
            }
        } else if (message.type === 'delivered') {
            dispatch(updateMessageStatus({ id: message.messageId, status: 'delivered' }));
        } else if (message.type === 'read') {
            dispatch(updateMessageStatus({ id: message.messageId, status: 'read' }));
        }
    };


    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        dispatch(setConnectionStatus("disconnected"));
    };
};

export const sendReadEvent = (messageId, senderId, receiverId) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'read',
            messageId,
            senderId,
            receiverId,
        }));
    }
};

export const sendWebSocketMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
};