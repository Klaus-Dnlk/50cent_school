import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from './routes';

interface AsyncRedirectOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncRedirect = (options: AsyncRedirectOptions = {}) => {
  const navigate = useNavigate();
  const {
    onSuccess,
    onError,
    successMessage = 'Операція виконана успішно',
    errorMessage = 'Сталася помилка'
  } = options;

  const handleAsyncAction = useCallback(async <T>(
    action: () => Promise<T>,
    redirectTo?: string,
    successCallback?: (data: T) => void
  ) => {
    try {
      const result = await action();
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (successCallback) {
        successCallback(result);
      }

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
      
      return result;
    } catch (error) {
      if (onError) {
        onError(error);
      }
      
      console.error('Async action failed:', error);
      throw error;
    }
  }, [navigate, onSuccess, onError]);

  const redirectToHome = useCallback(() => {
    navigate(routes.home.absolute(), { replace: true });
  }, [navigate]);

  const redirectToLogin = useCallback(() => {
    navigate(routes.login.absolute(), { replace: true });
  }, [navigate]);

  const redirectBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    handleAsyncAction,
    redirectToHome,
    redirectToLogin,
    redirectBack
  };
}; 