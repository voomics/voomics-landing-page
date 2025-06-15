
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ExternalLink } from "lucide-react";
import { WaitlistEntry, exportWaitlistToCsv } from "@/services/waitlistService";
import { STORAGE_URL } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WaitlistTableProps {
  waitlistData: WaitlistEntry[];
}

export const WaitlistTable = ({ waitlistData }: WaitlistTableProps) => {
  console.log("📊 WaitlistTable component rendered");
  console.log("📊 Received waitlistData:", waitlistData);
  console.log("📊 Data length:", waitlistData?.length || 0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [showMobileOnly, setShowMobileOnly] = useState(false);
  const [showNotificationOnly, setShowNotificationOnly] = useState(false);
  
  // Apply filters
  const filteredData = waitlistData.filter(entry => {
    // Text search
    const matchesSearch = searchQuery === "" || 
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.suggestions && entry.suggestions.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.story_idea && entry.story_idea.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Role filter
    const matchesRole = filterRole === "all" || entry.role === filterRole;
    
    // Mobile filter
    const matchesMobile = !showMobileOnly || (entry.mobile && entry.mobile.trim() !== "");
    
    // Notification filter
    const matchesNotification = !showNotificationOnly || entry.notify_creator_tools === true;
    
    return matchesSearch && matchesRole && matchesMobile && matchesNotification;
  });

  console.log("📊 Filtered data:", filteredData);
  console.log("📊 Filtered data length:", filteredData.length);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => exportWaitlistToCsv(filteredData)}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">Advanced Filters</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="reader">Readers Only</SelectItem>
                  <SelectItem value="creator">Creators Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mobile-filter" 
                checked={showMobileOnly} 
                onCheckedChange={(value) => setShowMobileOnly(!!value)} 
              />
              <Label htmlFor="mobile-filter">Show only with mobile numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notification-filter" 
                checked={showNotificationOnly} 
                onCheckedChange={(value) => setShowNotificationOnly(!!value)} 
              />
              <Label htmlFor="notification-filter">Show only interested in notifications</Label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="rounded-md border shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Notify</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[250px]">Content</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((entry) => {
              console.log("📊 Rendering table row for entry:", entry);
              return (
                <TableRow key={entry.id} className="group">
                  <TableCell className="font-medium">{entry.email}</TableCell>
                  <TableCell>
                    <Badge variant={entry.role === 'reader' ? 'secondary' : 'default'}>
                      {entry.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.mobile || "-"}</TableCell>
                  <TableCell>{entry.notify_creator_tools ? "Yes" : "No"}</TableCell>
                  <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="relative max-w-xs truncate p-0 transition-all">
                    <Collapsible className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {entry.role === 'reader' ? entry.suggestions : entry.story_idea || "-"}
                        </span>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                            <span className="sr-only">View details</span>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="mt-2 space-y-2 text-sm">
                        {entry.role === 'reader' ? (
                          <div>
                            <p className="font-medium text-muted-foreground">Suggestions:</p>
                            <p className="whitespace-pre-wrap">{entry.suggestions || "-"}</p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="font-medium text-muted-foreground">Story Idea:</p>
                              <p className="whitespace-pre-wrap">{entry.story_idea || "-"}</p>
                            </div>
                            {entry.file_url && (
                              <div>
                                <p className="font-medium text-muted-foreground">Attached File:</p>
                                <a
                                  href={entry.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  View File <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {waitlistData.length === 0 ? (
                    <div>
                      <p>No waitlist data found.</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Debug: Original data length: {waitlistData.length}
                      </p>
                    </div>
                  ) : (
                    "No results found with current filters."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredData.length} of {waitlistData.length} entries
        <br />
        <span className="text-xs text-gray-400">
          Debug info: Original data: {waitlistData.length}, Filtered: {filteredData.length}
        </span>
      </div>
    </div>
  );
};
