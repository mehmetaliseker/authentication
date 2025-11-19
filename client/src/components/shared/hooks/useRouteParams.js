import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

// Params hook'u (useParams wrapper)
export function useRouteParams() {
  const params = useParams();
  
  const getParam = useCallback((key) => {
    return params[key];
  }, [params]);

  return {
    params,
    getParam
  };
}
