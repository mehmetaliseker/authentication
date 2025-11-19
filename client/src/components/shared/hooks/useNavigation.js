import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Navigation hook'u (useNavigate wrapper)
export function useNavigation() {
  const navigate = useNavigate();
  
  const goTo = useCallback((path, options = {}) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  return {
    navigate,
    goTo,
    goBack,
    goForward
  };
}
