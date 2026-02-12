import React from "react";
import { useSelector } from "react-redux";
import MessageItem from "./MessageItem";
import { motion, AnimatePresence } from "framer-motion";

const MessageList = () => {
    const messages = useSelector((state) => state.chat?.messages || []);
    const myUserId = useSelector((state) => state.auth.userId);
    const activeUserId = useSelector((state) => state.users.activeUserId);

    const filteredMessages = messages.filter(
        (msg) =>
            (activeUserId === myUserId && msg.senderId === myUserId && msg.receiverId === myUserId) ||
            (msg.senderId === myUserId && msg.receiverId === activeUserId) ||
            (msg.senderId === activeUserId && msg.receiverId === myUserId)
    );

    React.useEffect(() => {
        if (activeUserId && activeUserId !== myUserId) {
            filteredMessages.forEach((msg) => {
                if (msg.senderId === activeUserId && msg.status !== 'read') {
                    import('../../services/websocket').then(({ sendReadEvent }) => {
                        sendReadEvent(msg.id, msg.senderId, msg.receiverId);
                    });
                }
            });
        }
    }, [activeUserId, filteredMessages, myUserId]);

    const messageVariants = {
        hidden: { opacity: 0, translateY: 20 },
        visible: { opacity: 1, translateY: 0, transition: { duration: 0.2, ease: "easeOut" } },
    };

    return (
        <motion.div className="chat-box" layout>
            <AnimatePresence>
                {filteredMessages.map((msg, idx) => (
                    <motion.div
                        key={`${msg.id}-${idx}`}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={messageVariants}
                        layout
                    >
                        <MessageItem message={msg} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
export default MessageList;