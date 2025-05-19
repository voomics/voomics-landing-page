
import React, { useEffect, useState } from "react";
import { fetchWaitlistData } from "@/services/adminService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the waitlist entry type
interface WaitlistEntry {
  id: string;
  email: string;
  role: 'reader' | 'creator';
  mobile: string | null;
  notify_creator_tools: boolean | null;
  suggestions: string | null;
  story_idea: string | null;
  file_url: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWaitlistData();
      setWaitlistData(data);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Prepare data for role distribution chart
  const roleDistributionData = React.useMemo(() => {
    if (!waitlistData.length) return [];
    
    const roleCounts = waitlistData.reduce((acc, entry) => {
      acc[entry.role] = (acc[entry.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
  }, [waitlistData]);

  // Prepare data for sign-ups over time
  const signupTimelineData = React.useMemo(() => {
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

  // Export data as CSV
  const exportCSV = () => {
    if (!waitlistData.length) return;
    
    // Create CSV headers
    const headers = [
      "ID", 
      "Email", 
      "Role", 
      "Mobile", 
      "Notify Creator Tools", 
      "Suggestions", 
      "Story Idea", 
      "File URL", 
      "Created At"
    ].join(",");
    
    // Create CSV rows
    const rows = waitlistData.map(entry => [
      entry.id,
      entry.email,
      entry.role,
      entry.mobile || "",
      entry.notify_creator_tools ? "Yes" : "No",
      entry.suggestions ? `"${entry.suggestions.replace(/"/g, '""')}"` : "",
      entry.story_idea ? `"${entry.story_idea.replace(/"/g, '""')}"` : "",
      entry.file_url || "",
      entry.created_at
    ].join(","));
    
    // Combine headers and rows
    const csv = [headers, ...rows].join("\n");
    
    // Create download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `waitlist_data_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Colors for charts
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Waitlist Dashboard</h1>
        <Button onClick={exportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{waitlistData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Readers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {waitlistData.filter(entry => entry.role === 'reader').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {waitlistData.filter(entry => entry.role === 'creator').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Signups Over Time</CardTitle>
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
      </div>

      {/* Waitlist data table */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
          <CardDescription>
            All waitlist registrations ({waitlistData.length} entries)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Notify</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Suggestions</TableHead>
                  <TableHead>Story Idea</TableHead>
                  <TableHead>File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlistData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.email}</TableCell>
                    <TableCell className="capitalize">{entry.role}</TableCell>
                    <TableCell>{entry.mobile || "-"}</TableCell>
                    <TableCell>{entry.notify_creator_tools ? "Yes" : "No"}</TableCell>
                    <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.suggestions || "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.story_idea || "-"}
                    </TableCell>
                    <TableCell>
                      {entry.file_url ? (
                        <a 
                          href={`${supabase.storageUrl}/object/public/waitlist-uploads/${entry.file_url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
