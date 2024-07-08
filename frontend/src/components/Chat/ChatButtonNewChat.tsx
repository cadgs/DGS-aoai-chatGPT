import { CommandBarButton } from "@fluentui/react";
import styles from "./ChatButtonNewChat.module.css";

interface ChatButtonNewChatProps {
  disabledButton: () => boolean;
  newChat: () => void;
}

const ChatButtonNewChat: React.FC<ChatButtonNewChatProps> = ({
  disabledButton,
  newChat,
}) => {
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
