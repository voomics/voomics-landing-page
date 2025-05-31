
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { getWaitlistEntries } from "@/services/waitlistService";

const WaitlistCharts = () => {
  const { data: waitlistData = [], isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: getWaitlistEntries,
  });

  // Prepare data for role distribution chart
  const roleDistributionData = useMemo(() => {
    if (!waitlistData.length) return [];
    
    const roleCounts = waitlistData.reduce((acc, entry) => {
      acc[entry.role] = (acc[entry.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
  }, [waitlistData]);

  // Prepare data for sign-ups over time
  const signupTimelineData = useMemo(() => {
    if (!waitlistData.length) return [];
    
    // Group by date
    const dateGroups = waitlistData.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, count: 0, readers: 0, creators: 0 };
      }
      acc[date].count += 1;
      if (entry.role === 'reader') {
        acc[date].readers += 1;
      } else if (entry.role === 'creator') {
        acc[date].creators += 1;
      }
      return acc;
    }, {} as Record<string, { date: string; count: number; readers: number; creators: number }>);
    
    // Convert to array and sort by date
    return Object.values(dateGroups).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [waitlistData]);

  // Calculate cumulative signups over time
  const cumulativeSignupData = useMemo(() => {
    if (!signupTimelineData.length) return [];
    
    let readerTotal = 0;
    let creatorTotal = 0;
    
    return signupTimelineData.map(day => {
      readerTotal += day.readers;
      creatorTotal += day.creators;
      return {
        date: day.date,
        readers: readerTotal,
        creators: creatorTotal,
        total: readerTotal + creatorTotal
      };
    });
  }, [signupTimelineData]);

  // Colors for charts
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="h-80 bg-gray-100"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>Breakdown of signups by role</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            config={{
              reader: { color: "#4f46e5", label: "Readers" },
              creator: { color: "#10b981", label: "Creators" }
            }}
          >
            <PieChart>
              <Pie
                data={roleDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {roleDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip />
              <ChartLegend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Daily Signups</CardTitle>
          <CardDescription>Daily registration trends</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer
            config={{
              readers: { color: "#4f46e5", label: "Readers" },
              creators: { color: "#10b981", label: "Creators" }
            }}
          >
            <BarChart data={signupTimelineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="readers" fill="#4f46e5" stackId="a" />
              <Bar dataKey="creators" fill="#10b981" stackId="a" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-all md:col-span-2">
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
          <CardDescription>Cumulative signups over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer
            config={{
              total: { color: "#8b5cf6", label: "Total Signups" },
              readers: { color: "#4f46e5", label: "Readers" },
              creators: { color: "#10b981", label: "Creators" }
            }}
          >
            <LineChart data={cumulativeSignupData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="readers" stroke="#4f46e5" strokeWidth={1} />
              <Line type="monotone" dataKey="creators" stroke="#10b981" strokeWidth={1} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistCharts;
