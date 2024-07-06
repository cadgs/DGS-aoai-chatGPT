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
//import { useBoolean } from "@fluentui/react-hooks";
import { messageStatus } from "../../api/models";

interface ChatButtonBloomProps {
  disabledButton: () => boolean;
  newChat: () => void;
}

const ChatButtonBloom: React.FC<ChatButtonBloomProps> = ({
  disabledButton,
  newChat,
}) => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [clearingChat, setClearingChat] = useState<boolean>(false);
  //const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>();
  //const [hideErrorDialog, { toggle: toggleErrorDialog }] = useBoolean(true);
  //const [activeCitation, setActiveCitation] = useState<Citation>();
  //const [isCitationPanelOpen, setIsCitationPanelOpen] =  useState<boolean>(false);
  //const [messages, setMessages] = useState<ChatMessage[]>([]);
  //const [processMessages, setProcessMessages] = useState<messageStatus>( messageStatus.NotRunning);

  const clearChat = async () => {
    //setClearingChat(true);
    chatStateContext?.dispatch({
      type: "SET_CLEARING_CHAT",
      payload: true,
    });

    if (
      appStateContext?.state.currentChat?.id &&
      appStateContext?.state.isCosmosDBAvailable.cosmosDB
    ) {
      let response = await historyClear(appStateContext?.state.currentChat.id);
      alert(response);
      alert(response.ok);

      if (!response.ok) {
        /* setErrorMsg({
          title: "Error clearing current chat",
          subtitle:
            "Please try again. If the problem persists, please contact the site administrator.",
        }); */
        chatStateContext?.dispatch({
          type: "SET_ERR_MESSAGE",
          payload: {
            title: "Error clearing current chat",
            subtitle:
              "Please try again. If the problem persists, please contact the site administrator.",
          },
        });
        //toggleErrorDialog();
        chatStateContext?.dispatch({ type: "TOGGLE_HIDE_ERR_DIALOG" });
      } else {
        appStateContext?.dispatch({
          type: "DELETE_CURRENT_CHAT_MESSAGES",
          payload: appStateContext?.state.currentChat.id,
        });
        appStateContext?.dispatch({
          type: "UPDATE_CHAT_HISTORY",
          payload: appStateContext?.state.currentChat,
        });
        //setActiveCitation(undefined);
        chatStateContext?.dispatch({
          type: "SET_ACTIVE_CITATION",
          payload: null,
        });

        //setIsCitationPanelOpen(false);
        chatStateContext?.dispatch({
          type: "SET_CITATION_PANEL_OPEN",
          payload: false,
        });

        //setMessages([]);
        chatStateContext?.dispatch({
          type: "SET_MESSAGES",
          payload: [],
        });
      }
    }
    // setClearingChat(false);
    chatStateContext?.dispatch({
      type: "SET_CLEARING_CHAT",
      payload: false,
    });
  };
  /*
  const newChat = () => {
    //setProcessMessages(messageStatus.Processing);
    chatStateContext?.dispatch({
      type: "PROCESS_MESSAGES",
      payload: messageStatus.Processing,
    });

    //setMessages([]);
    chatStateContext?.dispatch({
      type: "SET_MESSAGES",
      payload: [],
    });

    //setIsCitationPanelOpen(false);
    chatStateContext?.dispatch({
      type: "SET_CITATION_PANEL_OPEN",
      payload: false,
    });

    //setActiveCitation(undefined);
    chatStateContext?.dispatch({
      type: "SET_ACTIVE_CITATION",
      payload: null,
    });

    appStateContext?.dispatch({ type: "UPDATE_CURRENT_CHAT", payload: null });
    //setProcessMessages(messageStatus.Done);
    chatStateContext?.dispatch({
      type: "PROCESS_MESSAGES",
      payload: messageStatus.Done,
    });
  }; */
  /*
  const disabledButton = () => {
    return (
      chatStateContext?.state.isLoading ||
      (chatStateContext?.state.messages &&
        chatStateContext?.state.messages.length === 0) ||
      chatStateContext?.state.clearingChat ||
      appStateContext?.state.chatHistoryLoadingState ===
        ChatHistoryLoadingState.Loading
    );
  }; */

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
