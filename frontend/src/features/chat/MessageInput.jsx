import { useDispatch, useSelector } from "react-redux";
import { setDraftText, clearDraftText } from "./chatSlice";
import { sendWebSocketMessage } from "../../services/websocket";
import { uploadToCloudinary } from "../../services/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

import {
  TextField,
  IconButton,
  Paper,
  Box,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const MessageInput = () => {
  const dispatch = useDispatch();
  const draftText = useSelector((state) => state.chat.draftText);
  const myUserId = useSelector((state) => state.auth.userId);
  const myUsername = useSelector((state) => state.auth.username);
  const activeUserId = useSelector((state) => state.users.activeUserId);

  const [mediaUrl, setMediaUrl] = useState(null);
  const [uploading, setUploading] = useState(false);


  const handleSend = () => {
    if (!activeUserId) return;
    if (!draftText.trim() && !mediaUrl) return;

    const message = {
      id: uuidv4(),
      senderId: myUserId,
      senderName: myUsername,
      receiverId: activeUserId,
      type: mediaUrl ? "image" : "text",
      content: mediaUrl || draftText,
      caption: draftText || null,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    sendWebSocketMessage(message);

    dispatch(clearDraftText());
    setMediaUrl(null);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadToCloudinary(file);
      setMediaUrl(result.secure_url);
    } catch (err) {
      // console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 1,
        borderRadius: 3,
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >

      {mediaUrl && (
        <Box sx={{ mb: 1 }}>
          <img
            src={mediaUrl}
            alt="preview"
            style={{ maxWidth: 120, borderRadius: 8 }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => document.getElementById("chat-file-input").click()}>
          <AttachFileIcon />
        </IconButton>

        <input
          id="chat-file-input"
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            handleFileUpload(file);
            e.target.value = "";
          }}
        />

        <TextField
          fullWidth
          variant="standard"
          placeholder={uploading ? "Uploading..." : "Type a message..."}
          value={draftText}
          onChange={(e) => dispatch(setDraftText(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          InputProps={{ disableUnderline: true }}
        />

        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default MessageInput;
