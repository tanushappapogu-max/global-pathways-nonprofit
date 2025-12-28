import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from '@/integrations/supabase/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// AI TOOL USAGE TRACKING
// ============================================

// Generate or get session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

interface TrackUsageParams {
  toolName: string;
  inputData?: any;
  resultsCount?: number;
  resultsData?: any;
  userId?: string;
  userEmail?: string;
}

export const trackToolUsage = async ({
  toolName,
  inputData,
  resultsCount,
  resultsData,
  userId,
  userEmail
}: TrackUsageParams) => {
  try {
    const sessionId = getSessionId();
    
    // Get user info from Supabase auth if available
    const { data: { user } } = await supabase.auth.getUser();
    
    const usageData = {
      session_id: sessionId,
      tool_name: toolName,
      input_data: inputData,
      results_count: resultsCount,
      results_data: resultsData,
      is_authenticated: !!user,
      user_id: user?.id || userId || null,
      user_email: user?.email || userEmail || null,
      user_agent: navigator.userAgent,
      started_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ai_tool_usage')
      .insert(usageData)
      .select()
      .single();

    if (error) {
      console.error('Error tracking usage:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error tracking usage:', error);
    return null;
  }
};

// Update usage when completed
export const completeToolUsage = async (usageId: string, resultsCount: number, resultsData?: any) => {
  try {
    const { error } = await supabase
      .from('ai_tool_usage')
      .update({
        completed_at: new Date().toISOString(),
        results_count: resultsCount,
        results_data: resultsData
      })
      .eq('id', usageId);

    if (error) {
      console.error('Error completing usage tracking:', error);
    }
  } catch (error) {
    console.error('Error completing usage tracking:', error);
  }
};