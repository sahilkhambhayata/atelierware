// Utility function for consistent logging with tab ID and labels
export const logWithTab = (label, message, data = null, type = 'log') => {
  const tabId = typeof window !== 'undefined' ? window.location.pathname : 'unknown';
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [TAB: ${tabId}] [${label}]`;
  
  switch (type) {
    case 'error':
      console.error(prefix, message, data ? data : '');
      break;
    case 'warn':
      console.warn(prefix, message, data ? data : '');
      break;
    case 'info':
      console.info(prefix, message, data ? data : '');
      break;
    default:
      console.log(prefix, message, data ? data : '');
  }
};

export const logError = (label, message, data = null) => {
  logWithTab(label, message, data, 'error');
};

export const logWarn = (label, message, data = null) => {
  logWithTab(label, message, data, 'warn');
};

export const logInfo = (label, message, data = null) => {
  logWithTab(label, message, data, 'info');
};

export const logDebug = (label, message, data = null) => {
  logWithTab(label, message, data, 'log');
};
