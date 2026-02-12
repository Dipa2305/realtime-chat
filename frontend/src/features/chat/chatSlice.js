import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    draftText: "",
    connectionstatus: "disconnected",
};

const chatSlice = createSlice ({
    name: "chat",
    initialState,
    reducers: {
        addMessage(state, action){
            state.messages.push(action.payload);
        },
        updateMessageStatus(state, action) {
            const { id, status } = action.payload;
            const msg = state.messages.find(m => m.id === id);
            if (msg) msg.status = status;
        },
        setDraftText(state, action){
            state.draftText = action.payload;
        },
        clearDraftText(state){
            state.draftText = "";
        },
        setConnectionStatus(state, action) {
            state.connectionstatus = action.payload;
        },
    },
});

export const {
    addMessage,
    setDraftText,
    clearDraftText,
    setConnectionStatus,
    updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;