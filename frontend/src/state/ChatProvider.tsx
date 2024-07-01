import React, { createContext, ReactNode, useReducer, useState } from "react";
import { ChatMessage, Citation, ErrorMessage } from "../api";
import { messageStatus } from "../api/models";
import { chatStateReducer } from "./ChatReducer";

export interface ChatState {
  isLoading: boolean;
  clearingChat: boolean;
  errorMsg: ErrorMessage | null;
  hideErrorDialog: boolean;
  activeCitation: Citation | null;
  isCitationPanelOpen: boolean;
  messages: ChatMessage | null;
  processMessages: messageStatus | null;
}

const initialChatState: ChatState = {
  isLoading: false,
  clearingChat: false,
  errorMsg: null,
  hideErrorDialog: false,
  activeCitation: null,
  isCitationPanelOpen: false,
  messages: null,
  processMessages: null,
};

export type ChatAction =
  | { type: "TOGGLE_LOADING" }
  | { type: "TOGGLE_CLEARING" }
  | { type: "SET_ERR_MESSAGE"; payload: ErrorMessage }
  | { type: "TOGGLE_HIDE_ERR_DIALOG" }
  | { type: "SET_ACTIVE_CITATION"; payload: Citation | null }
  | { type: "TOGGLE_CITATION_PANEL_OPEN" }
  | { type: "UPDATE_MESSAGES"; payload: ChatMessage } // API Call
  | { type: "PROCESS_MESSAGES"; payload: messageStatus };

export const ChatStateContext = createContext<
  | {
      state: ChatState;
      dispatch: React.Dispatch<ChatAction>;
    }
  | undefined
>(undefined);

type ChatStateProviderProps = {
  children: ReactNode;
};

export const ChatStateProvider: React.FC<ChatStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatStateReducer, initialChatState);

  return (
    <ChatStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatStateContext.Provider>
  );
};

export default ChatStateProvider;
