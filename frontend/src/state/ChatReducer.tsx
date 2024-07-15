import { ChatAction, ChatState } from "./ChatProvider";

// Define the reducer function
export const chatStateReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SHOW_LOADING_MESSAGE":
      return { ...state, showLoadingMessage: action.payload };
    case "SET_CLEARING_CHAT":
      return { ...state, clearingChat: action.payload };
    case "SET_ERR_MESSAGE":
      return { ...state, errorMsg: action.payload };
    case "TOGGLE_HIDE_ERR_DIALOG":
      return { ...state, hideErrorDialog: !state.hideErrorDialog };
    case "SET_SHOW_AUTH_MESSAGE":
      return { ...state, showAuthMessage: action.payload };
    case "SET_ACTIVE_CITATION":
      return { ...state, activeCitation: action.payload };
    case "SET_CITATION_PANEL_OPEN":
      return { ...state, isCitationPanelOpen: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "PROCESS_MESSAGES":
      return { ...state, processMessages: action.payload };
    default:
      return state;
  }
};
