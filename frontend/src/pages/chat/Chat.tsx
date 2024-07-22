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
import ChatInitQuestion from "../../components/Chat/ChatInitQuestion";

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

            <Stack
              horizontal
              horizontalAlign="space-between"
              className={styles.initQuestionContainer}
            >
              <ChatInitQuestion
                iconDrawing="M15 19a3 3 0 1 1-6 0M15.865 16A7.54 7.54 0 0 0 19.5 9.538C19.5 5.375 16.142 2 12 2S4.5 5.375 4.5 9.538A7.54 7.54 0 0 0 8.135 16m7.73 0h-7.73m7.73 0v3h-7.73v-3"
                displayText="Morning routine for productivity"
                questionText="Can you help me create a personalized morning routine that would help increase my productivity throughout the day? Start by asking me about my current habits and what activities energize me in the morning."
                iconMd="iconMd1"
              />
              <ChatInitQuestion
                iconDrawing="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm1.293 4.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L8.586 12l-1.293-1.293a1 1 0 0 1 0-1.414M12 14a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
                displayText="Best way to start a working day"
                questionText="Please provide suggestions on what are the best ways to start a working day"
                iconMd="iconMd2"
              />
              <ChatInitQuestion
                iconDrawing="M13.428 17.572 20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547"
                displayText="How to submit SN Ticket"
                questionText="Please provide instructions on how to submit a ServiceNow ticket."
                iconMd="iconMd3"
              />
              <ChatInitQuestion
                iconDrawing="M13.997 3.39A2.5 2.5 0 0 1 17.2 2.103l2.203.882a2.5 2.5 0 0 1 1.342 3.369L19.063 10H20a1 1 0 0 1 1 1v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a1 1 0 0 1 .992-1l-.149-.101-.03-.022c-1.254-.924-1.016-2.864.425-3.458l2.12-.874.724-2.176c.492-1.479 2.41-1.851 3.42-.665L11.99 4.45l1.521.01zm1.513 1.506a2 2 0 0 1 .461 2.618l-1.144 1.861v.045a1.3 1.3 0 0 0 .044.278 1 1 0 0 1 .047.302h1.942l2.07-4.485a.5.5 0 0 0-.268-.673l-2.203-.882a.5.5 0 0 0-.641.258zM12.889 10a3.3 3.3 0 0 1-.06-.499c-.01-.236-.004-.69.237-1.081l1.202-1.954-2.293-.016a2 2 0 0 1-1.51-.704L8.98 4l-.725 2.176A2 2 0 0 1 7.12 7.394L5 8.267l2.063 1.407c.129.087.23.2.303.326zM5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7zm4.5 2.5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
                displayText="Python script for daily email"
                questionText="How to write a Python Script to read the daily email."
                iconMd="iconMd4"
              />
            </Stack>

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
