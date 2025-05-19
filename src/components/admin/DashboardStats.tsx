
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WaitlistEntry } from "@/services/waitlistService";

interface DashboardStatsProps {
  waitlistData: WaitlistEntry[];
}

export const DashboardStats = ({ waitlistData }: DashboardStatsProps) => {
  // Calculate statistics
  const totalSignups = waitlistData.length;
  const readerCount = waitlistData.filter(entry => entry.role === 'reader').length;
  const creatorCount = waitlistData.filter(entry => entry.role === 'creator').length;
  const mobileCount = waitlistData.filter(entry => entry.mobile).length;
  const notifyCount = waitlistData.filter(entry => entry.notify_creator_tools).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Signups</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalSignups}</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Readers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <p className="text-2xl font-bold">{readerCount}</p>
          <p className="text-xs text-muted-foreground">
            {totalSignups > 0 ? Math.round((readerCount / totalSignups) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Creators</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <p className="text-2xl font-bold">{creatorCount}</p>
          <p className="text-xs text-muted-foreground">
            {totalSignups > 0 ? Math.round((creatorCount / totalSignups) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Mobile Provided</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <p className="text-2xl font-bold">{mobileCount}</p>
          <p className="text-xs text-muted-foreground">
            {totalSignups > 0 ? Math.round((mobileCount / totalSignups) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tools Interest</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <p className="text-2xl font-bold">{notifyCount}</p>
          <p className="text-xs text-muted-foreground">
            {totalSignups > 0 ? Math.round((notifyCount / totalSignups) * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
