
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOverallAnalytics, getAnalyticsSummary } from '@/services/analyticsService';
import { Eye, Users, Monitor, TrendingUp } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const { data: overallStats, isLoading: statsLoading } = useQuery({
    queryKey: ['overall-analytics'],
    queryFn: getOverallAnalytics,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => getAnalyticsSummary(7), // Last 7 days
    refetchInterval: 60000, // Refetch every minute
  });

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="h-16 bg-gray-100"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Views",
      value: overallStats?.total_views || 0,
      icon: Eye,
      description: "All-time page views",
    },
    {
      title: "Unique Visitors",
      value: overallStats?.unique_visitors || 0,
      icon: Users,
      description: "Unique visitors tracked",
    },
    {
      title: "Sessions",
      value: overallStats?.total_sessions || 0,
      icon: Monitor,
      description: "Total user sessions",
    },
    {
      title: "Today's Views",
      value: overallStats?.today_views || 0,
      icon: TrendingUp,
      description: "Views today",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!summaryLoading && summaryData && summaryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Page views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summaryData.slice(0, 5).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{day.page_path}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    {day.total_views} views, {day.unique_visitors} visitors
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
