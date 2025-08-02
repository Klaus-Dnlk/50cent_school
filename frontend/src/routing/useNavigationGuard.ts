import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationGuardOptions {
  enabled?: boolean;
  message?: string;
  onBeforeNavigate?: () => boolean | Promise<boolean>;
}

export const useNavigationGuard = (options: NavigationGuardOptions = {}) => {
  const { enabled = true, message = 'Are you sure you want to leave this page?', onBeforeNavigate } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (onBeforeNavigate) {
        const shouldAllow = onBeforeNavigate();
        if (shouldAllow === false) {
          event.preventDefault();
          event.returnValue = message;
          return message;
        }
      }
    };

    const handlePopState = async (event: PopStateEvent) => {
      if (isNavigatingRef.current) return;
      
      if (onBeforeNavigate) {
        const shouldAllow = await onBeforeNavigate();
        if (shouldAllow === false) {
          event.preventDefault();
          window.history.pushState(null, '', location.pathname);
          return;
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enabled, message, onBeforeNavigate, location.pathname]);

  const safeNavigate = (to: string, options?: { replace?: boolean; state?: any }) => {
    isNavigatingRef.current = true;
    navigate(to, options);
  };

  return { safeNavigate };
}; 