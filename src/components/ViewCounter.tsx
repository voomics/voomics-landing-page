
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOverallAnalytics } from '@/services/analyticsService';
import { Eye } from 'lucide-react';

const ViewCounter: React.FC = () => {
  const { data: analytics } = useQuery({
    queryKey: ['overall-analytics-footer'],
    queryFn: getOverallAnalytics,
    refetchInterval: 60000, // Refetch every minute
  });

  if (!analytics?.total_views) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
      <Eye size={16} />
      <span>{analytics.total_views.toLocaleString()} total views</span>
    </div>
  );
};

export default ViewCounter;
