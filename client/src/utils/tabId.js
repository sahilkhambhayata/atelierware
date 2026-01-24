// Utility to generate and manage tab IDs for debugging
export const generateTabId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `tab_${timestamp}_${random}`;
};

export const initializeTabId = () => {
  if (typeof window !== 'undefined') {
    let tabId = localStorage.getItem('tabId');
    if (!tabId) {
      tabId = generateTabId();
      localStorage.setItem('tabId', tabId);
      console.log(`[TAB_ID_INIT] Generated new tab ID: ${tabId}`);
    } else {
      console.log(`[TAB_ID_INIT] Using existing tab ID: ${tabId}`);
    }
    return tabId;
  }
  return 'N/A';
};

export const getTabId = () => {
  return localStorage.getItem('tabId') || 'N/A';
};

export const clearTabId = () => {
  localStorage.removeItem('tabId');
};
