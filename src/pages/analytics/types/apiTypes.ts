export interface AnalyticsDateRangeParams {
  from?: string;
  to?: string;
}

export interface AnalyticsPaginatedParams {
  limit?: number;
  offset?: number;
}

export interface AnalyticsOverview {
  totalChats: number;
  totalMessages: number;
  totalTokens: number;
  totalCost: number;
  averageLatency: number;
}

export interface AnalyticsModel {
  model: string;
  requests: number;
  tokens: number;
  cost: number;
}

export type AnalyticsModelsResponse = AnalyticsModel[];

export interface UsageByDayItem {
  date: string;
  messages: number;
  tokens: number;
  cost: string;
}

export interface AnalyticsChat {
  chatId: string;
  title: string;
  messageCount: number;
  totalTokens: number;
  estimatedCost: string;
  lastMessageAt: string;
}

export interface AnalyticsChatsResponse {
  data: AnalyticsChat[];
  total: number;
}
