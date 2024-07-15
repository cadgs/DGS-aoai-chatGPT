import { useContext } from "react";
import { Dialog, DialogType } from "@fluentui/react";
import { ErrorMessage } from "../../api";

import { ChatStateContext } from "../../state/ChatProvider";

const ChatErrorDialog = () => {
  const chatStateContext = useContext(ChatStateContext);

  /*
  ===============================================================
  Add facade for chatStateContext function setErrorMsg 
  ===============================================================
  */
  //const [errorMsg, setErrorMsg] = useState<ErrorMessage | null>();
  const errorMsg = chatStateContext?.state.errorMsg;
  const setErrorMsg = (errorMsg: ErrorMessage | null) => {
    chatStateContext?.dispatch({
      type: "SET_ERR_MESSAGE",
      payload: errorMsg,
    });
  };

  /* 
  ===============================================================
  Add facade for chatStateContext function toggleErrorDialog 
  ===============================================================  
  */
  //const [hideErrorDialog, { toggle: toggleErrorDialog }] = useBoolean(true);
  const hideErrorDialog = chatStateContext?.state.hideErrorDialog;
  const toggleErrorDialog = () => {
    chatStateContext?.dispatch({
      type: "TOGGLE_HIDE_ERR_DIALOG",
    });
  };

  const errorDialogContentProps = {
    type: DialogType.close,
    title: errorMsg?.title,
    closeButtonAriaLabel: "Close",
    subText: errorMsg?.subtitle,
  };

  const modalProps = {
    titleAriaId: "labelId",
    subtitleAriaId: "subTextId",
    isBlocking: true,
    styles: { main: { maxWidth: 450 } },
  };

  const handleErrorDialogClose = () => {
    toggleErrorDialog();
    setTimeout(() => {
      setErrorMsg(null);
    }, 500);
  };

  return (
    <Dialog
      hidden={hideErrorDialog}
      onDismiss={handleErrorDialogClose}
      dialogContentProps={errorDialogContentProps}
      modalProps={modalProps}
    ></Dialog>
  );
};

export default ChatErrorDialog;
