import React, { createContext, ReactNode, useReducer, useState } from "react";
import { ChatMessage, Citation, ErrorMessage } from "../api";
import { messageStatus } from "../api/models";
import { chatStateReducer } from "./ChatReducer";

export interface ChatState {
  isLoading: boolean;
  showLoadingMessage: boolean;
  clearingChat: boolean;
  errorMsg: ErrorMessage | null;
  hideErrorDialog: boolean;
  activeCitation: Citation | null;
  isCitationPanelOpen: boolean;
  messages: ChatMessage[] | null;
  processMessages: messageStatus | null;
}

const initialChatState: ChatState = {
  isLoading: false,
  showLoadingMessage: false,
  clearingChat: false,
  errorMsg: null,
  hideErrorDialog: true,
  activeCitation: null,
  isCitationPanelOpen: false,
  messages: [],
  processMessages: messageStatus.NotRunning,
};

export type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SHOW_LOADING_MESSAGE"; payload: boolean }
  | { type: "SET_CLEARING_CHAT"; payload: boolean }
  | { type: "SET_ERR_MESSAGE"; payload: ErrorMessage | null }
  | { type: "TOGGLE_HIDE_ERR_DIALOG" }
  | { type: "SET_ACTIVE_CITATION"; payload: Citation | null }
  | { type: "SET_CITATION_PANEL_OPEN"; payload: boolean }
  | { type: "SET_MESSAGES"; payload: ChatMessage[] | null } // API Call
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
