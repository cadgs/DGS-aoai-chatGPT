import { useEffect, useContext } from "react";
import { Stack } from "@fluentui/react";
import { getUserInfo } from "../../api";

import { ShieldLockRegular } from "@fluentui/react-icons";
import styles from "./ChatAuth.module.css";

import { AppStateContext } from "../../state/AppProvider";
import { ChatStateContext } from "../../state/ChatProvider";

const ChatAuth = () => {
  const appStateContext = useContext(AppStateContext);
  const chatStateContext = useContext(ChatStateContext);

  const AUTH_ENABLED = appStateContext?.state.frontendSettings?.auth_enabled;

  // Add facade for chatStateContext function setShowAuthMessage
  const setShowAuthMessage = (showAuthMessage: boolean) => {
    chatStateContext?.dispatch({
      type: "SET_SHOW_AUTH_MESSAGE",
      payload: showAuthMessage,
    });
  };

  const getUserInfoList = async () => {
    if (!AUTH_ENABLED) {
      setShowAuthMessage(false);
      return;
    }
    const userInfoList = await getUserInfo();

    if (
      userInfoList.length === 0 &&
      window.location.hostname !== "127.0.0.1" &&
      window.location.hostname !== "localhost"
    ) {
      setShowAuthMessage(true);
    } else {
      setShowAuthMessage(false);
    }
  };

  useEffect(() => {
    if (AUTH_ENABLED !== undefined) getUserInfoList();
  }, [AUTH_ENABLED]);

  return (
    <Stack className={styles.chatEmptyState}>
      <ShieldLockRegular
        className={styles.chatIcon}
        style={{ color: "darkorange", height: "200px", width: "200px" }}
      />
      <h1 className={styles.chatEmptyStateTitle}>
        Authentication Not Configured
      </h1>
      <h2 className={styles.chatEmptyStateSubtitle}>
        This app does not have authentication configured. Please add an identity
        provider by finding your app in the{" "}
        <a href="https://portal.azure.com/" target="_blank">
          Azure Portal
        </a>
        and following{" "}
        <a
          href="https://learn.microsoft.com/en-us/azure/app-service/scenario-secure-app-authentication-app-service#3-configure-authentication-and-authorization"
          target="_blank"
        >
          these instructions
        </a>
        .
      </h2>
      <h2
        className={styles.chatEmptyStateSubtitle}
        style={{ fontSize: "20px" }}
      >
        <strong>
          Authentication configuration takes a few minutes to apply.{" "}
        </strong>
      </h2>
      <h2
        className={styles.chatEmptyStateSubtitle}
        style={{ fontSize: "20px" }}
      >
        <strong>
          If you deployed in the last 10 minutes, please wait and reload the
          page after 10 minutes.
        </strong>
      </h2>
    </Stack>
  );
};

export default ChatAuth;
