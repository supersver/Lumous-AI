export type ChatRole = "user" | "assistant";

export interface ChatModelSnapshot {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  modelId?: string;
  modelName?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  model?: string;
  messages: ChatMessage[];
}

// APIs

export interface SendMessageInput {
  chatId: string;
  content: string;
  model: string;
}

export interface SendMessageResponseMessage {
  id: string;
  chatId: string;
  role: "assistant";
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  createdAt: string;
}

export interface SendMessageResponseUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: string;
  latencyMs: number;
}

export interface SendMessageResponse {
  message: SendMessageResponseMessage;
  usage: SendMessageResponseUsage;
}
