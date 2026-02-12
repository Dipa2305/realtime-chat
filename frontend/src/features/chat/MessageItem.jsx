import "../../styles/chat.css";
import { useSelector } from "react-redux";
import { Avatar, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import React, { useState } from "react";
import ForwardModal from "./ForwardModal";
import { useDispatch } from "react-redux";
import { sendWebSocketMessage } from "../../services/websocket";
import { motion } from "framer-motion";

const MessageItem = ({ message }) => {
    const myUserId = useSelector((state) => state.auth.userId);
    const users = useSelector((state) => state.users.users);
    const isMe = message.senderId === myUserId;
    const sender = users.find((u) => u.userId === message.senderId);
    const dispatch = useDispatch();
    const [forwardOpen, setForwardOpen] = useState(false);

    const handleDragStart = (e) => {
        e.preventDefault();
        setForwardOpen(true);
    };

    const handleForward = (selectedUserIds) => {
        selectedUserIds.forEach((userId) => {
            const forwardMsg = {
                ...message,
                id: `${message.id}-fwd-${userId}-${Date.now()}`,
                senderId: myUserId,
                receiverId: userId,
                forwarded: true,
                timestamp: new Date().toISOString(),
            };
            // dispatch(sendWebSocketMessage(forwardMsg));

            sendWebSocketMessage(forwardMsg);

        });

        // setForwardOpen(false);
    };

    return (
        <>
            <motion.div
                className={`message ${isMe ? "me" : "other"}`}
                style={{
                    display: "flex",
                    flexDirection: isMe ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    marginBottom: 8,
                }}
                draggable
                onDragStart={handleDragStart}
                whileDrag={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
            >
                {!isMe && (
                    <Avatar
                        src={sender?.avatarUrl}
                        sx={{ width: 32, height: 32, marginRight: 1 }}
                    >
                        {!sender?.avatarUrl && sender?.username?.[0]?.toUpperCase()}
                    </Avatar>
                )}
                <div
                    className={`bubble ${isMe ? "me" : "other"}`}
                    style={{
                        background: isMe ? "#1976d2" : "#f1f0f0",
                        color: isMe ? "#fff" : "#222",
                        borderRadius: 12,
                        padding: 10,
                        maxWidth: "60%",
                        minWidth: 60,
                        wordBreak: "break-word",
                    }}
                >
                    {message.type === "text" && message.content}

                    {message.type === "image" && (
                        <>
                            <img
                                className="chat-image"
                                src={message.content}
                                alt="uploaded"
                            />
                            {message.caption && (
                                <div style={{ marginTop: 4, marginBottom: 0, }}>
                                    {message.caption}
                                </div>
                            )}
                        </>
                    )}


                    {message.type === "video" && (
                        <video
                            src={message.content}
                            controls
                            style={{ maxWidth: "100%", borderRadius: "6px" }}
                        />
                    )}
                    <div style={{ textAlign: isMe ? "right" : "left", marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <Typography
                            variant="caption"
                            color={isMe ? "#cfe2ff" : "#888"}
                            sx={{ fontSize: 11, marginRight: isMe ? 1 : 0 }}
                        >
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {isMe && (
                            <>
                                {message.status === 'sent' && <CheckIcon fontSize="small" sx={{ color: '#888', ml: 0.5 }} />}
                                {message.status === 'delivered' && <DoneAllIcon fontSize="small" sx={{ color: '#888', ml: 0.5 }} />}
                                {message.status === 'read' && <DoneAllIcon fontSize="small" sx={{ color: '#1976d2', ml: 0.5 }} />}
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
            <ForwardModal
                open={forwardOpen}
                onClose={() => setForwardOpen(false)}
                message={message}
                onForward={handleForward}
            />
        </>
    );
};

export default MessageItem;