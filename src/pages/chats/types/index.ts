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
  modelName?: string;
  messages: ChatMessage[];
}
