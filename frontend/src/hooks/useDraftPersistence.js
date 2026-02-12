import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDraftText } from "../features/chat/chatSlice";


const STORAGE_KEY = "chat_draft_text";

export const useDraftPersistence = () => {
    const dispatch = useDispatch();
    const draftText = useSelector((state) => state.chat.draftText);

    useEffect(() => {
        const savedDraft = localStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
            dispatch(setDraftText(savedDraft));
        }
    },[dispatch]);

    useEffect (() => {
        localStorage.setItem(STORAGE_KEY, draftText);
    },[draftText]);
}