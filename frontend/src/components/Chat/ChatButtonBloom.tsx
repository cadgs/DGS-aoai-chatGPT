import {
  useRef,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";

import {
  CommandBarButton,
  IconButton,
  Dialog,
  DialogType,
  Stack,
} from "@fluentui/react";

import {
  ChatMessage,
  ConversationRequest,
  conversationApi,
  Citation,
  ToolMessageContent,
  ChatResponse,
  getUserInfo,
  Conversation,
  historyGenerate,
  historyUpdate,
  historyClear,
  ChatHistoryLoadingState,
  CosmosDBStatus,
  ErrorMessage,
} from "../../api";

import styles from "./ChatButtonBloom.module.css";

import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";
import { useBoolean } from "@fluentui/react-hooks";
import { messageStatus } from "../../api/models";

const ChatButtonBloom = () => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

  //const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clearingChat, setClearingChat] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>();
  const [hideErrorDialog, { toggle: toggleErrorDialog }] = useBoolean(true);
  const [activeCitation, setActiveCitation] = useState<Citation>();
  const [isCitationPanelOpen, setIsCitationPanelOpen] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processMessages, setProcessMessages] = useState<messageStatus>(
    messageStatus.NotRunning
  );

  const clearChat = async () => {
    setClearingChat(true);
    if (
      appStateContext?.state.currentChat?.id &&
      appStateContext?.state.isCosmosDBAvailable.cosmosDB
    ) {
      let response = await historyClear(appStateContext?.state.currentChat.id);
      if (!response.ok) {
        setErrorMsg({
          title: "Error clearing current chat",
          subtitle:
            "Please try again. If the problem persists, please contact the site administrator.",
        });
        toggleErrorDialog();
      } else {
        appStateContext?.dispatch({
          type: "DELETE_CURRENT_CHAT_MESSAGES",
          payload: appStateContext?.state.currentChat.id,
        });
        appStateContext?.dispatch({
          type: "UPDATE_CHAT_HISTORY",
          payload: appStateContext?.state.currentChat,
        });
        setActiveCitation(undefined);
        setIsCitationPanelOpen(false);
        setMessages([]);
      }
    }
    setClearingChat(false);
  };

  const newChat = () => {
    setProcessMessages(messageStatus.Processing);
    setMessages([]);
    setIsCitationPanelOpen(false);
    setActiveCitation(undefined);
    appStateContext?.dispatch({ type: "UPDATE_CURRENT_CHAT", payload: null });
    setProcessMessages(messageStatus.Done);
  };

  const disabledButton = () => {
    return (
      chatStateContext?.state.isLoading ||
      (messages && messages.length === 0) ||
      clearingChat ||
      appStateContext?.state.chatHistoryLoadingState ===
        ChatHistoryLoadingState.Loading
    );
  };

  return (
    <CommandBarButton
      role="button"
      styles={{
        icon: {
          color: "#FFFFFF",
        },
        iconDisabled: {
          color: "#BDBDBD !important",
        },
        root: {
          color: "#FFFFFF",
          background:
            "radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)",
        },
        rootDisabled: {
          background: "#F0F0F0",
        },
      }}
      className={
        appStateContext?.state.isCosmosDBAvailable?.status !==
        CosmosDBStatus.NotConfigured
          ? styles.clearChatBroom
          : styles.clearChatBroomNoCosmos
      }
      iconProps={{ iconName: "Broom" }}
      onClick={
        appStateContext?.state.isCosmosDBAvailable?.status !==
        CosmosDBStatus.NotConfigured
          ? clearChat
          : newChat
      }
      disabled={disabledButton()}
      aria-label="clear chat button"
    />
  );
};

export default ChatButtonBloom;
