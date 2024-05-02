import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import Contoso from "../../assets/Contoso.svg";
import { CopyRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField, Text } from "@fluentui/react";
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

const Layout = () => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(true);
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

  // Add useEffect for Guidelines Popup
  useEffect(() => {
    setIsGuidelinesOpen(true);
  }, []);

  const handleGuidelinesDismiss = () => {
    setIsGuidelinesOpen(false);
  };

  //const handleShareClick = () => {
  //  setIsSharePanelOpen(true);
  //};

  const handleFeedbackClick = () => {
    // Feedback form URL
    const feedbackURL =
      "https://forms.office.com/Pages/ResponsePage.aspx?id=sfdF6tcHqEm49TcTbsk4Lf9zgloA4zJBq3X6bgkEGcFUNDJESkdJS1pRTEJQSk84UlFMVzBXMVZWSS4u";
    window.open(feedbackURL, "_blank");
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
      <Dialog
        modalProps={{
          isBlocking: true,
        }}
        onDismiss={handleGuidelinesDismiss}
        hidden={!isGuidelinesOpen}
        styles={{
          main: [
            {
              selectors: {
                ["@media (min-width: 600px)"]: {
                  maxWidth: "600px",
                  minWidth: "550px",
                  background: isDark ? "#2D2D2D" : "#FFFFFF",
                  color: isDark ? "#FFFFFF" : "#2D2D2D",
                  borderRadius: "8px",
                  maxHeight: "600px",
                  minHeight: "550px",
                },
              },
            },
          ],
        }}
        dialogContentProps={{
          title: "GenAI Guidelines",
          showCloseButton: false,
          titleProps: { className: styles.titleCenterText },
        }}
      >
        <Stack verticalFill horizontalAlign="center" style={{ gap: "4px" }}>
          <>
            <div>
              <div className={styles.centerText}>
                <p>By using DGS AI Chat, you agree to the following</p>
              </div>
              <div className={styles.guidelineContainer}>
                <p>
                  The security and privacy of our consumer, employee and partner
                  information is a top priority. Please follow these important
                  guidelines to ensure your interaction with GenAI remains
                  secure and confidential:
                </p>
                <ol>
                  <li>
                    <b>DO NOT</b> install or use any generative artificial
                    intelligence (or GenAI) tool other than this one on any
                    devices issued by DGS or for any DGS business use.
                  </li>
                  <li>
                    <b>DO NOT</b> use any personally identifiable information
                    (PII), personal health inforamtion (PHI), federal tax
                    information (FTI), or other non-public, sensitive, or
                    confidential information as input into any GenAI tool.{" "}
                  </li>
                  <li>
                    <b>DO NOT</b> depend on or share content from a GenAI tool
                    before reviewing and fact-checking it. GenAI content should
                    support, not replace, your work product.
                  </li>
                </ol>
                <p>
                  This tool aims to support state entities in self-assessing
                  risk levels, collaborating with control agencies on
                  higher-risk use cases, and documenting and sharing learnings
                  throughout GenAI experimentation. It is designed to evolve
                  based on user feedback and evolving best practices in GenAI.
                </p>
                <p>
                  Please note that this is a living resource and may be updated
                  over time to meet the needs of state staff navigating the
                  complex landscape of GenAI. For more detailed information and
                  access to the tool, you can refer to the official DGS
                  documentation.
                </p>
              </div>
            </div>
          </>
          <div
            className={styles.guidelineButtonContainer}
            role="button"
            tabIndex={0}
            aria-label="Agree and Continue"
            onClick={handleGuidelinesDismiss}
          >
            Agree and Continue
          </div>
        </Stack>
      </Dialog>
    </div>
  );
};

export default Layout;
