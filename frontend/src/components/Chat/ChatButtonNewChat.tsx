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

import styles from "./ChatButtonNewChat.module.css";

import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";
//import { useBoolean } from "@fluentui/react-hooks";
import { messageStatus } from "../../api/models";

interface ChatButtonNewChatProps {
  disabledButton: () => boolean;
  newChat: () => void;
}

const ChatButtonNewChat: React.FC<ChatButtonNewChatProps> = ({
  disabledButton,
  newChat,
}) => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

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
      className={styles.newChatIcon}
      iconProps={{ iconName: "Add" }}
      onClick={newChat}
      disabled={disabledButton()}
      aria-label="start a new chat button"
    />
  );
};

export default ChatButtonNewChat;
