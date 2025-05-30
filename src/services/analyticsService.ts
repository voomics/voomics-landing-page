
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  pageView: {
    page_path: string;
    visitor_ip?: string;
    user_agent?: string;
    referrer?: string;
    country?: string;
    city?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    session_id?: string;
  };
}

export interface OverallAnalytics {
  total_views: number;
  unique_visitors: number;
  total_sessions: number;
  today_views: number;
  today_unique_visitors: number;
}

// Generate or get session ID from sessionStorage
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
};

// Detect browser
const getBrowser = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

// Detect OS
const getOS = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

export const trackPageView = async (pagePath: string = window.location.pathname): Promise<void> => {
  try {
    console.log("Tracking page view for:", pagePath);
    
    const analyticsData = {
      page_path: pagePath,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      session_id: getSessionId(),
    };

    const { error } = await supabase
      .from('page_analytics')
      .insert(analyticsData);

    if (error) {
      console.error("Error tracking page view:", error);
    } else {
      console.log("Page view tracked successfully");
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
};

export const getOverallAnalytics = async (): Promise<OverallAnalytics | null> => {
  try {
    console.log("Fetching overall analytics...");
    
    const { data, error } = await supabase
      .rpc('get_overall_analytics');

    if (error) {
      console.error("Error fetching analytics:", error);
      return null;
    }

    console.log("Analytics data retrieved:", data);
    return data?.[0] || null;
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return null;
  }
};

export const getAnalyticsSummary = async (days: number = 30): Promise<any[]> => {
  try {
    console.log(`Fetching analytics summary for last ${days} days...`);
    
    const { data, error } = await supabase
      .from('analytics_summary')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching analytics summary:", error);
      return [];
    }

    console.log("Analytics summary retrieved:", data?.length || 0, "entries");
    return data || [];
  } catch (error) {
    console.error("Analytics summary fetch error:", error);
    return [];
  }
};
