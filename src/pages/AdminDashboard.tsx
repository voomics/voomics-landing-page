
import React from 'react';
import DashboardStats from '@/components/admin/DashboardStats';
import WaitlistCharts from '@/components/admin/WaitlistCharts';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

console.log("🏠 AdminDashboard component file loaded");

const AdminDashboard: React.FC = () => {
  console.log("🏠 AdminDashboard component rendering...");
  console.log("🏠 AdminDashboard component props and state check");
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your waitlist performance and site analytics.
        </p>
      </div>
      
      <DashboardStats />
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Site Analytics</h2>
        <AnalyticsDashboard />
      </div>
      
      <WaitlistCharts />
    </div>
  );
};

console.log("🏠 AdminDashboard component exported");

export default AdminDashboard;
