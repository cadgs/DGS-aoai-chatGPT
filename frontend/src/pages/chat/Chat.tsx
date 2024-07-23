import { useRef, useEffect, useContext, useLayoutEffect } from "react";
import { Stack } from "@fluentui/react";

import styles from "./Chat.module.css";
import styles2 from "../../components/Chat/ChatAuth.module.css";

import Contoso from "../../assets/Contoso.svg";
import ChatAuth from "../../components/Chat/ChatAuth";

import {
  ChatMessage,
  Citation,
  ChatHistoryLoadingState,
  CosmosDBStatus,
} from "../../api";
import { ChatHistoryPanel } from "../../components/ChatHistory/ChatHistoryPanel";
import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";
import { messageStatus } from "../../api/models";

import ChatButtonBloom from "../../components/Chat/ChatButtonBloom";
import ChatButtonNewChat from "../../components/Chat/ChatButtonNewChat";
import ChatCitationPanel from "../../components/Chat/ChatCitationPanel";
import ChatButtonStopGenerating from "../../components/Chat/ChatButtonStopGenerating";
import ChatErrorDialog from "../../components/Chat/ChatErrorDialog";
import ChatQuestionInput from "../../components/Chat/ChatQuestionInput";
import ChatAnswer from "../../components/Chat/ChatAnswer";
import ChatInitQuestionList from "../../components/Chat/ChatInitQuestionList";

const Chat = () => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

  const ui = appStateContext?.state.frontendSettings?.ui;
  const showAuthMessage = chatStateContext?.state.showAuthMessage;

  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const abortFuncs = useRef([] as AbortController[]);

  // Add facade for chatStateContext function setMessages
  const messages = chatStateContext?.state.messages ?? [];
  const setMessages = (messages: ChatMessage[]) => {
    chatStateContext?.dispatch({
      type: "SET_MESSAGES",
      payload: messages,
    });
  };

  // Add facade for chatStateContext function setIsLoading
  const setIsLoading = (isLoading: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_LOADING",
      payload: isLoading,
    });
  };

  // Add facade for chatStateContext function setShowLoadingMessage
  const showLoadingMessage = chatStateContext?.state.showLoadingMessage;
  const setShowLoadingMessage = (showLoadingMessage: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_SHOW_LOADING_MESSAGE",
      payload: showLoadingMessage,
    });
  };

  // Add facade for chatStateContext function setActiveCitation
  const activeCitation = chatStateContext?.state.activeCitation;
  const setActiveCitation = (activeCitation: Citation | null) => {
    chatStateContext?.dispatch({
      type: "SET_ACTIVE_CITATION",
      payload: activeCitation,
    });
  };

  // Add facade for chatStateContext function setIsCitationPanelOpen
  const isCitationPanelOpen = chatStateContext?.state.isCitationPanelOpen;
  const setIsCitationPanelOpen = (isCitationPanelOpen: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_CITATION_PANEL_OPEN",
      payload: isCitationPanelOpen,
    });
  };

  // Add facade for chatStateContext function setProcessMessages
  const processMessages = chatStateContext?.state.processMessages;
  const setProcessMessages = (processMessages: messageStatus) => {
    chatStateContext?.dispatch({
      type: "PROCESS_MESSAGES",
      payload: processMessages,
    });
  };

  useEffect(() => {
    setIsLoading(
      appStateContext?.state.chatHistoryLoadingState ===
        ChatHistoryLoadingState.Loading
    );
  }, [appStateContext?.state.chatHistoryLoadingState]);

  const newChat = () => {
    setProcessMessages(messageStatus.Processing);
    setMessages([]);
    setIsCitationPanelOpen(false);
    setActiveCitation(null);
    appStateContext?.dispatch({ type: "UPDATE_CURRENT_CHAT", payload: null });
    setProcessMessages(messageStatus.Done);
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setShowLoadingMessage(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (appStateContext?.state.currentChat) {
      setMessages(appStateContext.state.currentChat.messages);
    } else {
      setMessages([]);
    }
  }, [appStateContext?.state.currentChat]);

  useLayoutEffect(() => {
    chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [showLoadingMessage, processMessages]);

  // function disabledButton is shared among multiple components, such as
  // ChatButtonBloom and ChatButtonNewChat
  const disabledButton = () => {
    return (
      chatStateContext?.state.isLoading ||
      (chatStateContext?.state.messages &&
        chatStateContext?.state.messages.length === 0) ||
      chatStateContext?.state.clearingChat ||
      appStateContext?.state.chatHistoryLoadingState ===
        ChatHistoryLoadingState.Loading
    );
  };

  return (
    <div className={styles.container} role="main">
      {showAuthMessage ? (
        /* Following HTML is for showing auth message UI */
        <ChatAuth />
      ) : (
        /* Following HTML is for not showing auth message UI */
        <Stack horizontal className={styles.chatRoot}>
          <div className={styles.chatContainer}>
            {!messages || messages.length < 1 ? (
              <Stack className={styles2.chatEmptyState}>
                <img
                  src={ui?.chat_logo ? ui.chat_logo : Contoso}
                  className={styles.chatIcon}
                  aria-hidden="true"
                />
                <h1 className={styles2.chatEmptyStateTitle}>
                  {ui?.chat_title}
                </h1>
                <h2 className={styles2.chatEmptyStateSubtitle}>
                  {ui?.chat_description}
                </h2>
              </Stack>
            ) : (
              <ChatAnswer />
            )}

            <ChatInitQuestionList />

            <Stack horizontal className={styles.chatInput}>
              {chatStateContext?.state.isLoading && (
                <ChatButtonStopGenerating stopGenerating={stopGenerating} />
              )}
              <Stack>
                {appStateContext?.state.isCosmosDBAvailable?.status !==
                  CosmosDBStatus.NotConfigured && (
                  <ChatButtonNewChat
                    disabledButton={disabledButton}
                    newChat={newChat}
                  />
                )}
                {
                  <ChatButtonBloom
                    disabledButton={disabledButton}
                    newChat={newChat}
                  />
                }
                <ChatErrorDialog />
              </Stack>
              <ChatQuestionInput />
            </Stack>
          </div>
          {/* Citation Panel */}
          {messages &&
            messages.length > 0 &&
            isCitationPanelOpen &&
            activeCitation && <ChatCitationPanel />}
          {appStateContext?.state.isChatHistoryOpen &&
            appStateContext?.state.isCosmosDBAvailable?.status !==
              CosmosDBStatus.NotConfigured && <ChatHistoryPanel />}
        </Stack> /* End of none-auth message UI */
      )}
    </div>
  );
};

export default Chat;
