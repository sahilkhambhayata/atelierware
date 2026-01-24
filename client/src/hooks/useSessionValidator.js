import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TokenAdmin } from '../redux/actions/loginAction';
import { logInfo, logError, logDebug, logWarn } from '../utils/logger';

const useSessionValidator = (validateInterval = 5 * 60 * 1000) => { // Default: 5 minutes
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  useEffect(() => {
    const validateSession = () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const tabId = localStorage.getItem('tabId') || 'N/A';
      
      logDebug('SESSION_VALIDATOR', 'Running periodic session validation', {
        tabId: tabId,
        userId: userId,
        hasToken: !!token,
        interval: validateInterval
      });
      
      if (userId && token) {
        logInfo('SESSION_VALIDATOR', 'Validating session for user', {
          tabId: tabId,
          userId: userId
        });
        
        dispatch(TokenAdmin(userId));
      } else {
        logWarn('SESSION_VALIDATOR', 'Skipping validation - missing credentials', {
          tabId: tabId,
          hasUserId: !!userId,
          hasToken: !!token
        });
      }
    };

    logInfo('SESSION_VALIDATOR_INIT', 'Initializing session validator', {
      interval: validateInterval,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });

    // Set up periodic validation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      logDebug('SESSION_VALIDATOR', 'Cleared previous interval');
    }
    
    intervalRef.current = setInterval(validateSession, validateInterval);
    logInfo('SESSION_VALIDATOR', `Set up validation interval: ${validateInterval}ms`);

    // Initial validation
    validateSession();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        logDebug('SESSION_VALIDATOR', 'Cleared interval on unmount');
      }
    };
  }, [dispatch, validateInterval]);

  return null;
};

export default useSessionValidator;
