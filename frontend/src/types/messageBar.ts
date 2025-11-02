import type React from "react";
import type { conversationDataProps } from "./chatList";

export interface MessageBarProps {
  message: string;
  setMessage: (msg: string) => void;
  chatId: string
  setChatId: (id: string) => void;
  // setIsNewChat: (id: boolean) => boolean;
  setConversationData:React.Dispatch<React.SetStateAction<conversationDataProps[]>>
  setRequestProgress: React.Dispatch<React.SetStateAction<boolean>>;
}