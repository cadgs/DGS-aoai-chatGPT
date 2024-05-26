import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Contoso from "../../assets/Contoso.svg";
import { CopyRegular } from "@fluentui/react-icons";
import { Stack } from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import {
  HistoryButton,
  //ShareButton,
  FeedbackButton,
} from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus } from "../../api";
import { ThemeToggler } from "../../components/ThemeToggler/ThemeToggler";
import { Guideline } from "../../components/Guideline/Guideline";

const Layout = () => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
  const [copyClicked, setCopyClicked] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>("Copy URL");
  //const [shareLabel, setShareLabel] = useState<string | undefined>("Share");
  const [feedbackLabel, setFeedbackLabel] = useState<string | undefined>(
    "Feedback"
  );
  const [hideHistoryLabel, setHideHistoryLabel] =
    useState<string>("Hide chat history");
  const [showHistoryLabel, setShowHistoryLabel] =
    useState<string>("Show chat history");
  const appStateContext = useContext(AppStateContext);
  const ui = appStateContext?.state.frontendSettings?.ui;

  //const handleShareClick = () => {
  //  setIsSharePanelOpen(true);
  //};

  const handleFeedbackClick = () => {
    // Feedback form URL
    // const feedbackURL = ui?.feedback_url;
    // window.open(feedbackURL, "_blank");
    // alert(feedbackURL);
    window.open(
      "https://forms.office.com/Pages/ResponsePage.aspx?id=sfdF6tcHqEm49TcTbsk4Lf9zgloA4zJBq3X6bgkEGcFUNDJESkdJS1pRTEJQSk84UlFMVzBXMVZWSS4u",
      "_blank"
    );
  };

  /*
  const handleSharePanelDismiss = () => {
    setIsSharePanelOpen(false);
    setCopyClicked(false);
    setCopyText("Copy URL");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyClicked(true);
  };*/

  const handleHistoryClick = () => {
    appStateContext?.dispatch({ type: "TOGGLE_CHAT_HISTORY" });
  };

  useEffect(() => {
    if (copyClicked) {
      setCopyText("Copied URL");
    }
  }, [copyClicked]);

  useEffect(() => {}, [appStateContext?.state.isCosmosDBAvailable.status]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        //setShareLabel(undefined);
        setFeedbackLabel(undefined);
        setHideHistoryLabel("Hide history");
        setShowHistoryLabel("Show history");
      } else {
        //setShareLabel("Share");
        setFeedbackLabel("Feedback");
        setHideHistoryLabel("Hide chat history");
        setShowHistoryLabel("Show chat history");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.layout} data-theme={isDark ? "dark" : "light"}>
      <header className={styles.header} role={"banner"}>
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
        >
          <Stack horizontal verticalAlign="center">
            <img
              src={ui?.logo ? ui.logo : Contoso}
              className={styles.headerIcon}
              aria-hidden="true"
            />
            <Link to="/" className={styles.headerTitleContainer}>
              <h1 className={styles.headerTitle}>{ui?.title}</h1>
            </Link>
          </Stack>
          <Stack
            horizontal
            tokens={{ childrenGap: 4 }}
            className={styles.shareButtonContainer}
          >
            {appStateContext?.state.isCosmosDBAvailable?.status !==
              CosmosDBStatus.NotConfigured && (
              <HistoryButton
                onClick={handleHistoryClick}
                text={
                  appStateContext?.state?.isChatHistoryOpen
                    ? hideHistoryLabel
                    : showHistoryLabel
                }
              />
            )}
            {ui?.show_feedback_button && (
              <FeedbackButton
                onClick={handleFeedbackClick}
                text={feedbackLabel}
              />
            )}
          </Stack>
        </Stack>
      </header>
      <Outlet />
      <div className={styles.footer}>
        <ThemeToggler
          isChecked={isDark}
          handleChange={() => setIsDark(!isDark)}
        />
      </div>
      <Guideline />
    </div>
  );
};

export default Layout;
