import React from "react";
import styles from "./Guideline.module.css";
import { useContext, useEffect, useState } from "react";
import { Dialog, Stack, TextField, Text } from "@fluentui/react";
import useLocalStorage from "use-local-storage";

export const Guideline = () => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState<boolean>(true);
  // Add useEffect for Guidelines Popup
  useEffect(() => {
    setIsGuidelinesOpen(true);
  }, []);

  const handleGuidelinesDismiss = () => {
    setIsGuidelinesOpen(false);
  };

  return (
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
                maxWidth: isMobile ? "120px" : "600px",
                minWidth: isMobile ? "100px" : "550px",
                background: isDark ? "#2D2D2D" : "#FFFFFF",
                color: isDark ? "#FFFFFF" : "#2D2D2D",
                borderRadius: "8px",
                maxHeight: isMobile ? "220px" : "600px",
                minHeight: isMobile ? "200px" : "550px",
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
            <div
              className={
                isMobile
                  ? styles.guidelineMobileContainer
                  : styles.guidelineContainer
              }
            >
              <p>
                The security and privacy of our consumer, employee and partner
                information is a top priority. Please follow these important
                guidelines to ensure your interaction with GenAI remains secure
                and confidential:
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
                This tool aims to support state entities in self-assessing risk
                levels, collaborating with control agencies on higher-risk use
                cases, and documenting and sharing learnings throughout GenAI
                experimentation. It is designed to evolve based on user feedback
                and evolving best practices in GenAI.
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
  );
};
