
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/services/analyticsService';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when component mounts or route changes
    trackPageView(location.pathname + location.search);
  }, [location]);

  return {
    trackPageView,
  };
};
