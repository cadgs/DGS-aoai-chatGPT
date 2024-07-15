import { useContext } from "react";
import { CommandBarButton } from "@fluentui/react";
import { historyClear, CosmosDBStatus } from "../../api";

import styles from "./ChatButtonBloom.module.css";

import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";

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

  const clearChat = async () => {
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
        chatStateContext?.dispatch({
          type: "SET_ERR_MESSAGE",
          payload: {
            title: "Error clearing current chat",
            subtitle:
              "Please try again. If the problem persists, please contact the site administrator.",
          },
        });
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
        chatStateContext?.dispatch({
          type: "SET_ACTIVE_CITATION",
          payload: null,
        });

        chatStateContext?.dispatch({
          type: "SET_CITATION_PANEL_OPEN",
          payload: false,
        });

        chatStateContext?.dispatch({
          type: "SET_MESSAGES",
          payload: [],
        });
      }
    }
    chatStateContext?.dispatch({
      type: "SET_CLEARING_CHAT",
      payload: false,
    });
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
