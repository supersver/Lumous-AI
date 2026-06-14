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
  status?: ChatMessageStatus;
  error?: string;
}

export type ChatMessageStatus =
  | "optimistic"
  | "streaming"
  | "complete"
  | "error";

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

export interface StreamMessageInput {
  chatId: string;
  content: string;
  model: string;
}

export type ChatStreamEventType = "start" | "token" | "complete" | "error";

export interface ChatStreamStartPayload {
  id?: string;
  messageId?: string;
  assistantMessageId?: string;
}

export interface ChatStreamTokenPayload {
  token?: string;
  delta?: string;
  content?: string;
}

export interface ChatStreamCompletePayload {
  id?: string;
  messageId?: string;
  content?: string;
  message?: Partial<ChatMessage>;
}

export interface ChatStreamErrorPayload {
  message?: string;
  error?: string;
}

export type SSEPayload = {
  assistantMessageId?: string;
  messageId?: string;
  id?: string;
  token?: string;
  delta?: string;
  content?: string;
  createdAt?: string;
  modelId?: string;
  modelName?: string;
  message?:
    | {
        id?: string;
        content?: string;
        createdAt?: string;
        modelId?: string;
        modelName?: string;
      }
    | string;
  error?: string;
};
